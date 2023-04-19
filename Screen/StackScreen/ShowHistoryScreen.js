import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const ShowHistoryScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.btnstyle, {
                    marginTop: 8
                }]}
                onPress={() => {
                    navigation.navigate('MyItem')
                }}
            >
                <Text style={styles.btntextstyle}>My Items</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.btnstyle, {
                    marginTop: 8
                }]}
                onPress={() => {
                    navigation.navigate('WinningItem')
                }}
            >
                <Text style={styles.btntextstyle}>Winning Items</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ShowHistoryScreen

const styles = StyleSheet.create({
    btnstyle: {
        width: "80%", backgroundColor: "#FF4949", paddingVertical: 6, borderRadius: 20
    },
    btntextstyle: {
        textAlign: "center", fontSize: 20, color: 'white'
    }
})