import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const { width, height } = Dimensions.get('screen')

const WinningItem = () => {
    const [data, setData] = useState([]);
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return () => subscriber();
    }, []);

    function onAuthStateChanged(user) {
        try {
            setUser(user);
            if (initializing) setInitializing(false);
        } catch (error) {
            // Handle error
            console.error('Error in onAuthStateChanged:', error);
        }
    }

    useEffect(() => {
        if (!initializing && user && user.uid) {
            try {
                // console.warn(user.uid)
                const subscriber = firestore()
                    .collection('Item_Data')
                    .where('winning_person_key', '==', user.uid)
                    .where('status', '==', 'yes')
                    .onSnapshot(querySnapshot => {
                        const users = [];
                        querySnapshot.forEach(documentSnapshot => {
                            users.push({
                                ...documentSnapshot.data(),
                                key: documentSnapshot.id,
                            });
                        });
                        setData(users);
                    });

                return () => subscriber();
            } catch (error) {
                // Handle error
                console.error('Error in Firestore query:', error);
            }
        } else {
            setData([])
        }
    }, [initializing, user]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                contentContainerStyle={{
                    paddingBottom: 35
                }}
                data={data}
                ListEmptyComponent={
                    <View style={{ flex: 1, alignItems: "center", marginTop: "50%" }}>
                        <Text style={{ color: 'red', fontSize: 18 }}>Nothing To Show</Text>
                    </View>
                }
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ padding: 10, backgroundColor: 'lightgrey', marginTop: 25 }}>
                            <View style={{ marginTop: 5 }}>
                                <Image
                                    source={{ uri: item.productimage }}
                                    style={{ width: width, height: 215, resizeMode: 'contain' }}
                                />
                            </View>
                            <View style={{ marginTop: 10, marginLeft: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 18, color: 'black', }}>{item.title}</Text>
                                </View>
                                <Text style={{ fontSize: 14, color: 'grey', width: '90%', marginTop: 10 }}>{item.description}</Text>
                            </View>
                            <Text style={{ marginLeft: 15, fontSize: 18, color: 'black', marginTop: 10 }}>Information Detail</Text>
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", width: '90%', marginLeft: 15, marginTop: 10 }}>
                                <View>
                                    <View>
                                        <Text style={{ color: 'black' }}>Winning Bid</Text>
                                        <Text style={{ color: 'grey' }}>{item.winning_bid_value}</Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ color: 'black' }}>Auction End</Text>
                                        <Text style={{ color: 'grey' }}>{item.selectedEndDate}</Text>
                                    </View>
                                </View>
                                <View>
                                    <View>
                                        <Text style={{ color: 'black' }}>Author</Text>
                                        <Text style={{ color: 'grey' }}>{item.user_add_category}</Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ color: 'black' }}>Price</Text>
                                        <Text style={{ color: 'grey' }}>{item.price}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                }}
            />
        </View>
    )
}

export default WinningItem

const styles = StyleSheet.create({})