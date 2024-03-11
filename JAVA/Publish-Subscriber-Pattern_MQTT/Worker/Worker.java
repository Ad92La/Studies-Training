package org.example;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;


import java.util.UUID;



import java.util.concurrent.ThreadLocalRandom;

public class Worker implements MqttCallback {

    //Shortcut für Host und port
    private static final String myWorkingBroker = "tcp://localhost:1883";


    //Shortcut für den MqttClient
    private MqttClient myMqtt;

    //Workerspezifische variablen
    private String thisWorkerId;
    private Long myTmpDarts = 0L;

    //Alle benötigten Topics
    private static final String dartPackageTopic = "ais/coordinator/dartpackage/";
    private static final String dartResultTopic = "ais/coordinator/results/";
    private static final String workerDirectTopic = "ais/worker/mailbox/";



    //Allgemeine Shutdown-flag
    private boolean shutdownFlag = false;


    //Same as Coordinator
    public void connect(String source) throws MqttException {
        //Erstellen des MqttClients mit new ->
        //setzen des zielpfades (bei uns jetzt localhost und port 1883, inkl eindeutige ID für den Worker ->
        thisWorkerId = UUID.randomUUID().toString();
        //verbinden mit dem angegebenen Pfad ->
        //setzen der Callback methode ->
        myMqtt = new MqttClient(source, thisWorkerId);
        myMqtt.connect();
        myMqtt.setCallback(this);
        //registrieren der einzelnen Topics beim broker -> nur die worker Topics
        myMqtt.subscribe(workerDirectTopic + thisWorkerId);

    }

    //Same as Coordinator
    public void disconnect() throws MqttException {
        myMqtt.disconnect();
        myMqtt.close();
    }

    //Nun die den empfang der gesendeten Dartmenge und die verarbeitung zu den hits für die PI berechnung
    public void myDartThrower() throws MqttException {
        while (!shutdownFlag) {
            //Neue Nachricht an das PackageTopic, gesendet wird die ID des workers und somit das Zeichen
            // dass man bereit ist Darts zu empfangen
            MqttMessage newMsg = new MqttMessage(thisWorkerId.getBytes());
            myMqtt.publish(dartPackageTopic,newMsg);


            //Slowdown für Debugging
            try {
                //gewolltes Busy-Waiting
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }



            //Solange keine Darts empfangen wurden wird im 500ms takt gewartet, sollte die shutdownflag gesetzt worden
            //sein in der zwischenzeit wird aus der while-schleife ausgebrochen
            while (myTmpDarts == 0) {
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            if (shutdownFlag) {
                break;
            }
            System.out.println("Darts empfangen und die würfe werden gestartet!!");
            //Aus dem letzten übungszettel
            long hitSum = 0;
            for (int i = 0; i < myTmpDarts; i++) {
                //generieren 2er coordinaten (inklusive)-1 bis Exklusive 1.000001 also inklusive 1
                double x = ThreadLocalRandom.current().nextDouble( -1.0, 1.000001);
                double y = ThreadLocalRandom.current().nextDouble(-1.0, 1.000001);

                //System.out.println(x + " XZahl" + y + " YZahl");

                //Berechnung des Einschlagspunktes mit Pythagoras
                double dartHit = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
                //Check wenn der einschlagspunkt kleiner als 1 ist dann ist er innerhalb des Kreises
                if (dartHit < 1) {
                    //Somit hinzufuegen zur summe der getroffenen Pfeile
                    hitSum++;
                }
            }
            System.out.println("Paket verschossen von Worker mit der Id: " + thisWorkerId);
            //Nun die getroffenen Hits zurücksenden an den Coordinator
            //Umwandeln des Ergebnisses in einen String
            String myHitMsgText = Long.toString(hitSum);
            //Umwandeln der Message in bytecode
            newMsg = new MqttMessage(myHitMsgText.getBytes());
            myMqtt.publish(dartResultTopic, newMsg);
//            System.out.println("Ergebnisse werden gesendet!");
//            System.out.println("WIRD GESENDET AN: " + dartResultTopic + thisWorkerId);
            myTmpDarts = 0L;
        }
    }


    public static void main(String[] args) {
        try {
            Worker newWorker = new Worker();
            newWorker.connect(myWorkingBroker);
            newWorker.myDartThrower();
            newWorker.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public void connectionLost(Throwable throwable) {
        System.out.println("Thihi connection got lost!");
    }

    @Override
    public void messageArrived(String s, MqttMessage mqttMessage) throws Exception {
        System.out.println("Nachricht bekommen für das topic: " + s);
        System.out.println("Worker ID- " + thisWorkerId);
        System.out.println("To see = " + workerDirectTopic + thisWorkerId);
        //Wenn die Nachricht direkt an diesen Worker gerichtet ist wird die emfpangene Message
        // ---> die Menge der Dartpfeile wieder von Byte in einen Longe geparst
        if (s.equals(workerDirectTopic + thisWorkerId)) {
            long newDarts = Long.parseLong(new String(mqttMessage.getPayload()));
            //Check ob die -1 vom Coordinator gesendet wurde als Zeichen das die Darts augegangen sind
            if (newDarts <= 0) {
                System.out.println("Die Darts wurden alle Verschossen, es gibt keine mehr!");
                shutdownFlag = true;
                myTmpDarts = -1l;
            } else {
                System.out.println("Es wurde folgene Dartmenge gesendet: " + newDarts);
                myTmpDarts += newDarts;
            }
        } else {
            System.out.println("Topic doesn FIT!!!!");
        }
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
        System.out.println("The delivery got completed!");
    }
}
