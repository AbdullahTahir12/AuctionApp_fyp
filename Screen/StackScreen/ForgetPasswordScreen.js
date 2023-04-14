import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import auth from "@react-native-firebase/auth";

const ForgetPasswordScreen = () => {
    const [email, setemail] = useState('')
    const [btnstate, setbtnstate] = useState(false)
    const resetPassword = () => {
        if (email == '') {
            alert("Enter your email address")
        } else {
            setbtnstate(true)
            auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    alert("Password reset email sent successfully");
                    setbtnstate(false)
                    setemail('')
                })
                .catch((error) => {
                    alert(error.message);
                    setbtnstate(false)
                });
        }
    }
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, color: '#FF4949' }}>Forget Password</Text>
            <TextInput
                placeholder='Enter Your Email Address'
                style={{ borderWidth: 1, width: '85%', marginTop: 10 }}
                onChangeText={(e) => setemail(e)}
            />
            {
                btnstate ? <ActivityIndicator animating={btnstate} color={"#FF4949"} size={25} /> :
                    <TouchableOpacity onPress={() => resetPassword()} style={styles.btn}>
                        <Text style={styles.btntext}>Search</Text>
                    </TouchableOpacity>
            }

        </View>
    )
}

export default ForgetPasswordScreen

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#FF4949',
        padding: 10,
        width: '80%',
        alignSelf: 'center',
        marginTop: 10
    },
    btntext: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20
    },
})