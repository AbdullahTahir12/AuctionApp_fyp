import { StyleSheet, Text, View, FlatList, Button, TextInput, Image, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native'
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
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const [btnstate, setbtnstate] = useState(false)
    const [uuuid, setuuuid] = useState([])
    const [add_to_favourite, setadd_to_favourite] = useState(false)
    const [favorite_details, setfavorite_details] = useState([])

    const AddBid = () => {
        if (user) {
            navigation.navigate('PaymentScreen', {
                doc_key: route.params.key,
                user_name: user.displayName,
                user_image: user.photoURL,
                key: user.uid,
                price: data.price,
                max: max
            })
        } else {
            alert('Please Login to Place Bid')
        }
    }


    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);


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
                    const array = documentSnapshot.data().bids
                    array.sort((a, b) => b.bids - a.bids);
                    setbids(array);

                    const array1 = documentSnapshot.data().bids;
                    const maxBid = Math.max(...array1.map(item => item.bids));
                    setmax(maxBid);

                    if (route.params.uid !== 'user_not') {
                        const uid = route.params.uid;
                        const uuuid = documentSnapshot.data().bids.filter(item => item.key == uid)
                        setuuuid(uuuid)
                        if (uuuid.length > 0 && uuuid[0].key !== undefined && uuuid[0].key === uid) {
                            setbtnstate(true)
                        } else {
                            setbtnstate(false)
                        }
                    } else {
                        setbtnstate(false)
                    }
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
                            console.log('Bids Completed!');
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
                            navigation.goBack()
                        });
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timeRemaining]);

    useEffect(() => {
        if (!initializing && user && user.uid) {
            try {
                const subscriber = firestore()
                    .collection('Favourite')
                    .where('user_key', '==', user.uid)
                    .where('item_key', '==', route.params.key)
                    .onSnapshot(querySnapshot => {
                        const favorite_details = [];
                        querySnapshot.forEach(documentSnapshot => {
                            favorite_details.push({
                                ...documentSnapshot.data(),
                                doc_key: documentSnapshot.id,
                            });
                        });
                        // setData(users);
                        // console.warn(favorite_details)
                        if (favorite_details.length == 0) {
                            setadd_to_favourite(false)
                        } else {
                            const favorite_details_data = favorite_details.filter(item => item.item_key == route.params.key)
                            if (favorite_details_data) {
                                setadd_to_favourite(true)
                                setfavorite_details(favorite_details_data)
                            }
                        }
                    });

                return () => subscriber();
            } catch (error) {
                console.error('Error in Firestore query:', error);
            }
        }
    }, [initializing, user]);


    const addtofav = () => {
        if (user) {
            if (add_to_favourite == false) {
                firestore()
                    .collection("Favourite")
                    .add({
                        item_key: route.params.key,
                        user_name: user.displayName,
                        user_key: user.uid,
                        selectedEndDate: route.params.selectedEndDate,
                        productimage: route.params.productimage,
                        user_add_category: route.params.user_add_category,
                        title: data.title,
                        description: data.description
                    })
                    .then(() => {
                        console.log('Add to favorites Added');
                    }).catch((err) => {
                        console.log(err)
                    })
            } else {
                // console.warn(favorite_details[0].doc_key)
                firestore()
                    .collection('Favourite')
                    .doc(favorite_details[0].doc_key)
                    .delete()
                    .then(() => {
                        setadd_to_favourite(false)
                    });
            }
        } else {
            alert('Please Login')
        }

    }


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
                    <TouchableOpacity onPress={() => addtofav()}>
                        <MaterialIcons
                            name={'favorite'}
                            color={add_to_favourite ? 'red' : 'grey'}
                            size={25}
                            style={{
                                marginRight: 40
                            }}
                        />
                    </TouchableOpacity>
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
                        <Text style={{ color: 'black' }}>Name</Text>
                        <Text style={{ color: 'grey' }}>{route.params.user_add_category}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: 'black' }}>Price</Text>
                        <Text style={{ color: 'grey' }}>{data.price}</Text>
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
                                            <FontAwesome5
                                                name={'arrow-alt-circle-up'}
                                                color={'red'}
                                                size={35}
                                            />
                                        </View>
                                    </View>
                                </View>

                            )
                        })
                    )
                }
            </ScrollView>
            {/* <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => setaddbidmodel(false)}
                visible={addbidmodel}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: "center",
                    backgroundColor: "#000000aa"
                }}>
                    <View style={{ backgroundColor: "lightgrey", padding: "20%" }}>
                        <TextInput
                            placeholder='Place Your Bids Here'
                            style={{ borderWidth: 1 }}
                            onChangeText={(e) => setbidValue(e)}
                        />
                        <TouchableOpacity onPress={() => addbidsvaluepress()} style={{ backgroundColor: 'red', marginTop: 10, borderRadius: 10 }}>
                            <Text style={{ textAlign: "center", fontSize: 20, color: 'white' }}>Add Bid</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal> */}
            <View style={{ position: 'absolute', bottom: 0, width: "100%", height: 60, backgroundColor: 'white', borderTopWidth: 1 }}>
                <TouchableOpacity disabled={btnstate == true && max == uuuid[0].bids ? true : false} onPress={() => AddBid()} style={{ width: "90%", backgroundColor: btnstate == true && max == uuuid[0].bids ? 'grey' : '#FF4949', paddingVertical: 10, alignSelf: 'center', marginTop: 10, borderRadius: 10 }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>Add Bid</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ItemDetails

const styles = StyleSheet.create({})