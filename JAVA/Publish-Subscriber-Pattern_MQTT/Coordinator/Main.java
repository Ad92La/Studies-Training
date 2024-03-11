package org.example;


import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import java.util.UUID;

import static java.lang.Thread.sleep;


class Coordinator implements MqttCallback {

    //Shortcut für Host und port
    private static final String myWorkingBroker = "tcp://localhost:1883";


    //Shortcut für den MqttClient
    private MqttClient myMqtt;

    //Alles für die Dartpfeile benötigte
    private long verbleibendeDarts = 0;
    private long gesamteDarts = 200000;
    private long workerPaket = 4000;
    private long actualHits = 0;
    private Long killValue = -1L;
    private Long secondChecker = 0L;

    //Allgemeine Shutdown-flag
    private boolean shutdownFlag = false;


    //Vordefinierte Topics für die Worker und die resultate/darts
    private static final String dartPackageTopic = "ais/coordinator/dartpackage/";
    private static final String dartResultTopic = "ais/coordinator/results/";
    private static final String workerDirectTopic = "ais/worker/mailbox/";



    //Um den Programmablauf nicht zu schnell durchlaufen zu lassen, soll der Pacemaker immer
    //wieder mal Pausen einbauen um quasi einen gewissen sende-Takt zu erzeugen
    public void paceMaker() {
        //solange die shutdownflag nicht gesetzt ist in einer endlosschleife pausen einbauen (lauftakt)
        System.out.println("Hello PACEMAKER!");
        while (!shutdownFlag) {
            try {
                sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    //Zusammenfassen der einzelnen commandos nach .connect in eine einzige connect methode
    public void connect(String source) throws MqttException {
        //Erstellen des MqttClients mit new ->
        //setzen des zielpfades (bei uns jetzt localhost und port 1883, inkl eindeutige ID für den Client ->
        //verbinden mit dem angegebenen Pfad ->
        //setzen der Callback methode ->
        myMqtt = new MqttClient(source, UUID.randomUUID().toString());
        myMqtt.connect();
        myMqtt.setCallback(this);
        //registrieren der einzelnen Topics beim broker -> nur die coordinator Topics
        myMqtt.subscribe(dartPackageTopic);
        myMqtt.subscribe(dartResultTopic + "+");
    }

    //Disconnect methode zur sicherstellung das die verbindung und der mqtt client geschlossen werden
    public void disconnect() throws MqttException {
        myMqtt.disconnect();
        myMqtt.close();
    }


//    Da der Coordinator den MqttCallback implementiert und standartfunktionen verpflichtet
//    sind so wie connectionLost, messageArrived und deliveryComplete kann man die eigentliche Arbeit in die
//    "messageArrived" funktion auslagern um die mainfunktion sauber zu halten.
    //In der Mainfunktion muss man somit nur mehr den coordinator erzeugen->
    //Im zweiten schritt mit connect und den parametern verbinden (siehe connect methode) ->
    //Dann wird der Pacemaker gesetzt um den programmablaub zu takten->
    //Bevor disconnect aufgerufen wird nochmal eine pause um verzögerungen auszugleichen->
    public static void main(String[] args) {
        try {
            Coordinator myCoordinator = new Coordinator();
            myCoordinator.verbleibendeDarts = myCoordinator.gesamteDarts;
            //bei connect(tcp als sicheres verbindungsprotocoll, ://der gewünschte netzwerkname, : Standartport 1883
            // SSL-Port:8883
            myCoordinator.connect(myWorkingBroker);
            myCoordinator.paceMaker();
            //Hier die letzte Pause vor dem Verbindungsabbruch
            Thread.sleep(2000);
            myCoordinator.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }



    @Override
    public void connectionLost(Throwable throwable) {
        System.out.println("Verbindung wurde unterbrochen!");
    }

    @Override
    public void messageArrived(String s, MqttMessage mqttMessage) throws Exception {
        //Ausgabe für die sicherstellung von welchem Topic eine Message reinkommt
//        System.out.println("Nachricht Empfangen für Topic: " + s);

        //Wenn nun das Topic das Package topic ist, wird somit ein neues Paket angefordert
        if (s.equals(dartPackageTopic)) {
            //.getPayload() gibt den Nutzlastinhalt der MQTT Nachricht zurück in diesem Fall die worker ID
            String workerId = new String(mqttMessage.getPayload());
            System.out.println("Worker mit der ID --" + workerId + "-- braucht ein neues Pfeilepaket!");

            if (verbleibendeDarts <= 0) {
                //Wenn die dartpfeile bei 0 angelangt sind wird eine negativeZahl als quasi exitcode gesendet,
                // um im workerprogramm die schleifen zu beenden.
                //Die Nachrichten müssen als bytecode gesendet werden somit bei allen nachrichten
                // eine .getBytes transformierung
                MqttMessage newMsg = new MqttMessage(Long.toString(killValue).getBytes());
                System.out.println("Dartpfeile sind AUS!!!!!");
                //Kleine Pause um sicherzustellen das alle fertig sind
                Thread.sleep(2000);
                //Broadcast nachricht an alle um die Worker zu beenden
                myMqtt.publish(workerDirectTopic + workerId, newMsg);
            } else if (verbleibendeDarts < workerPaket) {
                //Falls nun die verbleibenden Darts kleiner als das Workpaket ist werden nur die verbleibenden gesendet
                MqttMessage newMsg = new MqttMessage(Long.toString(verbleibendeDarts).getBytes());
                myMqtt.publish(workerDirectTopic + workerId, newMsg);
                verbleibendeDarts = 0;
            } else {
                MqttMessage newMsg = new MqttMessage(Long.toString(workerPaket).getBytes());
                myMqtt.publish(workerDirectTopic + workerId, newMsg);
//                System.out.println("To see = " + workerDirectTopic + workerId + " die menge: " + newMsg);
                verbleibendeDarts -= workerPaket;
            }
            //Sollte nun das Topic das ResultatTopic betreffen müssen die Daten verarbeitet werden
        } else if (s.startsWith(dartResultTopic)) {
//            System.out.println("GOT RESULT BACK");
            //das Topic splitten in ein String Array um die Worker ID und die hits herauszulösen
            String [] splittedMessage = s.split("/");
            //das topic sollte auf 4 teilen bestehen "ais/coordinator/results/<worker-id>
            //Somit ein check ob auch die ID übermittelt wird ansonsten werden die Daten nicht verarbeitet
            if (splittedMessage.length == 3) {
                String mqttMessageText = new String(mqttMessage.getPayload());
                Long hits = Long.parseLong(mqttMessageText);
                actualHits += hits;
//                System.out.println("GOT THE ACTUAL HITS");
//                System.out.println("VERBLEIBENDE DARTS: " + verbleibendeDarts);
                if (verbleibendeDarts <= 0) {
                    //Wenn die Pfeile verschossen sind wird noch etwas auf die ergebnisse der worker gewartet
                    Thread.sleep(3000);
                    double myPi = 4.0* ((double) actualHits / gesamteDarts);
                    System.out.println("Schätzung für Pi ist: " + myPi);
                    shutdownFlag = true;
                }
                //Falls nicht das richtige Topic ist bzw zu wenig parameter sind
            } else {
                System.out.println("Topic hat zu wenig oder zu viele parameter " + s);
            }
        } else {
            System.out.println("Topic ist nicht bekannt!");
        }
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
        System.out.println("Lieferung wurde completed!");
    }
}