import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ImageBackground,
    TouchableOpacity,
    TextInput
} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from 'react'
import * as MailComposer from 'expo-mail-composer'

function BookingScreen({route}) {

    const { fieldInfo } = route.params;
    const navigation = useNavigation();
    const onPressBackHandler = () => {
        navigation.goBack();
    }
    //Check auf Availability ist der Check ob ein
    //Mailprogramm vorhanden ist, falls nicht wird kein Sendebutton angezeigt
    const [isAvailable, setIsAvailable] = useState(false);
    const [subject, setSubject] = useState(undefined);
    const [body, setBody] = useState(undefined);

    //Basis für den Availability Check
    useEffect(() => {
        async function checkAvailability() {
            const isMailAvailable = await MailComposer.isAvailableAsync();
            setIsAvailable(isMailAvailable);
        }

        checkAvailability();
    }, []);

    //Basis für den MailComposer
    //Für Testzwecke ist meine (Adrians) Email hardgecoded
    const sendMail = () => {
        MailComposer.composeAsync({
            subject: subject,
            body: body,
            recipients: ['max.muster@gmail.com'],
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <ImageBackground
                    source={{uri: 'https://cdn.midjourney.com/c4a20077-0696-432f-a600-1d26fb203a0d/0_2.webp'}}
                    style={styles.backgroundimage}
                >
                    <Text style={styles.title}> {fieldInfo.name} </Text>
                    <TextInput style={styles.textFieldMessage}
                               value={subject || undefined}
                               onChangeText={setSubject}
                               fontSize={18}
                               color={'#ffffff'}
                               placeholderTextColor={'#ffffff'}
                               placeholder={"Sehr geehrte Platzverwaltung...."}
                               multiline={true}
                    />
                    <TextInput style={styles.textFieldDate}
                               value={body}
                               onChangeText={setBody}
                               color={'#ffffff'}
                               fontSize={18}
                               placeholderTextColor={'#ffffff'}
                               placeholder={"Datum und Uhrzeit.."}
                               multiline={true}
                    />
                    <View style={styles.sendButton}>
                        {isAvailable ? <TouchableOpacity onPress={sendMail}>
                                <Text style={styles.sendButtonText} >Send Mail</Text>
                            </TouchableOpacity>
                            :
                            <Text>Email not available</Text> }
                    </View>
                </ImageBackground>

            </View>

            <Pressable onPress={onPressBackHandler} style={styles.backButton}>
                <Ionicons name="chevron-back" size={40} color="#000000f3" />
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        zIndex: 2,
        color: '#000',
        fontSize: 27,
        fontWeight: 'bold',
        alignSelf: 'center',
        top: 120,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 2,
        height: 60,
        width: 60,
        top: 45,
        left: 5,
        backgroundColor: 'rgba(100, 100, 100, 0)',
        borderColor: 'rgba(100, 100, 100, 0)',
        borderWidth: 2,
        borderRadius: 30
    },
    background: {
        flex: 1,
        zIndex: 1,
    },
    backgroundimage: {
        flex: 1,
    },
    textFieldDate: {
        width: 380,
        height: 100,
        alignSelf: 'center',
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: 'rgba(43, 39, 39, 1)',
        top: 130,
        marginTop: 40,
        textAlignVertical: 'top',
        padding: 10,
    },
    textFieldMessage: {
        width: 380,
        height: 200,
        alignSelf: 'center',
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: 'rgba(43, 39, 39, 1)',
        top: 130,
        marginTop: 40,
        textAlignVertical: 'top',
        padding: 10,
    },
    text: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: 'white',
        fontSize: 20
    },
    dateButton: {
        width: 150,
        height: 60,
        backgroundColor: '#c98328',
        alignSelf: 'center',
        top: 150,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dateButtonText: {
        color: '#000',
        fontSize: 18
    },
    sendButton: {
        width: 300,
        height: 40,
        backgroundColor: '#c98328',
        alignSelf: 'center',
        top: 200,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendButtonText: {
        color: '#000',
        fontSize: 18
    },

});



export default BookingScreen;