package org.example;



import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) {



        //-----Aufteilen der Grunddaten, Pakete und Einheiten-----

        //Menge der Testparameter
        int threadCount = 2;
        long dartsToThrow = 200_000_000;

        //Paketmenge berechnen
        int paketMenge = (int) Math.pow(threadCount,2);
        //Paketgröße ausrechnen
        int paketSize = (int) (dartsToThrow / paketMenge);



        //-----Erstellen von Threadpool und den benötigten Future Objekten-----
        //-----Gleichzeitig Hier auch der Start für die Zeitnehmnung -----


        //Zeitnehmung Start
        long startTime = System.nanoTime();

        //Array für die zukünftigen Resultate
        List<Future<Long>> results = new ArrayList<>();

        //Aufstellen des ForkJoin pools
        ExecutorService threadPool = Executors.newFixedThreadPool(threadCount);

        //Pakete auf die Worker im Threadpool verteilen
        for (int i = 0; i < paketMenge; i++) {
            results.add(threadPool.submit(new MonteCarlo(paketSize)));
        }

        //Variable zm Speichern der gesamten getroffenen Hits
        long hitsInTotal = 0;
        //Verarbeiten der Ergebnisse aus dem Future Array
        for (Future<Long> result : results) {
            try{
                hitsInTotal += result.get();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        //Schätzung von PI aus den Ergebnissen nach Pythagors theorem
        double piSchaetzung = ((double) hitsInTotal /dartsToThrow) * 4.0;



        //-----Ausgabe der berechneten Ergebnisse -----

        System.out.println("Menge an hits im Kreis: " + hitsInTotal);
        System.out.println("Schätzung für PI nach " + dartsToThrow + " Dartwürfen: " + piSchaetzung);

        threadPool.shutdown();



        // ----- Ende und Ausgabe der Zeitnehmung -----

        long endTime = System.nanoTime();
        double timeElapsed = endTime - startTime;

        System.out.println("Execution time in nanoseconds: " + timeElapsed);
        System.out.println("Execution time in milliseconds: " + String.format("%.6f", (timeElapsed / 1000000)));
        System.out.println("Execution time in seconds: " + String.format("%.6f", (timeElapsed / 1000000000)));
    }

    //Klasse erstellen und die Callable funktion überschreiben
    static class MonteCarlo implements Callable<Long> {

        private final int dartsToThrow;

        public MonteCarlo(int dartsToThrow) {
            this.dartsToThrow = dartsToThrow;
        }

        @Override
        public Long call() {
            long hitSum = 0;
            for (int i = 0; i < dartsToThrow; i++) {
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
            return hitSum;
        }
    }

}