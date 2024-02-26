#include <pthread.h>
#include <cstdio>
#include <cstdlib>
#include <climits>
#include <ctime>
#include <iostream>
// Die Dimensionen sind zwar fix am Übungszettel vorgegeben,
// aber prinzipiell sollte man sie trotzdem im Programm nicht hart-coden.
// Wenn man sie als Konstanten definiert, kann man sie später leichter ändern.
#define A_DIMX	10
#define B_DIMY	12
#define S_DIM	20

#define MEASUREMENTS        5
#define HOW_MUCH_THREADS    10
// Makro, welches einen 2-dimensionalen Index in einem 1-dimensionalen Index umwandelt
// x .. x-Index (Anzahl der Zeilen)
// y .. y-Index (Anzahl der Spalten)
// s .. Größe der y-Dimension (Max. Anzahl der Spalten)
#define MATINDEX(x,y,s)		((x)*(s)+(y))

// Die Matrizen A, B und C
// Diese als globale Variablen zu definieren, macht es für die Threads einfacher, darauf zuzugreifen
int *A, *B, *C;

// Struktur für die Datenübergabe an die Threads
// x .. Zeile der A Matrix
// y .. Spalte der B Matrix
typedef struct {
    int x_start;
    int x_count;
    int y;
} thread_data_t;

// Funktion, welche von den Threads ausgeführt wird
void* thread_func(void* arg) {

    //Threaddaten
    thread_data_t * data = (thread_data_t*)arg;

    //Matrixberechnung
    for (int x = data->x_start; x < data->x_start+data->x_count; x++) {
        for (int y = 0; y < B_DIMY; y++) {
            int result = 0;
            for (int i = 0; i < S_DIM; i++) {
                result += A[MATINDEX(x,i,S_DIM)]* B[MATINDEX(i,y,B_DIMY)];
            }
            C[MATINDEX(x,y,B_DIMY)] = result;
        }
    }
    return NULL;
}

// Gebe die übergebene Matrix aus
// mat .. Matrix,
// x .. Anzahl der Zeilen
// y .. Anzahl der Spalten
//void printMatrix(int* mat, int x, int y) {
//    int min = INT_MAX, max = INT_MIN, sum = 0;
//    // Schleife über alle Zeilen
//    for (int i = 0; i < x; i++) {
//        int firstElement = 1;
//        // Schleife über alle Spalten
//        for (int j = 0; j < y; j++) {
//            // Für das erste Element müssen wir davor kein '\t' ausgeben
//            if (firstElement) {
//                firstElement = 0;
//            } else {
//                printf("\t");
//            }
//            int e = mat[MATINDEX(i,j,y)];
//            // Gebe Element aus
//            printf("%d", e);
//            // Berechne min
//            if (e < min) {
//                min = e;
//            }
//            // Berechne max
//            if (e > max) {
//                max = e;
//            }
//            // Berechne Summe
//            sum += e;
//        }
//        printf("\n");
//    }
//    // Gebe min, max und summe aus
//    printf("Minimaler Wert: %d; Maximaler Wert: %d; Summe aller Werte: %d\n", min, max, sum);
//}

double getTime() {
    struct timespec time{};
    clock_gettime(CLOCK_REALTIME, &time);
    return (double)time.tv_sec + (double)time.tv_nsec/1000000000.0;
}


int main() {

    srand(time(NULL));
    // Alloziere Speicher für die Matrizen
    A = static_cast<int *>(malloc(sizeof(int) * A_DIMX * S_DIM));
    B = static_cast<int *>(malloc(sizeof(int) * S_DIM * B_DIMY));
    C = static_cast<int *>(malloc(sizeof(int) * A_DIMX * B_DIMY));

    // Fülle die Matrizen A und B mit Zufallswerten (zwischen 0 und 10)
    for (int i = 0; i < 10*20; i++) {
        A[i] = rand() % 10;
    }
    for (int i = 0; i < 20*12; i++) {
        B[i] = rand() % 10;
    }

    double durchschnittRuntime = 0.0;

    for (int m = 0; m < MEASUREMENTS; m++) {

#if HOW_MUCH_THREADS > 1
        //Startzeit
        double startTime = getTime();
        thread_data_t threadData[HOW_MUCH_THREADS];
            pthread_t threads[HOW_MUCH_THREADS];

                for (int i = 0; i < HOW_MUCH_THREADS; ++i) {
                    //Füllen der Datenstruktur
                    threadData[i].x_start = (A_DIMX / HOW_MUCH_THREADS
                        ) *i;
                        if (i < HOW_MUCH_THREADS -1) {
                                threadData[i].x_count = A_DIMX / HOW_MUCH_THREADS ;
                                } else {
                                    threadData[i].x_count = threadData[i].x_count - threadData[i].x_start;
                                }
                                pthread_create(&threads[i], NULL, thread_func, &threadData[i]);
                            }

                            for (int i = 0; i < HOW_MUCH_THREADS; ++i) {
                                pthread_join(threads[i], NULL);
                            }

                            //Messung endzeit
                            double endTime = getTime();
                            double duration = endTime - startTime;
                            std::cout << duration << " s" << std::endl;
                            durchschnittRuntime += duration;
#else
//Startzeit
        double startTime = getTime();
        for (int x = 0; x < A_DIMX; x++) {
            for (int y = 0; y < B_DIMY; y++) {
                int result = 0;
                for (int i = 0; i < S_DIM; i++) {
                    result += A[MATINDEX(x,i,S_DIM)] * B[MATINDEX(i,y,B_DIMY)];
                }
                C[MATINDEX(x,y,B_DIMY)] = result;
            }
        }

        double endTime = getTime();
        double duration = endTime - startTime;
        std::cout << duration << " s, laufzeit" << std::endl;
        durchschnittRuntime += duration;

#endif
    }
    std::cout << "Durchschnittliche ZEIT: " <<durchschnittRuntime / MEASUREMENTS <<  std::endl;
    // Gebe Ergebnis aus
    //    printMatrix(C, A_DIMX, B_DIMY);

    return 0;
}