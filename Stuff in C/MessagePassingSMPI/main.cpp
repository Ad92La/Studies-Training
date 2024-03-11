#include <pthread.h>
#include <iostream>
#include <cstdlib>
#include <climits>
#include <chrono>
#include "smpi.h"

#define A_DIMX 100
#define B_DIMY 100
#define S_DIM 100

#define DURCHLAUFE 4
#define ANZAHL_THREADS 12

#define MATINDEX(x, y, s) ((x)*(s)+(y))

typedef struct {
    int x_start;
    int x_count;
    int y;
} thread_data_t;


void* thread_func(void* arg) {

    smpi_init();
    std::cout << smpi_get_rank() << " <--- Threadnumber INSIDE THREADFUNK" << std::endl;

    int sender;
    thread_data_t data;

    //Empfange Infos
    smpi_recv(&data, sizeof(thread_data_t), &sender);

    std::cout << "THREADINFOS EMPFANGEN!"<< std:: endl;

    //Matritzen aufstellen
    int *A = (int*)(malloc(sizeof(int) * (A_DIMX * S_DIM)));
    int *B = (int*)(malloc(sizeof(int) * (S_DIM * B_DIMY)));
    int *C = (int*)(malloc(sizeof(int) * (A_DIMX * B_DIMY)));

    //std::cout << "NEUES SPEICHER ALLOKIERT!"<< std:: endl;

    //Empfange daten für Matrix A
    
    smpi_recv(A, sizeof(int)*S_DIM*B_DIMY, &sender);

    //std::cout << "DATEN MATRIX A ERHALTEN!" << std:: endl;

    //Empfange daten für Matrix B
    smpi_recv(B, sizeof(int)*S_DIM*B_DIMY, &sender);

    //std::cout << "DATEN MATRIX B ERHALTEN!" << std:: endl;

    for (int i = data.x_start; i < data.x_start+data.x_count; i++) {
        //std::cout << "FIRST LOOP IN THREAD FUNC!" << std:: endl;
        for (int j = 0; j < B_DIMY; j++) {
            //std::cout << "SECOND LOOP IN THREAD FUNC!" << std:: endl;
            int result = 0;
            for (int k = 0; k < S_DIM; k++) {
                //std::cout << "THIRD LOOP IN THREAD FUNC!" << result << std:: endl;
                result += A[MATINDEX(i,k,S_DIM)]*B[MATINDEX(k,j,B_DIMY)];
                //std::cout << "AFTER THIRD LOOP IN THREAD FUNC!" << result << std:: endl;
            }
            //std::cout << "SPEICHERN IN MATRIX C!" << std:: endl;
            //Speichern in C
            C[MATINDEX(i,j,B_DIMY)] = result;
        }
    }
    //Rücksendung INFO
    std::cout << smpi_get_rank() << " <--- Threadnumber sendet Infos zurück." << std::endl;
    smpi_send(&data,sizeof(thread_data_t),0);

    //Rücksendung Daten
    std::cout << smpi_get_rank() << " <--- Threadnumber sendet Daten zurück." << std::endl;
    smpi_send(C,sizeof(int)*data.y*B_DIMY,0);

    smpi_finalize();

    return NULL;

}

//void printMatrix(int* mat, int x, int y) {
//    int min = INT_MAX, max = INT_MIN, sum = 0;
//    for (int i = 0; i < x; i++) {
//        int firstElement = 1;
//        for (int j = 0; j < y; j++) {
//            if (firstElement) {
//                firstElement = 0;
//            } else {
//                std::cout << "\t";
//            }
//            int e = mat[MATINDEX(i, j, y)];
//            std::cout << e;
//            if (e < min) {
//                min = e;
//            }
//            if (e > max) {
//                max = e;
//            }
//            sum += e;
//        }
//        std::cout << std::endl;
//    }
//    std::cout << "Minimaler Wert: " << min << "; Maximaler Wert: " << max << "; Summe aller Werte: " << sum << std::endl;
//}



double gettime() {
    struct timespec time{};
    clock_gettime(CLOCK_REALTIME, &time);
    return (double)time.tv_sec + (double)time.tv_nsec/1000000000.0;
}


