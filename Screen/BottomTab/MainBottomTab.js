import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './BottomScreen/HomeScreen';
import SearchScreen from './BottomScreen/SearchScreen';
import ProfileScreen from './BottomScreen/ProfileScreen';
import FavouriteScreen from './BottomScreen/FavouriteScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();
const MainBottomTab = () => {
    return (
        <Tab.Navigator
            activeColor="red"
            inactiveColor="green"
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    paddingTop:5
                },
                tabBarLabel: ''
            }}

        >
            <Tab.Screen options={{
                tabBarIcon: ({ color, size, focused }) => (
                    <FontAwesome5
                        name={focused ? 'home' : 'home'}
                        color={focused ? 'red' : 'grey'}
                        size={size}
                    />
                ),

            }} name="Home" component={HomeScreen} />
            <Tab.Screen options={{
                tabBarIcon: ({ color, size, focused }) => (
                    <FontAwesome5
                        name={focused ? 'search' : 'search'}
                        color={focused ? 'red' : 'grey'}
                        size={size}
                    />
                ),
            }} name="Search" component={SearchScreen} />
            <Tab.Screen options={{
                tabBarIcon: ({ color, size, focused }) => (
                    <MaterialIcons
                        name={focused ? 'favorite' : 'favorite'}
                        color={focused ? 'red' : 'grey'}
                        size={size}
                    />
                ),
            }} name="Favourite" component={FavouriteScreen} />
            <Tab.Screen options={{
                tabBarIcon: ({ color, size, focused }) => (
                    <AntDesign
                        name={focused ? 'profile' : 'profile'}
                        color={focused ? 'red' : 'grey'}
                        size={size}
                    />
                ),
            }} name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}

export default MainBottomTab

const styles = StyleSheet.create({})