import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';

const image = "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?cs=srgb&dl=pexels-pixabay-531880.jpg&fm=jpg"
const ProfileScreen = ({ navigation }) => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    console.log(user)

    if (initializing) return null;

    if (!user) {
        return (
            <View style={{
                backgroundColor: 'white',
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("Login")
                    }}
                    activeOpacity={0.5}
                    style={{
                        backgroundColor: "#FF5862",
                        paddingHorizontal: 40,
                        paddingVertical: 10,
                        borderRadius: 10
                    }}>
                    <Text style={{
                        color: "white",
                        fontSize: 18
                    }}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("SignUp")
                    }}
                    activeOpacity={0.5}
                    style={{
                        backgroundColor: "#FF5862",
                        paddingHorizontal: 40,
                        paddingVertical: 10,
                        borderRadius: 10,
                        marginTop: 10
                    }}>
                    <Text style={{
                        color: "white",
                        fontSize: 18
                    }}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
        }}>
            <View style={{ alignItems: "center", marginTop: 20 }}>
                <Image
                    source={{ uri: user.photoURL }}
                    style={{
                        height: 120,
                        width: 120,
                        resizeMode: 'contain',
                        borderRadius: 80,
                    }}
                />
            </View>
            <View>
                <Text
                    style={{
                        textAlign: "center",
                        marginTop: 20,
                        fontSize: 25,
                        color: 'black'
                    }}>Welcome <Text style={{ color: 'red', fontSize: 15 }}>{user.displayName}</Text></Text>
            </View>
            <View style={{ alignItems: "center", marginTop: 30 }}>
                <TouchableOpacity activeOpacity={0.5} style={styles.btnstyle}>
                    <Text style={styles.btntextstyle}>Add Item</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={[styles.btnstyle, {
                    marginTop: 8
                }]}>
                    <Text style={styles.btntextstyle}>Show History</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={[styles.btnstyle, {
                    marginTop: 8
                }]}>
                    <Text style={styles.btntextstyle}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={[styles.btnstyle, {
                        marginTop: 8
                    }]}
                    onPress={() => {
                        auth()
                            .signOut()
                            .then(() => console.log('User signed out!'));
                    }}
                >
                    <Text style={styles.btntextstyle}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ProfileScreen

const styles = StyleSheet.create({
    btnstyle: {
        width: "80%", backgroundColor: "#FF4949", paddingVertical: 6, borderRadius: 20
    },
    btntextstyle: {
        textAlign: "center", fontSize: 20, color: 'white'
    }
})