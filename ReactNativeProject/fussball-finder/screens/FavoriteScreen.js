import React, { useContext } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import FieldCard from './FieldCard';
import { FootballFieldsContext } from '../utils/FootballFieldsContext';

function FavoriteScreen() {
    const { footballFields } = useContext(FootballFieldsContext);
    const navigation = useNavigation();


    const onPressBackHandler = () => {
        navigation.push('StartScreen');
    }

    return (
        <View style={styles.container}>
            {/* Hintergrundbild */}
            <ImageBackground
                source={{ uri: 'https://cdn.midjourney.com/c4a20077-0696-432f-a600-1d26fb203a0d/0_2.webp' }}
                style={styles.backgroundimage}
            >
                {/* Header Bereich mit Zurück-Button und Überschrift */}
                <View style={styles.header}>
                    <Pressable onPress={onPressBackHandler} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={40} color="#000000f3" />
                    </Pressable>
                    <Text style={styles.title}>Favoriten</Text>
                </View>

                {/* ScrollView für die Bilder */}
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    {footballFields.filter(field => field.isFavorite).map((field) => (
                        <FieldCard
                            key={field.id}
                            fieldInfo={field}
                        />
                    ))}
                </ScrollView>
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
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 10,
        width: '100%',
    },
    title: {
        flex: 1,
        color: '#000',
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
        //paddingLeft: 10, 
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: 60,
        position: 'absolute',
        top: 50,
        left: 5,
        backgroundColor: 'rgba(100, 100, 100, 0)',
        borderColor: 'rgba(100, 100, 100, 0)',
        borderWidth: 2,
        borderRadius: 30,
        zIndex: 10,
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 5,
        paddingTop: 10,
    }
});

export default FavoriteScreen;
