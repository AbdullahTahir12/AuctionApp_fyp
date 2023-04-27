import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const image1 = "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?cs=srgb&dl=pexels-pixabay-531880.jpg&fm=jpg"
const ProfileScreen = ({ navigation, route }) => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useFocusEffect(
        React.useCallback(() => {
            const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
            return subscriber;
        }, [])
    );

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
                        borderRadius: 10,
                        width: '80%'
                    }}>
                    <Text style={{
                        color: "white",
                        fontSize: 18,
                        textAlign: 'center'
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
                        marginTop: 10,
                        width: '80%'
                    }}>
                    <Text style={{
                        color: "white",
                        fontSize: 18,
                        textAlign: 'center'
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
                    source={{ uri: route.params == undefined ? user.photoURL : route.params.photoURL }}
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
                    }}>Welcome <Text style={{ color: 'red', fontSize: 15 }}>{route.params == undefined ? user.displayName : route.params.displayName}</Text></Text>
            </View>
            <View style={{ alignItems: "center", marginTop: 30 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => {
                    navigation.navigate('AddItem', {
                        user_name: user.displayName
                    })
                }} style={styles.btnstyle}>
                    <Text style={styles.btntextstyle}>Add Item</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                    onPress={() => {
                        navigation.navigate('ShowHistoryScreen')
                    }}
                    style={[styles.btnstyle, {
                        marginTop: 8
                    }]}>
                    <Text style={styles.btntextstyle}>Show History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={[styles.btnstyle, {
                        marginTop: 8
                    }]}
                    onPress={() => {
                        navigation.navigate('ShowProfileOption')
                    }}
                >
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