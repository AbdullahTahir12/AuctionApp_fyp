import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth';

const ShowProfileOption = ({ navigation }) => {
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
    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.btnstyle, {
                    marginTop: 8
                }]}
                onPress={() => {
                    navigation.navigate('EditProfile')
                }}
            >
                <Text style={styles.btntextstyle}>Edit Personal Info</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.btnstyle, {
                    marginTop: 8
                }]}
                onPress={() => {
                    auth()
                        .sendPasswordResetEmail(user.email)
                        .then(() => {
                            alert("Password reset email sent successfully");
                        })
                        .catch((error) => {
                            alert(error.message);
                        });
                }}
            >
                <Text style={styles.btntextstyle}>Change Password</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ShowProfileOption

const styles = StyleSheet.create({
    btnstyle: {
        width: "80%", backgroundColor: "#FF4949", paddingVertical: 6, borderRadius: 20
    },
    btntextstyle: {
        textAlign: "center", fontSize: 20, color: 'white'
    }
})