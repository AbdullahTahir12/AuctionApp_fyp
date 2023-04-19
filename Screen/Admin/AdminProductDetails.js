import { StyleSheet, Text, View, FlatList, Button, TextInput, Image, ScrollView, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CardField, useStripe, createToken } from '@stripe/stripe-react-native';
const { width, height } = Dimensions.get('screen')

const ItemDetails = ({ route, navigation }) => {
    const [data, setdata] = useState('')
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [bids, setbids] = useState([])
    const [max, setmax] = useState(0)
    const [btnstate, setbtnstate] = useState(false)
    const [soldto, setsoldto] = useState('In Auction')


    useEffect(() => {
        const targetDate = moment(route.params.selectedEndDate, 'YYYY-MM-DD HH:mm:ss');
        const now = moment();
        const duration = moment.duration(targetDate.diff(now));
        const secondsRemaining = duration.asSeconds();
        setTimeRemaining(secondsRemaining);
        const subscriber = firestore()
            .collection('Item_Data')
            .doc(route.params.key)
            .onSnapshot(documentSnapshot => {
                setdata(documentSnapshot.data());

                if (documentSnapshot.data().bids === undefined) {
                    setbids([]);
                    setmax(data.price);
                } else {

                    // setsoldto(documentSnapshot.data().bids[0].user_name)
                    // console.warn(data.)
                    if (documentSnapshot.data().bids.length > 0) {
                        setsoldto(documentSnapshot.data().bids[0].user_name)
                    } else {
                        setsoldto("In Auction")
                    }

                    var arr = []
                    for (var i = 0; i < documentSnapshot.data().bids.length; i++) {
                        arr.push({
                            ...documentSnapshot.data().bids[i],
                            index: i
                        })
                    }
                    const array = arr
                    array.sort((a, b) => b.bids - a.bids);
                    setbids(array);

                    const array1 = documentSnapshot.data().bids;
                    const maxBid = Math.max(...array1.map(item => item.bids));
                    setmax(maxBid);
                }
            });


        return () => subscriber();
    }, [btnstate]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (timeRemaining > 0) {
                setTimeRemaining(timeRemaining - 1);
            } else {
                if (bids.length == 0) {
                    firestore()
                        .collection('Item_Data')
                        .doc(route.params.key)
                        .update({
                            status: 'yes',
                            winning_person_key: 'No One Bids',
                        })
                        .then(() => {
                            // console.log('Bids Completed!');
                        });
                } else {
                    firestore()
                        .collection('Item_Data')
                        .doc(route.params.key)
                        .update({
                            status: 'yes',
                            winning_person_key: bids[0].key,
                            winning_bid_value: max
                        })
                        .then(() => {
                            // navigation.goBack()
                        });
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timeRemaining]);


    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    const remainingSeconds = Math.floor(timeRemaining % 60);

    const formattedTime = `${days}D ${hours}H ${minutes}M ${remainingSeconds}S`;


    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={{ marginTop: 5 }}>
                <Image
                    source={{ uri: route.params.productimage }}
                    style={{ width: width, height: 215, resizeMode: 'contain' }}
                />
            </View>
            <View style={{ marginTop: 10, marginLeft: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 18, color: 'black', }}>{data.title}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('AdminAddItem', {
                                data: data,
                                type: 'edit',
                                key: route.params.key
                            })
                        }}>
                            <FontAwesome5
                                name={'edit'}
                                color={'grey'}
                                size={25}
                                style={{
                                    marginRight: 40
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            Alert.alert(
                                "Are you sure you want to",
                                "Delete this item",
                                [
                                    {
                                        text: "Confirm", onPress: () => {
                                            // console.warn(route.params.key)
                                            firestore()
                                                .collection('Item_Data')
                                                .doc(route.params.key)
                                                .delete()
                                                .then(() => {
                                                    console.log('Item deleted');
                                                    navigation.goBack();
                                                });
                                        }
                                    },
                                    { text: "Cancel", onPress: () => { } }
                                ]
                            )
                        }}>
                            <FontAwesome5
                                name={'trash'}
                                color={'grey'}
                                size={25}
                                style={{
                                    marginRight: 40
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontSize: 14, color: 'grey', width: '90%', marginTop: 10 }}>{data.description}</Text>
            </View>
            <Text style={{ marginLeft: 15, fontSize: 18, color: 'black', marginTop: 10 }}>Information Detail</Text>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", width: '90%', marginLeft: 15, marginTop: 10 }}>
                <View>
                    <View>
                        <Text style={{ color: 'black' }}>Highest Bid</Text>
                        <Text style={{ color: 'grey' }}>{max ? max : data.price}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: 'black' }}>Auction End</Text>
                        <Text style={{ color: 'grey' }}>{formattedTime}</Text>
                    </View>
                </View>
                <View>
                    <View>
                        <Text style={{ color: 'black' }}>Author</Text>
                        <Text style={{ color: 'grey' }}>{route.params.user_add_category}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: 'black' }}>Price</Text>
                        <Text style={{ color: 'grey' }}>{data.price}</Text>
                    </View>
                </View>
                <View>
                    <View>
                        <Text style={{ color: 'black' }}>Status</Text>
                        <Text style={{ color: 'grey' }}>{data.status == 'no' ? 'In Auction' : "Sold"}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: 'black' }}>Sold To</Text>
                        <Text style={{ color: 'grey' }}>{data.status == 'no' ? '' : soldto}</Text>
                    </View>
                </View>
            </View>
            <Text style={{ marginLeft: 15, fontSize: 18, color: 'black', marginTop: 10 }}>Highest Bids</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '90%', marginLeft: 15, marginTop: 10, paddingBottom: 70 }}>
                {
                    bids && (
                        bids.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <View>
                                        <Image
                                            source={{ uri: item.user_image }}
                                            style={{ width: 51, height: 51, resizeMode: 'contain', borderRadius: 60 }}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: "center", width: '80%', justifyContent: 'space-between' }}>
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ color: 'grey' }}>{item.user_name}</Text>
                                            <Text style={{ color: 'grey' }}>{item.bids}</Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={() => {
                                                const itemRef = firestore().collection('Item_Data').doc(route.params.key);
                                                itemRef.update({
                                                    bids: firestore.FieldValue.arrayRemove({
                                                        bids:
                                                            item.bids,
                                                        key:
                                                            item.key,
                                                        payment_token:
                                                            item.payment_token,
                                                        user_image:
                                                            item.user_image,
                                                        user_name:
                                                            item.user_name,
                                                    })
                                                })
                                                    .then(() => {
                                                        console.log('Document updated successfully');
                                                    })
                                                    .catch((error) => {
                                                        console.error('Error updating document: ', error);
                                                    });
                                            }}>
                                                <FontAwesome5
                                                    name={'arrow-alt-circle-up'}
                                                    color={'red'}
                                                    size={35}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                            )
                        })
                    )
                }
            </ScrollView>
        </View>
    )
}

export default ItemDetails

const styles = StyleSheet.create({})