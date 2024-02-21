import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchAllFields } from '../utils/fieldApiUtil';
import { dummyFootballFields } from '../Navigation/DummyData.js';

function MapScreen() {
    const [fieldsDisplayed, setFieldsDisplayed] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();
    const filters = route.params?.filters;
    const userLocation = { latitude: 48.2083, longitude: 16.3731 };

    useEffect(() => {
        async function getDataFromApi() {
            const fields = await fetchAllFields();
            if (!filters || (Object.keys(filters).length == 0 && filters.constructor == Object)) {
                setFieldsDisplayed(fields);
            } else {
                
                const filteredFields = fields.filter(field => {
                    
                    let matchesFilter = false; 
                    let matchesFilterindoorOutdoor = false;
                    let matchesFilterfieldSize = false;
                    let matchesFiltershowerFacilities = false;
                    let matchesFiltersearchRadius = false;
                    let matchesFilterparking = false;
                    
                    const matchingDummyField = dummyFootballFields.find(dummyField => dummyField.id === field.id);

                    if (matchingDummyField) {
                    // Filter für Indoor/Outdoor
                    if (filters.indoorOutdoor != undefined) {
                        if (matchingDummyField.indoorOutdoor === filters.indoorOutdoor){
                            matchesFilterindoorOutdoor = true;
                        };  
                    }

                    // Filter für Platzgröße
                    if (filters.fieldSize !== undefined) {
                        if (matchingDummyField.size <= filters.fieldSize){
                            matchesFilterfieldSize = true;
                        };
                    }

                    // Filter für Duschkabinen
                    if (filters.showerFacilities !== undefined) {
                        if (matchingDummyField.showerFacilities === filters.showerFacilities){
                            matchesFiltershowerFacilities = true;
                        };
                    }

                    // Filter für Suchradius
                    if (filters.searchRadius !== undefined && userLocation) {
                        const distance = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, matchingDummyField.latitude, matchingDummyField.longitude);
                        if (distance <= filters.searchRadius){
                            matchesFiltersearchRadius = true;
                        };
                    }

                    // Filter für Parkmöglichkeiten
                    if (filters.parking !== undefined) {
                        if (matchingDummyField.parking === filters.parking){
                            matchesFilterparking = true; 
                        };
                    }

                    if ((matchesFilterindoorOutdoor == true) && 
                        (matchesFilterfieldSize == true) && 
                        (matchesFiltershowerFacilities == true) && 
                        (matchesFiltersearchRadius == true) &&
                        (matchesFilterparking == true )) {
                        matchesFilter = true;
    
                    } else {
                        matchesFilter = false;
                    }
                }
                    
                    return matchesFilter;
                
                });
            

                if (filteredFields.length > 0) {
                    setFieldsDisplayed(filteredFields);
                } else {
                    setFieldsDisplayed([]); // Wenn kein Filter zutrifft, keine Marker anzeigen
                }
            }
        }
        getDataFromApi();
    }, [filters]);
    
    const [pin, setPin] = useState({
         latitude: 48.2083,
         longitude: 16.3731,
     })

     

     const onPressBackHandler = () => {
         navigation.goBack();
     }

     const onPressFilteredSearchButtonHandler = () => {
         navigation.navigate('FilterScreen');
     }

     const onPressLocationHandler = (fieldInfo) => {
        navigation.navigate('FieldScreen', { fieldInfo });
    }

    
    return (
        <View style={styles.container}>
            <View style={styles.background}>

                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 48.2083,
                        longitude: 16.3731,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >

                    {
                    fieldsDisplayed.map(fieldInfo => (
                            <Marker
                                key={fieldInfo.id}
                                coordinate={{ latitude: fieldInfo.latitude, longitude: fieldInfo.longitude }}                                
                            >

                                <Callout onPress={() => onPressLocationHandler(fieldInfo)}>
                                    <View style={{height: 50, width: 150}}>
                                        <Text style={{fontSize: 14, fontWeight: 'bold'}}> {fieldInfo.name} </Text>
                                        <Text style={{fontSize: 12,}}> {fieldInfo.description} </Text>
                                    </View>                                                                                             
                                </Callout>

                            </Marker>
                    ))
                    }

                    <Marker
                        pinColor={'#377c0c'}
                        key={'start'}
                        coordinate={pin}
                        draggable={true}
                        onDragStart={(e) => {
                            console.log("Drag start", e.nativeEvent.coordinate)
                        }}
                        onDragEnd={(e) => {
                            setPin({
                                latitude: e.nativeEvent.coordinate.latitude,
                                longitude: e.nativeEvent.coordinate.longitude,
                            });
                        }}
                    >
                        <Callout>
                            <Text>You're Here!</Text>
                        </Callout>
                    </Marker>

                </MapView>


            </View>
        

            <Pressable onPress={onPressBackHandler} style={styles.backButton}>
                <Ionicons name="chevron-back" size={40} color="#000000f3" />
            </Pressable>

            <Pressable onPress={(onPressFilteredSearchButtonHandler)} style={styles.filteredSearchButton} >
            <Text style={styles.filteredSearchButtonText}> Gefilterte Suche... </Text>
            </Pressable>


        </View>
    );
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const userLocation = { latitude: 48.2083, longitude: 16.3731 }; // Beispielposition
    const searchRadius = 10; // 10 km Suchradius
    const deg2rad = deg => deg * (Math.PI / 180);
    const R = 6371; // Radius der Erde in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance = R * c; // Distanz in km
    return Math.round(distance);
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
    map: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 2,
        height: 60,
        width: 60,
        top: 40,
        left: 5,
        backgroundColor: 'rgba(100, 100, 100, 0)',
        borderColor: 'rgba(100, 100, 100, 0)',
        borderWidth: 2,
        borderRadius: 30
    },
    filteredSearchButton: {
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        position: 'absolute',
        zIndex: 2,
        height: 60,
        width: '75%',
        top: Platform.OS == 'ios' ? 750 : 800,
        backgroundColor: '#3a3131',
        borderColor: 'white',
        borderWidth: 1.5,
        borderRadius: 30
    },
    filteredSearchButtonText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 18,
    },
    pinColor: {
      color: '#fff',
    },
    markContainer: {
        width: 150,
        height: 70,
    },
    image: {
        flex: 1,
        resizeMode: 'cover'
    }

});



export default MapScreen;