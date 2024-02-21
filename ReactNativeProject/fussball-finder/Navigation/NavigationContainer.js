import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from "../screens/MapScreen";
import StartScreen from "../screens/StartScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import FilterScreen from "../screens/FilterScreen";
import BookingScreen from '../screens/BookingScreen';
import FieldScreen from '../screens/FieldScreen';
import RegisterScreen from '../screens/RegisterScreen';




const Stack = createStackNavigator();

function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="StartScreen"
                             screenOptions={{
                                     headerShown: false,
                                 }}
            >
                <Stack.Screen name="StartScreen" component={StartScreen} />
                <Stack.Screen name="MapScreen" component={MapScreen} />
                <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} />
                <Stack.Screen name="FilterScreen" component={FilterScreen} />
                <Stack.Screen name="BookingScreen" component={BookingScreen} />
                <Stack.Screen name="FieldScreen" component={FieldScreen} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}



export default AppNavigation;