import React, { useContext, useState  } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, ToastAndroid } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Linking } from 'react-native';
import { dummyFootballFields } from '../Navigation/DummyData.js';
import { FootballFieldsContext } from '../utils/FootballFieldsContext';



function FieldScreen({route}) {
    const { fieldInfo } = route.params;
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(fieldInfo.isFavorite);
    

    const onPressBackHandler = () => {
        navigation.goBack();

    }  
 
    const onPressFavoriteHandler = () => {
        const fieldIndex = dummyFootballFields.findIndex(field => field.id === fieldInfo.id);
        if (fieldIndex !== -1) {
            dummyFootballFields[fieldIndex].isFavorite = !dummyFootballFields[fieldIndex].isFavorite;
            setIsFavorite(dummyFootballFields[fieldIndex].isFavorite); // Aktualisieren des lokalen Zustands
    
            if (dummyFootballFields[fieldIndex].isFavorite) {
                ToastAndroid.show('Zu Favoriten hinzugefügt!', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Aus Favoriten gelöscht!', ToastAndroid.SHORT);
            }
        }
        
    };

    
    
    const onPressBookHandler = () => {
        navigation.navigate('BookingScreen', {fieldInfo})
    }

    function onPressPhoneHandler() {
        Linking.openURL(`tel:${fieldInfo.contact.phone}`);
        console.log('Platzbetreiber wird angerufen...');
    }

    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <ImageBackground
                    source={{uri: 'https://cdn.midjourney.com/c4a20077-0696-432f-a600-1d26fb203a0d/0_2.webp'}}
                    style={styles.backgroundimage}
                >
                    <Text style={styles.title}> {fieldInfo.name} </Text>
                    <View style={styles.imageContainer}>
                        <ImageBackground
                            source={{uri: fieldInfo.image}}
                            style={styles.image}>
                                <LinearGradient
                                    colors={['#00000000', '#000000c4']}
                                    style={styles.linearGradient}
                                ></LinearGradient>
                        </ImageBackground>
                    </View>

                    <Pressable onPress={onPressBookHandler}>
                        <View style={styles.bookButton}>
                            <Text style={styles.bookButtonText}>Platz buchen</Text>
                        </View>
                    </Pressable>

                    <View style={styles.textContainer}>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.subtitle}>Beschreibung:</Text>
                            <Text style={styles.content}> {fieldInfo.description} </Text>
                        </View>
                        <View style={styles.extrasContainer}>
                            <Text style={styles.subtitle}>Ausstattung:</Text>
                            <Text style={styles.content}>Indoor Platz: {fieldInfo.indoorOutdoor ? 'Ja' : 'Nein'} </Text>
                            <Text style={styles.content}>Platzgröße: {fieldInfo.size} m²</Text>
                            <Text style={styles.content}>Duschmöglichkeit: {fieldInfo.showerFacilities ? 'Ja' : 'Nein'} </Text>
                            <Text style={styles.content}>Parkplätze vorhanden: {fieldInfo.parking ? 'Ja' : 'Nein'} </Text>
                        </View>
                        <View style={styles.addressContainer}>
                            <Text style={styles.subtitle}>Addresse:</Text>
                            <Text style={styles.content}> {fieldInfo.address} </Text>
                        </View>
                        <View style={styles.contactContainer}>
                            <Text style={styles.subtitle}>Kontakt:</Text>
                            <Text style={styles.content}>Tel.: {fieldInfo.contact.phone}</Text>
                            <Text style={styles.content}>Mail: {fieldInfo.contact.mail}</Text>
                        </View>
                    </View>

                    <Pressable onPress={onPressPhoneHandler} style={styles.phoneButton}>
                        <View style={styles.phoneButtonContainer}>
                            <Ionicons name="call" size={24} color="black" />
                        </View>
                    </Pressable>
                        
                </ImageBackground>
            </View>

            <Pressable onPress={onPressBackHandler} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={40} color="#000000f3" />
            </Pressable>

            <Pressable onPress={onPressFavoriteHandler} style={styles.addFavoriteButton}>
            <Ionicons name={isFavorite ? "ios-star" : "ios-star-outline"} size={24} color="black" />
            </Pressable>

        </View>
    );
}



const styles = StyleSheet.create({
    title: {
        position: 'absolute',
        zIndex: 2,
        color: '#000',
        fontSize: 30,
        fontWeight: 'bold',
        top: 125,
        left: 20,
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
    addFavoriteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 2,
        height: 60,
        width: 60,
        top: 45,
        left: 330,
        backgroundColor: 'rgba(0, 0, 0, 0)',
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
    imageContainer: {
        alignSelf: 'center',
        width: '90%',
        height: 200,
        backgroundColor: 'red',
        top: 180,
        borderRadius: 10,
        overflow: 'hidden'
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
    },
    bookButton: {
        height: 40,
        width: 350,
        top: 200,
        justifyContent: 'center',
        backgroundColor: '#c98328',
        alignSelf: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: 'white',
        borderWidth: 2
    },
    bookButtonText: {
        alignSelf: 'center',
        color: '#000',
        fontSize: 20,
    },
    phoneButtonContainer: {
        height: 40,
        width: 40,
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c98328'
    },
    phoneButton: {
        left: 330,
        marginTop: -20,
    },
    textContainer: {
        width: '100%',
        height: 450,
        top: 225
    },
    descriptionContainer: {
        paddingTop: 10,
        left: 20,
    },
    addressContainer: {
        paddingTop: 5,
        left: 20,
    },
    extrasContainer: {
        paddingTop: 10,
        left: 20,
    },
    contactContainer: {
        paddingTop: 10,
        left: 20,
    },
    subtitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    content: {
        color: 'white',
        fontSize: 15,
    }
      
});



export default FieldScreen;