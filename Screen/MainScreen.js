import * as React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import MainBottomTab from './BottomTab/MainBottomTab';
import EditProfile from './BottomTab/BottomScreen/EditProfile';
import AddItem from './StackScreen/AddItem';
import ItemDetails from './StackScreen/ItemDetails';
import ForgetPasswordScreen from './StackScreen/ForgetPasswordScreen';
import SplashScreen from './SplashScreen';
import PaymentScreen from './StackScreen/PaymentScreen';

const Stack = createNativeStackNavigator();

function MainScreen() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}
            <Stack.Screen name="MainBottomTab" component={MainBottomTab} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="AddItem" component={AddItem} />
            <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
            <Stack.Screen name="ItemDetails" component={ItemDetails}
                options={{
                    headerShown: true,
                    headerTitle: 'AUCTION DETAIL',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: '#FF5862'
                    }
                }}
            />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen}
                options={{
                    headerShown: true,
                    headerTitle: 'Payment',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: '#FF5862'
                    }
                }}
            />
        </Stack.Navigator>
    );
}

export default MainScreen;