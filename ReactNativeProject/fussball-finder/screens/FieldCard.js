import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function FieldCard({ fieldInfo, onSelect }) {
    const navigation = useNavigation();

    const selectHandler = () => {
        navigation.navigate('FieldScreen', {fieldInfo});
    }

    return (
        <View style={styles.fieldContainer}>
            <ImageBackground
                source={{uri: fieldInfo.image}}
                style={styles.image}
            >
                <LinearGradient
                    colors={['#00000000', '#000000a9']}
                    style={styles.linearGradient}
                ></LinearGradient>

                {/* Begrenzung des klickbaren Bereichs */}
                <Pressable onPress={selectHandler} style={styles.pressableArea}>
                    <View style={styles.textContainer}>
                        <Text style={styles.subtitle}> { fieldInfo.name } </Text>
                        <Text style={styles.subtitle}> {fieldInfo.rating} / 5</Text>
                    </View>
                </Pressable>
            </ImageBackground>  
        </View>
    );
}

const styles = StyleSheet.create({
  fieldContainer: {
      height: 200,
      width: '95%',
      alignSelf: "center",
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 25,
  },
  image: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
  },
  pressableArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
  },
  textContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingBottom: 5,
  },
  subtitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: "bold",
  },
  linearGradient: {
      height: '100%',
      width: '100%',
  },
});
