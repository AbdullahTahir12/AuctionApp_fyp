import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { CardField, useStripe, createToken, StripeProvider } from '@stripe/stripe-react-native';
import firestore from '@react-native-firebase/firestore';

const PaymentScreen = ({ route, navigation }) => {
    const [cardinfo, setcardinfo] = useState(null)
    const [token, settoken] = useState(null)
    const [bidValue, setbidValue] = useState('')
    const addbidsvaluepress = async () => {
        // console.warn({
        //     bidValue: bidValue,
        //     price:route.params.price,
        //     max: route.params.max
        // })
        if (bidValue > route.params.price && !route.params.max) {
            const generatetoken = await createToken({ ...cardinfo, type: 'Card' })
            const bidsRef = firestore().collection('Item_Data').doc(route.params.doc_key);

            bidsRef.get().then((doc) => {
                if (doc.exists) {
                    const bidsRefList = doc.data().bids || [];
                    const updatedbidsList = [...bidsRefList, {
                        bids: bidValue,
                        user_name: route.params.user_name,
                        user_image: route.params.user_image,
                        key: route.params.key,
                        payment_token: generatetoken.token.id
                    }];
                    bidsRef.update({ bids: updatedbidsList })
                        .then(() => {
                            navigation.goBack()
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
        } else if (bidValue > route.params.max && route.params.max !== 0) {
            const bidsRef = firestore().collection('Item_Data').doc(route.params.doc_key);
            const generatetoken = await createToken({ ...cardinfo, type: 'Card' })

            bidsRef.get().then((doc) => {
                if (doc.exists) {
                    const bidsRefList = doc.data().bids || [];
                    const updatedbidsList = [...bidsRefList, {
                        bids: bidValue,
                        user_name: route.params.user_name,
                        user_image: route.params.user_image,
                        key: route.params.key,
                        payment_token: generatetoken.token.id
                    }];
                    bidsRef.update({ bids: updatedbidsList })
                        .then(() => {
                            navigation.goBack()
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
        }
        else {
            alert("Bids Value is Lower than max Value")
        }
    }

    const fetchcardinfo = (cardDetails) => {
        if (cardDetails.complete) {
            setcardinfo(cardDetails)
        } else {
            setcardinfo(null)
        }
    }
    return (
        <View>
            <TextInput
                placeholder='Place Your Bids Here'
                style={{ borderWidth: 1 }}
                onChangeText={(e) => setbidValue(e)}
            />
            <StripeProvider
                publishableKey={"pk_test_51KbeYcB3H2w4KQMqSoncZMqfrgmoshWmGTzWNn5u2IjCCOj1ik76dWBU6O7s6k8ilVKfKJdr6T78xwrbGuncAplE00jgsE0Dlh"}
                merchantIdentifier="merchant.identifier" // required for Apple Pay
                urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            >
                <CardField
                    postalCodeEnabled={false}
                    placeholders={{
                        number: '4242 4242 4242 4242',
                    }}
                    cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: '#000000',
                    }}
                    style={{
                        width: '100%',
                        height: 50,
                        marginVertical: 30,
                    }}
                    onCardChange={(cardDetails) => {
                        fetchcardinfo(cardDetails)
                    }}
                    onFocus={(focusedField) => {
                        console.log('focusField', focusedField);
                    }}
                />
            </StripeProvider>
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.btnstyle, {
                    marginTop: 8
                }]}
                onPress={() => {
                    addbidsvaluepress()
                }}
            >
                <Text style={styles.btntextstyle}>Add Bid</Text>
            </TouchableOpacity>
        </View>
    )
}

export default PaymentScreen

const styles = StyleSheet.create({
    btnstyle: {
        width: "80%", backgroundColor: "#FF4949", paddingVertical: 6, borderRadius: 20, alignSelf: "center"
    },
    btntextstyle: {
        textAlign: "center", fontSize: 20, color: 'white'
    }
})