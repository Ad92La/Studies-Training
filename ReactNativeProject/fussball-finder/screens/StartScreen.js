import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {useNavigation} from "@react-navigation/native";



 function StartScreen() {

  const navigation = useNavigation();

  const onPressSearchButtonHandler = () => {
    navigation.navigate('MapScreen');
  }

 const onPressFavoriteButtonHandler = () => {
     navigation.navigate('FavoriteScreen');
  }

  const onPressRegisterButtonHandler = () => {
    navigation.navigate('RegisterScreen');
 }


  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <ImageBackground
              source={{uri: 'https://cdn.midjourney.com/c4a20077-0696-432f-a600-1d26fb203a0d/0_2.webp'}} 
              style={styles.backgroundimage}
        ></ImageBackground>
      </View>
      
      <View style={styles.titlecontainer}>
        <Text style={styles.title}>Fußball Finder</Text>
        <Text style={styles.subtitle}>WELCOME</Text>
      </View>

      <View style={styles.mapContainer}>
        <ImageBackground
          source={{uri: 'https://maps.wien.gv.at/basemap/bmaphidpi/normal/google3857/13/2840/4468.jpeg'}}
          style={styles.image}
        >
          <LinearGradient
            colors={['#00000000', '#3a3131']}
            style={styles.linearGradient}
        ></LinearGradient>
        </ImageBackground>
      </View> 
   
        <Pressable onPress={(onPressSearchButtonHandler)} style={styles.searchButton} >
          <Text style={styles.searchButtonText}> Search here... </Text>        
        </Pressable>

        <Pressable onPress={(onPressRegisterButtonHandler)} style={styles.registerButton} >
          <Text style={styles.registerButtonText}> Platz registrieren </Text>        
        </Pressable>

        <Pressable onPress={(onPressFavoriteButtonHandler)} style={styles.favoriteButton} >
          <Text style={styles.favoriteButtonText}> Favoriten </Text>        
        </Pressable> 

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
  titlecontainer: {
    height: 60,
    position: 'absolute',
    zIndex: 2,
    top: 55,
    left: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  title: {
    color: 'black',
    alignContent: 'center',
    fontWeight: 'bold',
    fontSize: 35,
  },
  subtitle: {
    fontSize: 20,
    color: 'black',
  },
  mapContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 2,
    width: '95%',
    height: Platform.OS === 'ios' ? 500 : 550,
    borderRadius: 10,
    top: 145,
    overflow: 'hidden',
    borderColor: 'white',
    borderWidth: 1
  },
  image: {},
  linearGradient: {
    height: '100%',
    width: '100%',
  },
  searchButton: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 2,
    height: 60,
    width: '75%',
    top: Platform.OS === 'ios' ? 550 : 600,
    backgroundColor: '#3a3131',
    borderColor: 'white',
    borderWidth: 1.5,
    borderRadius: 30
  },
  searchButtonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 18,
  },
  registerButton: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 2,
    height: 60,
    width: '75%',
    top: Platform.OS === 'ios' ? 670 : 720,
    backgroundColor: '#3a3131',
    borderColor: 'white',
    borderWidth: 1.5,
    borderRadius: 30
  },
  registerButtonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 18,
  },
  favoriteButton: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 2,
    height: 60,
    width: '75%',
    top: Platform.OS === 'ios' ? 750 : 800,
    backgroundColor: '#3a3131',
    borderColor: 'white',
    borderWidth: 1.5,
    borderRadius: 30
  },
  favoriteButtonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 18,
  }
});



export default StartScreen;