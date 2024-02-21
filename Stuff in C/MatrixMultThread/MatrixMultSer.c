#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

// Die Dimensionen sind zwar fix am Übungszettel vorgegeben,
// aber prinzipiell sollte man sie trotzdem im Programm nicht hart-coden.
// Wenn man sie als Konstanten definiert, kann man sie später leichter ändern.
#define A_DIMX	10
#define B_DIMY	10
#define S_DIM	10

// Makro, welches einen 2-dimensionalen Index in einem 1-dimensionalen Index umwandelt
// x .. x-Index (Anzahl der Zeilen)
// y .. y-Index (Anzahl der Spalten)
// s .. Größe der y-Dimension (Max. Anzahl der Spalten)
#define MATINDEX(x,y,s)		((x)*(s)+(y))

//Anzahl der Messungen
#define ANZAHL_MESSUNGEN    10

// Die Matrizen A, B und C
// Diese als globale Variablen zu definieren, macht es für die Threads einfacher, darauf zuzugreifen
int *A, *B, *C;

//Funktion um für die Aktuelle Zeit
double getTime() {
    struct timespec time;
    clock_gettime(CLOCK_REALTIME, &time);
    return (double)time.tv_sec + (double)time.tv_nsec/1000000000;
}

// Struktur für die Datenübergabe an die Threads
// x .. Zeile der A Matrix
// y .. Spalte der B Matrix
typedef struct {
	int starter;
	int zaehler;
} thread_data_t;

// Funktion, welche von den Threads ausgeführt wird
void* thread_func(void* arg) {
    // Caste übergebene Daten zum richtigen Datentyp
    thread_data_t* data = (thread_data_t*)arg;
    //Schleife für Zeile
    for (int i = data->starter; i < data->starter+data->zaehler; i++) {
        //Schleife für Spalten
        for (int j = 0; j < B_DIMY; j++) {
            // Bereche Zeile * Spalte
            int result = 0;
            for (int g = 0; g < S_DIM; g++) {
                result += A[MATINDEX(data->starter,i,S_DIM)] * B[MATINDEX(i,data->zaehler,B_DIMY)];
            }
            // Speichere Ergebnis in die richtige Zelle der C Matrix
            C[MATINDEX(data->starter,data->zaehler, B_DIMY)] = result;

        }
    }
    return NULL;
}

//// Gebe die übergebene Matrix aus
//// mat .. Matrix,
//// x .. Anzahl der Zeilen
//// y .. Anzahl der Spalten
//void printMatrix(int* mat, int x, int y) {
//	int min = INT_MAX, max = INT_MIN, sum = 0;
//	// Schleife über alle Zeilen
//	for (int i = 0; i < x; i++) {
//		int firstElement = 1;
//		// Schleife über alle Spalten
//		for (int j = 0; j < y; j++) {
//			// Für das erste Element müssen wir davor kein '\t' ausgeben
//			if (firstElement) {
//				firstElement = 0;
//			} else {
//				printf("\t");
//			}
//			int e = mat[MATINDEX(i,j,y)];
//			// Gebe Element aus
//			printf("%d", e);
//			// Berechne min
//			if (e < min) {
//				min = e;
//			}
//			// Berechne max
//			if (e > max) {
//				max = e;
//			}
//			// Berechne Summe
//			sum += e;
//		}
//		printf("\n");
//	}
//	// Gebe min, max und summe aus
//	printf("Minimaler Wert: %d; Maximaler Wert: %d; Summe aller Werte: %d\n", min, max, sum);
//}


int main() {
	// Alloziere Speicher für die Matrizen
	A = malloc(sizeof(int)*A_DIMX*S_DIM);
	B = malloc(sizeof(int)*S_DIM*B_DIMY);
	C = malloc(sizeof(int)*A_DIMX*B_DIMY);

    // Fülle die Matrizen A und B mit Zufallswerten (zwischen 0 und 10)
    for (int i = 0; i < A_DIMX*S_DIM; i++) {
        A[i] = rand() % 10;
    }
    for (int i = 0; i < S_DIM*B_DIMY; i++) {
        B[i] = rand() % 10;
    }

    //Schleife für die Runden und eine Variable für die gesamte Runtime über die durchläufe
    double runtimeTotal = 0.0;
    for (int am = 0; am < ANZAHL_MESSUNGEN; am++) {
        double startZeit = getTime();

        for (int x = 0; x < A_DIMX; x++) {
            for (int y = 0; y < B_DIMY; y++) {
                int result = 0;
                for (int i = 0; i < S_DIM; i++) {
                    result += A[MATINDEX(x,i,S_DIM)] * B[MATINDEX(i,y,B_DIMY)];
                }
                C[MATINDEX(x,y,B_DIMY)] = result;
            }
        }
        double endZeit = getTime();
        runtimeTotal += endZeit - startZeit;
        printf("Runtime %lf s\n", endZeit - startZeit);
    }

    printf("Average Runtime over %d runs: %lf s\n", ANZAHL_MESSUNGEN, runtimeTotal / (double)ANZAHL_MESSUNGEN);




	return 0;
}