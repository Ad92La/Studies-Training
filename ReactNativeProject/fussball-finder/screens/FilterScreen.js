import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, Switch, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Slider from '@react-native-community/slider';



function FilterScreen() {
    const [indoorOutdoor, setIndoorOutdoor] = useState(false);
    const [indoorOutdoorText, setIndoorOutdoorText] = useState('Nein');
    const [fieldSize, setFieldSize] = useState(50);
    const [fieldSizeText, setFieldSizeText] = useState(`${fieldSize} m²`);
    const [showerFacilities, setShowerFacilities] = useState(false);
    const [showerFacilitiesText, setShowerFacilitiesText] = useState('Nein');
    const [searchRadius, setSearchRadius] = useState(5);
    const [searchRadiusText, setSearchRadiusText] = useState(`${searchRadius} km`);
    const [parking, setParking] = useState(false);
    const [parkingText, setParkingText] = useState('Nein');
    

    const navigation = useNavigation();

    const onPressBackHandler = () => {
        navigation.goBack();
    };

    const applyFilters = () => {
        const filters = {
            indoorOutdoor,
            fieldSize,
            showerFacilities,
            searchRadius,
            parking
        };
        console.log('Filter werden angewendet...');
        console.log('Übergebene Filter:', filters);
        navigation.navigate('MapScreen', { filters });
    };

    const toggleIndoorOutdoor = () => {
        const newIndoorOutdoorValue = !indoorOutdoor;
        setIndoorOutdoor(newIndoorOutdoorValue);
        setIndoorOutdoorText(newIndoorOutdoorValue ? 'Ja' : 'Nein');
    };

    const changeFieldSize = (size) => {
        setFieldSize(size);
        setFieldSizeText(`${size} m²`);
    };

    const toggleShowerFacilities = () => {
        const newShowerFacilitiesValue = !showerFacilities;
        setShowerFacilities(newShowerFacilitiesValue);
        setShowerFacilitiesText(newShowerFacilitiesValue ? 'Ja' : 'Nein');
    };

    const changeSearchRadius = (radius) => {
        setSearchRadius(radius);
        setSearchRadiusText(`${radius} km`);
    };

    const toggleParking = () => {
        const newParkingValue = !parking;
        setParking(newParkingValue);
        setParkingText(newParkingValue ? 'Ja' : 'Nein');
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                    source={{uri: 'https://cdn.midjourney.com/c4a20077-0696-432f-a600-1d26fb203a0d/0_2.webp'}}
                    style={styles.backgroundimage}>
                <Text style={styles.title}>Suche</Text>

                <Pressable onPress={onPressBackHandler} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={40} color="#000000f3" />
                </Pressable>

                <View style={styles.filters}>
                    <View style={styles.filterOption}>
                        <Text style={styles.filterOptionText}>Indoor/Outdoor: {indoorOutdoorText}</Text>
                        <Switch
                            value={indoorOutdoor}
                            onValueChange={toggleIndoorOutdoor}
                            color={'white'}
                            trackColor={'white'}
                            thumbColor={'white'}
                        />
                    </View>

                    <View style={styles.filterOption}>
                        <Text style={styles.filterOptionText}>Platzgröße: {fieldSizeText}</Text>
                        <Slider
                            value={fieldSize}
                            onValueChange={changeFieldSize}
                            step={5}
                            minimumValue={0}
                            maximumValue={100}
                            style={{width: 200}}
                            maximumTrackTintColor={'white'}
                        />
                    </View>

                    <View style={styles.filterOption}>
                        <Text style={styles.filterOptionText}>Duschkabinen: {showerFacilitiesText}</Text>
                        <Switch
                                value={showerFacilities}
                                onValueChange={toggleShowerFacilities}
                        />
                    </View>

                    <View style={styles.filterOption}>
                        <Text style={styles.filterOptionText}>Suchradius: {searchRadiusText}</Text>
                        <Slider
                            value={searchRadius}
                            onValueChange={changeSearchRadius}
                            step={1}
                            minimumValue={1}
                            maximumValue={50}
                            style={{width: 200}}
                            maximumTrackTintColor='white'
                        />
                    </View>

                    <View style={styles.filterOption}>
                        <Text style={styles.filterOptionText}>Parkgarage: {parkingText}</Text>
                        <Switch
                                value={parking}
                                onValueChange={toggleParking}
                        />
                    </View>

                    <Pressable onPress={applyFilters}>
                        <View style={styles.findButton}>
                            <Text style={styles.findButtonText}>Platz finden</Text>
                        </View>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    filters: {
        marginTop: 300,
        Color: 'red',
        flex: 1,
        marginLeft: 20
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
        paddingRight: 20
    },
    filterOptionText: {
        color: '#fff',
        fontSize: 20
    },
    findButton: {
        width: '85%',
        height: 60,
        backgroundColor: '#c98328',
        alignSelf: 'center',
        top: Platform.OS == 'ios' ? 150 : 200,
        borderRadius: 30,
        borderColor: 'white',
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    findButtonText: {
        color: '#000',
        fontSize: 20
    },   

});

export default FilterScreen;
