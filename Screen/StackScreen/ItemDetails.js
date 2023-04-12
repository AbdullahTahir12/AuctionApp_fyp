import { StyleSheet, Text, View, FlatList, Button, TextInput, Image, ScrollView, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';

const ItemDetails = ({ route }) => {
    const [data, setdata] = useState('')
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [bids, setbids] = useState([])
    const [bidValue, setbidValue] = useState('')
    const [max, setmax] = useState(0)
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const [addbidmodel, setaddbidmodel] = useState(false)
    const [btnstate, setbtnstate] = useState(false)

    const AddBid = () => {
        if (user) {
            setaddbidmodel(true)
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
                if (documentSnapshot.data().bids === undefined) {
                    setbids([]);
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
                        if (uuuid.length > 0 && uuuid[0].key !== undefined && uuuid[0].key === uid && uuuid[0].value === max) {
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

    const addbidsvaluepress = async () => {
        if (bidValue > route.params.item.price && !max) {
            const bidsRef = firestore().collection('Item_Data').doc(route.params.item.key);

            bidsRef.get().then((doc) => {
                if (doc.exists) {
                    const bidsRefList = doc.data().bids || [];
                    const updatedbidsList = [...bidsRefList, {
                        bids: bidValue,
                        user_name: user.displayName,
                        user_image: user.photoURL,
                        key: user.uid
                    }];
                    bidsRef.update({ bids: updatedbidsList })
                        .then(() => {
                            setaddbidmodel(false)
                        })
                        .catch((error) => {
                            console.error("Error updating user: ", error);
                        });
                } else {
                    console.error("User document not found");
                }
            }).catch((error) => {
                console.error("Error getting user document: ", error);
            });
        } else if (bidValue > max && max !== 0) {
            const bidsRef = firestore().collection('Item_Data').doc(route.params.item.key);

            bidsRef.get().then((doc) => {
                if (doc.exists) {
                    const bidsRefList = doc.data().bids || [];
                    const updatedbidsList = [...bidsRefList, {
                        bids: bidValue,
                        user_name: user.displayName,
                        user_image: user.photoURL,
                        key: user.uid
                    }];
                    bidsRef.update({ bids: updatedbidsList })
                        .then(() => {
                            setaddbidmodel(false)
                        })
                        .catch((error) => {
                            console.error("Error updating user: ", error);
                        });
                } else {
                    console.error("User document not found");
                }
            }).catch((error) => {
                console.error("Error getting user document: ", error);
            });
        }
        else {
            alert("Bids Value is Lower than max Value")
        }
    }

    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    const remainingSeconds = Math.floor(timeRemaining % 60);

    const formattedTime = `${days}D ${hours}H ${minutes}M ${remainingSeconds}S`;
    return (
        <View style={{ backgroundColor: 'white', padding: 20, flex: 1 }}>
            <View>
                <Image
                    source={{ uri: "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?cs=srgb&dl=pexels-pixabay-531880.jpg&fm=jpg" }}
                    style={{ width: 358, height: 215, resizeMode: 'contain' }}
                />
            </View>
            <View style={{ marginTop: 10, marginLeft: 5 }}>
                <Text style={{ fontSize: 18, color: 'black', }}>{data.title}</Text>
                <Text style={{ fontSize: 14, color: 'grey', width: '90%', marginTop: 10 }}>{data.description}</Text>
            </View>
            <Text style={{ marginLeft: 5, fontSize: 18, color: 'black', marginTop: 10 }}>Information Detail</Text>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", width: '90%', marginLeft: 5, marginTop: 10 }}>
                <View>
                    <View>
                        <Text style={{ color: 'black' }}>Highest Bid</Text>
                        <Text>{max ? max : data.price}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: 'black' }}>Auction End</Text>
                        <Text>{formattedTime}</Text>
                    </View>
                </View>
                <View>
                    <View>
                        <Text style={{ color: 'black' }}>Name</Text>
                        <Text>Muhammad Shahzaib</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: 'black' }}>Price</Text>
                        <Text>{data.price}</Text>
                    </View>
                </View>
            </View>
            <Text style={{ marginLeft: 5, fontSize: 18, color: 'black', marginTop: 10 }}>Highest Bids</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '90%', marginLeft: 5, marginTop: 10, paddingBottom: 70 }}>
                {
                    bids && (
                        bids.map((item, index) => {
                            return (
                                <>
                                    <View key={index} style={{ flexDirection: 'row', marginTop: 10 }}>
                                        <View>
                                            <Image
                                                source={{ uri: item.user_image }}
                                                style={{ width: 51, height: 51, resizeMode: 'contain', borderRadius: 60 }}
                                            />
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: "center", width: '80%', justifyContent: 'space-between' }}>
                                            <View style={{ marginLeft: 10 }}>
                                                <Text>{item.user_name}</Text>
                                                <Text>{item.bids}</Text>
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
                                </>
                            )
                        })
                    )
                }
            </ScrollView>
            <Modal
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
            </Modal>
            <View style={{ position: 'absolute', bottom: 0, width: "110%", height: 60, backgroundColor: 'white', borderTopWidth: 1 }}>
                <TouchableOpacity disabled={btnstate} onPress={() => AddBid()} style={{ width: "90%", backgroundColor: '#FF4949', paddingVertical: 10, alignSelf: 'center', marginTop: 10, borderRadius: 10 }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>Add Bid</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ItemDetails

const styles = StyleSheet.create({})