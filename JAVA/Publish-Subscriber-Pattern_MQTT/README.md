This is an example for the publish-subscribe-pattern and the use of MQTT.

There are 2 separate programs, the coordinator and the worker, wich
communicate with each other. The idea is that there is one coordinator and
many workers.

I testet it with the message-broker: "mosquitto"
Here the link for download and docu:
https://mosquitto.org/

To debug the application i used the mqtt-Explorer,
here the link for the download:
https://mqtt-explorer.com/

I used gradle to build the application. For this u need to download
the library first:
url: "https://repo.eclipse.org/content/repositories/paho-snapshots/"

Also if u use gradle to build the application u have to insert the dependencies
in the gradle.build file:

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.5.2'
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.5.2'
    testImplementation 'org.hamcrest:hamcrest-library:2.1'
    implementation 'org.eclipse.paho:org.eclipse.paho.client.mqttv3:1.2.5'
}