import { SafeAreaView, ScrollView, StyleSheet, Text, View, BackHandler, Alert } from 'react-native'
import React, { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const Favourite = ({setselect}) => {
    const navigation = useNavigation()
    const backAction = () => {
        setselect(0)
        return true;
    };
    useFocusEffect(useCallback(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, []))
    return (
        <View>
            <Text>Favourite</Text>
        </View>
    )
}

export default Favourite

const styles = StyleSheet.create({})