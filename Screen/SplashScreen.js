import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('MainBottomTab')
        }, 2000);
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: '#FF4949', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 48, color: 'white', fontWeight: 'bold' }}>Auction App</Text>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({})