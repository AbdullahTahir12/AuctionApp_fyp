import * as React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import MainBottomTab from './BottomTab/MainBottomTab';
import EditProfile from './BottomTab/BottomScreen/EditProfile';

const Stack = createNativeStackNavigator();

function MainScreen() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="MainBottomTab" component={MainBottomTab} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
    );
}

export default MainScreen;