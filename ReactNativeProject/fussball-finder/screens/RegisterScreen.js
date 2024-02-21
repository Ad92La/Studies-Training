import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Pressable, StyleSheet, Text, TextInput, View, Image, ToastAndroid } from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { launchCameraAsync, requestCameraPermissionsAsync } from 'expo-image-picker';
import { documentDirectory, copyAsync } from 'expo-file-system'; 
import { uploadField } from '../utils/fieldApiUtil';
import * as Location from "expo-location";


function RegisterScreen() {
  useEffect(() => {
    getLocation();
  }, []);

  //Use States
  const [newImage, setNewImage] = useState(null);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState(null);
  const [newMail, setNewEmail] = useState('');
  const [newDescribtion, setNewDescribtion] = useState('');
  const [newLatitude, setNewLatitude] = useState(null);
  const [newLongitude, setNewLongitude] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);


  //Handler
  const navigation = useNavigation();
  
  const onPressBackHandler = () => {
    navigation.goBack();
  }

  const onChangeNameHandler = (input) => {
    setNewName(input);
  }

  const onChangeAddressHandler = (input) => {
    setNewAddress(input);
  }

  const onChangePhoneHandler = (input) => {
    setNewPhoneNumber(input);
  }

  const onChangeEmailHandler = (input) => {
    setNewEmail(input);
  }

  const onChangeDescriptionHandler = (input) => {
    setNewDescribtion(input);
  }


  //Funktion zum Bestimmen der aktuellen Position
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        //setLocationError("Location permission denied");
        console.error('Location permission denied');
        return;
      }

      let result = await Location.getCurrentPositionAsync({});
      setNewLatitude(result.coords.latitude);
      setNewLongitude(result.coords.longitude);

    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };


  const onPressRegisterHandler = async () => {    
    //Check ob Standort bereits lokalisiert wurde
    if(newLatitude === null || newLongitude === null) {
      ToastAndroid.show('Standort konnte noch nicht loaklisiert werden!', ToastAndroid.SHORT);
      return;
    }

    //Neues Feld für den Upload wird erzeugt
    const newField = {
      name: newName,
      latitude: newLatitude,
      longitude: newLongitude,
      description: newDescribtion,
      //rating: 4.3,
      image: newImage,
      isFavorite: false,
      address: newAddress,
      //extras: ['Duschkabine'],
      contact: {phone: newPhoneNumber, mail: newMail}
    }
    uploadField(newField);
    ToastAndroid.show('Platz wurde registriert!', ToastAndroid.SHORT);
  }


  //Funktion zum Aufnehmen eines Fotos
  async function pickImage() {
    try {
      const permissions = await requestCameraPermissionsAsync();
      if(permissions !== 'granted' && !permissions.canAskAgain) {
        Alert.alert('Insufficient permissions', 'Please change your permission in the systems settings.', [{text: 'Got it.'}]);
      }

      const imageRes = await launchCameraAsync();
      if(!imageRes || imageRes.canceled === true || !imageRes.assets[0] || !imageRes.assets[0].uri) {
        console.log('No Image recorder');
        return;
      }

      const imageUri = imageRes.assets[0].uri;
      const tragetPath = `${documentDirectory}${imageUri.split('/').pop()}`;

      await copyAsync({
        from: imageUri,
        to: tragetPath,
      });

      setNewImage(tragetPath);
      
    } catch (error) {
      console.log('An error occured while trying to take a picture', error);
      
    }
  }
   

    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <ImageBackground
              source={{uri: 'https://cdn.midjourney.com/c4a20077-0696-432f-a600-1d26fb203a0d/0_2.webp'}} 
              style={styles.backgroundimage}  
          >

            <Text style={styles.title}>Platz registrieren</Text>

            <View style={styles.imageContainer}>
              <Image source={{ uri: newImage }} style={styles.image} />
            </View>
            <Pressable onPress={pickImage} style={styles.addImageContainer}>
              <Ionicons name="camera" size={45} color="white" />
            </Pressable>

            <TextInput
              style={styles.nameInputButton}
              onChangeText={onChangeNameHandler}
              placeholder='Platzname'
              placeholderTextColor='white'
              textAlign='center'
              fontSize={20}   
            />

            <TextInput
              style={styles.addressInputButton}
              onChangeText={onChangeAddressHandler}
              placeholder='Adresse'
              placeholderTextColor='white'
              textAlign='center'
              fontSize={20}   
            />

            <TextInput
              style={styles.phoneInputButton}
              onChangeText={onChangePhoneHandler}
              placeholder='Telefonnummer'
              placeholderTextColor='white'
              textAlign='center'
              fontSize={20}   
            />

            <TextInput
              style={styles.emailInputButton}
              onChangeText={onChangeEmailHandler}
              placeholder='Emailadresse'
              placeholderTextColor='white'
              textAlign='center'
              fontSize={20}   
            />

            <TextInput
              style={styles.descriptionInputButton}
              onChangeText={onChangeDescriptionHandler}
              placeholder='Beschreibung'
              placeholderTextColor='white'
              textAlign='center'
              fontSize={20}   
            />

            <Pressable onPress={onPressRegisterHandler} style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Platz registrieren</Text>
            </Pressable>

            <Pressable onPress={onPressBackHandler} style={styles.backButton}>
                <Ionicons name="chevron-back" size={40} color="#000000f3" />
            </Pressable>

          </ImageBackground>
        </View>

      </View>
    );
  }
  
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      zIndex: 1,
    },
    backgroundimage: {
      flex: 1,
    },
    title: {
      top: 50,
      position: 'absolute',
      color: '#000',
      fontSize: 35,
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    backButton: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      height: 60,
      width: 60,
      top: 45,
      left: 5,
      backgroundColor: 'rgba(100, 100, 100, 0)',
      borderColor: 'rgba(100, 100, 100, 0)',
      borderWidth: 2,
      borderRadius: 30
    },
    imageContainer: {
      width: '85%',
      height: 200,
      borderColor: 'white',
      borderWidth: 2,
      borderRadius: 10,
      overflow: 'hidden',
      top: Platform.OS === 'ios' ? 70 : 120,
      alignSelf: 'center',
      backgroundColor: '#3b393983',
      alignItems: 'center',
      justifyContent: 'center'
    },
    addImageContainer: {
      width: 70,
      height: 70,
      backgroundColor: '#3b3939ff',
      borderRadius: 100,
      borderWidth: 2,
      borderColor: 'white',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      top: 80
    },
    image: {
      height: '100%',
      width: '100%',
    },
    nameInputButton: {
      color: 'white', 
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      position: 'absolute',
      zIndex: 2,
      height: 60,
      width: '85%',
      top: Platform.OS === 'ios' ? 330 : 380,
      backgroundColor: '#3a3131',
      borderColor: 'white',
      borderWidth: 1.5,
      borderRadius: 30,
    },
    addressInputButton: {
      color: 'white',
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      position: 'absolute',
      zIndex: 2,
      height: 60,
      width: '85%',
      top: Platform.OS === 'ios' ? 410 : 460,
      backgroundColor: '#3a3131',
      borderColor: 'white',
      borderWidth: 1.5,
      borderRadius: 30,
    },
    phoneInputButton: {
      color: 'white',
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      position: 'absolute',
      zIndex: 2,
      height: 60,
      width: '85%',
      top: Platform.OS === 'ios' ? 490 : 540,
      backgroundColor: '#3a3131',
      borderColor: 'white',
      borderWidth: 1.5,
      borderRadius: 30,
    },
    emailInputButton: {
      color: 'white',
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      position: 'absolute',
      zIndex: 2,
      height: 60,
      width: '85%',
      top: Platform.OS === 'ios' ? 570 : 620,
      backgroundColor: '#3a3131',
      borderColor: 'white',
      borderWidth: 1.5,
      borderRadius: 30,
    },
    descriptionInputButton: {
      color: 'white',
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      position: 'absolute',
      zIndex: 2,
      height: 60,
      width: '85%',
      top: Platform.OS === 'ios' ? 650 : 700,
      backgroundColor: '#3a3131',
      borderColor: 'white',
      borderWidth: 1.5,
      borderRadius: 30,
    },
    registerButton: {
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      position: 'absolute',
      zIndex: 2,
      height: 60,
      width: '85%',
      top: Platform.OS === 'ios' ? 750 : 800,
      backgroundColor: '#c98328',
      borderColor: 'white',
      borderWidth: 1.5,
      borderRadius: 30,
    },
    registerButtonText: {
      alignSelf: 'center',
      fontSize: 20,
      color: 'black'
    }
  });
  
  
  
  export default RegisterScreen;