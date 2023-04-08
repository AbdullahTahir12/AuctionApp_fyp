import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
const { height, width } = Dimensions.get('screen')
const image = "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?cs=srgb&dl=pexels-pixabay-531880.jpg&fm=jpg"

const LoginScreen = ({ navigation }) => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const LoginPress = () => {
    if (email == '') {
      alert('Please enter your email address')
    } else if (password == '') {
      alert('Please enter your password')
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then((resp) => {
          navigation.goBack()
          // console.warn(resp.user.uid)
          // console.warn(resp)
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            alert('That email address is already in use!');
          }
          if (error.code === 'auth/invalid-email') {
            alert('That email address is invalid!');
          }
          alert(error);
        });
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      </View>
      <View style={{ alignItems: "center", height: 80, justifyContent: 'center' }}>
        <Text style={{ color: '#FF4949', fontSize: 25 }}>Welcome Back</Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <TextInput
          placeholder='Enter Email Address'
          onChangeText={(e) => setemail(e)}
          style={styles.textInput}
        />
      </View>
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <TextInput
          placeholder='Enter Password'
          onChangeText={(e) => setpassword(e)}
          style={styles.textInput}
        />
      </View>
      <View style={{ marginTop: 10, width: "80%", alignSelf: 'center' }}>
        <Text style={{ textAlign: "right", color: 'black' }}>Forgot Password ?</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => LoginPress()}
        >
          <Text style={styles.btntext}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          style={styles.btn1}
        >
          <Text style={styles.btntext1}>Don't Have Account? <Text style={{ color: '#FF4949' }}>Sign Up</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    flex: 1
  },
  image: {
    height: 140,
    width: 140,
    resizeMode: 'contain',
    borderRadius: 80
  },
  textInput: {
    borderWidth: 2,
    width: "80%",
    borderColor: 'grey'
  },
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
  btn1: {
    width: '80%',
    alignSelf: 'center',
  },
  btntext1: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16
  }
})