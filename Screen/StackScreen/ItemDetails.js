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
    const [favorite_details, setfavorite_details] = useState(1)

    const AddBid = () => {
        if (user) {
            navigation.navigate('PaymentScreen', {
                doc_key: route.params.item.key,
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
        const targetDate = moment(route.params.item.selectedEndDate, 'YYYY-MM-DD HH:mm:ss');
        const now = moment();
        const duration = moment.duration(targetDate.diff(now));
        const secondsRemaining = duration.asSeconds();
        setTimeRemaining(secondsRemaining);
        const subscriber = firestore()
            .collection('Item_Data')
            .doc(route.params.item.key)
            .onSnapshot(documentSnapshot => {
                setdata(documentSnapshot.data());

                if (documentSnapshot.data().favourite === undefined) {
                    setadd_to_favourite(false)
                } else {
                    const favourite = documentSnapshot.data().favourite;
                    const index = favourite.findIndex(item => item.user_key === route.params.uid);
                    // console.warn(index)
                    if (index !== -1) {
                        const item = favourite[index];
                        setadd_to_favourite(true)
                        setfavorite_details(index)
                        console.warn(index)
                    } else {
                        setadd_to_favourite(false)
                        setfavorite_details(0)
                        console.warn('no')
                        setfavorite_details(1)
                    }
                    // const favourite = documentSnapshot.data().favourite.filter(item => item.user_key === route.params.uid)
                    // console.warn(favourite)
                    // if (favourite.length > 0) {
                    //     setadd_to_favourite(true)
                    //     setfavorite_details(favourite)
                    // } else {
                    //     setadd_to_favourite(false)
                    //     setfavorite_details([])
                    // }
                }

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
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timeRemaining]);


    const addtofav = () => {
        if (user) {
            // console.warn(favorite_details)
            if (favorite_details == 1) {
                const bidsRef = firestore().collection('Item_Data').doc(route.params.item.key);
                bidsRef.get().then((doc) => {
                    if (doc.exists) {
                        const bidsRefList = doc.data().favourite || [];
                        const updatedbidsList = [...bidsRefList, {
                            user_key: route.params.uid,
                            user_name: user.displayName,
                            status: "yes"
                        }];
                        bidsRef.update({ favourite: updatedbidsList })
                            .then(() => {
                                console.warn("Favourites updated")
                            })
                            .catch((error) => {
                                console.error("Error updating Bids: ", error);
                            });
                    } else {
                        console.error("User document not found");
                    }
                }).catch((error) => {
                    console.error("Error getting user document: ", error);
                });
            } else {
                const bidsRef = firestore().collection('Item_Data').doc(route.params.item.key);

                bidsRef.get().then((doc) => {
                    const favouriteArray = doc.data().favourite;
                    if (favouriteArray) {
                        bidsRef.update({
                            favourite: firestore.FieldValue.arrayRemove(favouriteArray[favorite_details])
                        }).then(() => {
                            console.log("Array index successfully removed");
                        }).catch((error) => {
                            console.error("Error removing array index: ", error);
                        });
                    }
                }).catch((error) => {
                    console.error("Error getting document:", error);
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
                    source={{ uri: route.params.item.productimage }}
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
                        <Text style={{ color: 'grey' }}>{route.params.item.user_add_category}</Text>
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