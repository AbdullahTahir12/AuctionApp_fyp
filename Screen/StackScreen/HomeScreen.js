import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Landingpage from './Landingpage'
import Favourite from './Favourite'

const HomeScreen = () => {
    const [select, setselect] = useState(0)
    return (
        <View style={{ flex: 1 }}>
            {
                select == 0 ? (<Landingpage setselect={setselect} />) : select == 1 ? (<Favourite setselect={setselect} />) : null
            }
            <View style={{
                position: 'absolute',
                bottom: 0,
                width: "100%",
                height: 70,
                backgroundColor: 'lightgrey',
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: 'space-evenly',
                elevation: 5
            }}>
                <TouchableOpacity
                    onPress={() => {
                        setselect(0)
                    }}>
                    <Text>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setselect(1)
                    }}
                >
                    <Text>WishList</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})