int main() {

    srand(time(NULL));

    //Falls mehr als 1 Thread verwendet wird
    #if ANZAHL_THREADS > 1
    smpi_setup(ANZAHL_THREADS+1);
    smpi_init();
    #endif

    //erstellen der Matritzen
    int *A = (int*)(malloc(sizeof(int) * A_DIMX * S_DIM));
    int *B = (int*)(malloc(sizeof(int) * S_DIM * B_DIMY));
    int *C = (int*)(malloc(sizeof(int) * A_DIMX * B_DIMY));

    //Füllen der Matritzen
    for (int i = 0; i < A_DIMX*S_DIM; i++) {
        A[i] = rand() % 10;
    }
    for (int i = 0; i < S_DIM*B_DIMY; i++) {
        B[i] = rand() % 10;
    }

    //Zeiterfassung Startzeit

    long runtimeTotal = 0.0;
    auto startZeit = std::chrono::high_resolution_clock::now();
    //Durchläufe - Loop
    for (int i = 0; i < DURCHLAUFE; i++) {



        //Falls nur 1 Thread verwendet wird:
        #if ANZAHL_THREADS == 1

            //Zeilenschleife
            for (int x = 0; x < A_DIMX; x++) {
                //Spaltenschleife
                for (int y = 0; y < B_DIMY; y++) {
                    int result = 0;
                    //einzelnen Berechnungen
                    for (int k = 0; k < S_DIM; k++) {
                        result += A[MATINDEX(x,k,S_DIM)]*B[MATINDEX(k,y,B_DIMY)];
                    }
                    //Ueberstrag in die C-Matrix
                    C[MATINDEX(x,y,B_DIMY)] = result;
                }
            }

        #else


            thread_data_t threadData[ANZAHL_THREADS];
            pthread_t threads[ANZAHL_THREADS];

            //Erzeugung der Threads und zuweisung der Daten
            for (int t = 0; t < ANZAHL_THREADS; t++) {

                thread_data_t * data = &threadData[t];
                //füllen der Thread-Datenstruktur
                data->x_start=(A_DIMX / ANZAHL_THREADS) *t;

                //Aufteilen der zu berechnenden Einheiten auf die Anzahl an Threads
                if (t < ANZAHL_THREADS) {
                    data->x_count = A_DIMX / ANZAHL_THREADS;
                } else {
                    //Für den letzten Thread gibt es die restlichen Daten so dass alle verteilt sind
                    data->x_count = data->x_count - data->x_start;
                }
                std::cout << "THREADNUMMER " << t << " CREATED" << std::endl;
                //erstellen des jeweiligen threads
                pthread_create(&threads[t], NULL, thread_func, &threadData[t]);




                //Senden der Info-Nachricht
                smpi_send(data, sizeof(thread_data_t), t+1);
                std::cout << "Senden INFOS ZURÜCK an Thread Nummer: " << smpi_get_rank() << std::endl;
                //Senden der MatrixA parameter, (Buffer, size, sender)
                smpi_send(&A[MATINDEX(data->x_start,0,S_DIM)], sizeof(int)*data->x_count*S_DIM, t+1);
                std::cout << "Senden MATRIX A Daten an Nummer: " << smpi_get_rank() << std::endl;
                //Senden der MatrixB parameter
                smpi_send(&B[MATINDEX(data->x_start,0,B_DIMY)], sizeof(int)*S_DIM*B_DIMY, t+1);
                std::cout << "Senden MATRIX B Daten an Nummer: " << smpi_get_rank() << std::endl;
            }
    //Empfangen der Daten
        for (int j = 0; j < ANZAHL_THREADS; j++) {
            int sender = 0;
            thread_data_t data;

            //Emfpangen der INFO
            smpi_recv(&data, sizeof(thread_data_t), &sender);
            std::cout << "Thread no: " << smpi_get_rank() << " got info from: "  << sender << std::endl;
            //Empfangen der Daten
            smpi_recv(&C[MATINDEX(data.x_start, 0 , S_DIM)], sizeof(int)*(data.x_count*B_DIMY), &sender);
            std::cout << "Thread no: " << smpi_get_rank() << " got data from: "  << sender << std::endl;
        }

        std::cout << "BEI DER JOIN SCHLEIFE ANGEKOMMEN!" << std::endl;
        //Warten bis alle threads zu ende sind
        for (auto thread : threads) {
            pthread_join(thread, NULL);
        }

        //Zeitmessung beenden


        #endif
        auto endZeit = std::chrono::high_resolution_clock::now();
        auto roundtimeTotal = std::chrono::duration_cast<std::chrono::nanoseconds>(endZeit - startZeit);

        runtimeTotal += roundtimeTotal.count();
        std::cout << "Gesamtlaufzeit Runde: " << runtimeTotal << " Nano - Sekunden" << std::endl;
    }
    

    //Falls wieder mehr als 1 Thread
    #if ANZAHL_THREADS > 1
    smpi_finalize();
    #endif



    std::cout << "Durchschnittliche Gesamtlaufzeit: " << runtimeTotal / DURCHLAUFE << " Nano-Sekunden" << std::endl;
    std::cout << "Durchschnittliche Gesamtlaufzeit: " << static_cast<double>(runtimeTotal / DURCHLAUFE)/1000000000 << " Sekunden" << std::endl;

    return 0;
}