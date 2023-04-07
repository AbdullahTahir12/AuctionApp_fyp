import { SafeAreaView, ScrollView, StyleSheet, Text, View, BackHandler, Alert, FlatList } from 'react-native'
import React, { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';

const Landingpage = () => {
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 10
        }}>
            {/* Header */}
            <View>
                <Text
                    style={{
                        color: "#FF4949",
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight: '700'
                    }}
                >Home</Text>
            </View>
            {/* AppName */}
            <View>
                <Text
                    style={{
                        color: "#FF4949",
                        fontSize: 20,
                        marginTop: 6,
                        fontWeight: '700'
                    }}
                >Auction App</Text>
            </View>
            {/* Offer */}
            <View>
                <Text
                    style={{
                        fontSize: 16,
                        marginTop: 6,
                        fontWeight: '700'
                    }}
                >Popular Auctions</Text>
                <View style={{ height: 140, width: "100%", backgroundColor: 'red' }}>
                    <View>
                        <View>
                            <Text style={{
                                fontSize: 40,
                                color:'white',
                                
                            }}>20%</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Landingpage

const styles = StyleSheet.create({})