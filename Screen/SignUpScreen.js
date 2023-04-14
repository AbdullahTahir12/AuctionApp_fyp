import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Button } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
const { height, width } = Dimensions.get('screen')
const image1 = "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?cs=srgb&dl=pexels-pixabay-531880.jpg&fm=jpg"

const SignUpScreen = ({ navigation }) => {
  const [image, setimage] = useState(null)
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={async (values) => {
            if (image == null) {
              alert("Select a photo")
            } else {
              try {
                const uploadUri = image;
                let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
                const storageRef = storage().ref(`User_Image/${filename}`);
                const task = storageRef.putFile(uploadUri);
                await task;
                const url = await storageRef.getDownloadURL();
                const userCredential = await auth().createUserWithEmailAndPassword(values.email, values.password);

                await userCredential.user.updateProfile({
                  displayName: values.name,
                  photoURL: url
                });

                navigation.goBack();

              } catch (error) {
                console.log('Error creating user: ', error);
                return null;
              }
            }
          }
          }
          validationSchema={yup.object().shape({
            name: yup
              .string()
              .min(3, 'Too Short!')
              .max(50, 'Too Long!')
              .matches(/^[a-zA-Z0-9" "!@#$%^&*]+$/)
              .required('Name is required.'),
            email: yup
              .string()
              .email('Invalid email format')
              .required('Email is required'),
            password: yup.string()
              .min(6, 'Password must be at least 6 characters')
              .required('Password is required'),
            confirmPassword: yup.string()
              .oneOf([yup.ref('password')], 'Passwords do not match')
              .required('Confirm Password is required'),
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, isSubmitting, setFieldValue }) => (
            <ScrollView style={styles.container1}>
              <View style={{ alignItems: "center", height: 80, justifyContent: 'center' }}>
                <Text style={{ color: '#FF4949', fontSize: 25 }}>Create Account</Text>
              </View>
              {
                image == null ?
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={{ uri: image1 }}
                      style={styles.image}
                    />
                  </View>
                  :
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={{ uri: image }}
                      style={styles.image}
                    />
                  </View>
              }
              <TouchableOpacity onPress={() => {
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  cropping: true
                }).then(image => {
                  setimage(image.path);
                }).catch((err) => {
                  console.log(err)
                })
              }} style={[styles.btn, { width: "60%" }]}>
                <Text style={styles.btntext}>Select Image</Text>
              </TouchableOpacity>
              <View style={[styles.sectionStyle, { marginTop: 20 }]}>
                <TextInput
                  style={{ flex: 1, textAlign: "center", fontFamily: 'OpenSans-MediumItalic', fontFamily: 'OpenSans-MediumItalic' }}
                  onChangeText={handleChange('name')}
                  placeholder="Name"
                  onBlur={() => setFieldTouched('name')}
                  placeholderTextColor={'grey'}
                />
              </View>
              {touched.name && errors.name &&
                <Text style={{ fontSize: 12, color: '#FF0D10', marginLeft: "3%" }}>{errors.name}</Text>
              }
              <View style={styles.sectionStyle}>
                <TextInput
                  style={{ flex: 1, textAlign: "center", fontFamily: 'OpenSans-MediumItalic', fontFamily: 'OpenSans-MediumItalic' }}
                  onChangeText={handleChange('email')}
                  placeholder="Enter email address"
                  onBlur={() => setFieldTouched('email')}
                  placeholderTextColor={'grey'}
                />
              </View>
              {touched.email && errors.email &&
                <Text style={{ fontSize: 12, color: '#FF0D10', marginLeft: "3%" }}>{errors.email}</Text>
              }
              <View style={styles.sectionStyle}>
                <TextInput
                  style={{ flex: 1, textAlign: "center", fontFamily: 'OpenSans-MediumItalic', fontFamily: 'OpenSans-MediumItalic' }}
                  onChangeText={handleChange('password')}
                  placeholder="Enter Passowrd"
                  onBlur={() => setFieldTouched('password')}
                  placeholderTextColor={'grey'}
                />
              </View>
              {touched.password && errors.password &&
                <Text style={{ fontSize: 12, color: '#FF0D10', marginLeft: "3%" }}>{errors.password}</Text>
              }
              <View style={styles.sectionStyle}>
                <TextInput
                  style={{ flex: 1, textAlign: "center", fontFamily: 'OpenSans-MediumItalic', fontFamily: 'OpenSans-MediumItalic' }}
                  onChangeText={handleChange('confirmPassword')}
                  placeholder="Enter Passowrd Again"
                  onBlur={() => setFieldTouched('confirmPassword')}
                  placeholderTextColor={'grey'}
                />
              </View>
              {touched.confirmPassword && errors.confirmPassword &&
                <Text style={{ fontSize: 12, color: '#FF0D10', marginLeft: "3%" }}>{errors.confirmPassword}</Text>
              }
              <View>
                <View>
                  {
                    !isSubmitting &&
                    <View style={{ marginTop: 10 }}>
                      <TouchableOpacity
                        style={styles.btn}
                        disabled={!isValid}
                        onPress={handleSubmit}
                      >
                        <Text style={styles.btntext}>Sign Up</Text>
                      </TouchableOpacity>
                    </View>
                  }
                  {
                    isSubmitting &&
                    <TouchableOpacity disabled={true} >
                      <ActivityIndicator size="large" color={"#006F66"} />
                    </TouchableOpacity>
                  }
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={styles.btn1}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.btntext1}>Already Have Account? <Text style={{ color: '#FF4949' }}>Login Now</Text></Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </Formik>
      </View>
    </ScrollView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
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
    marginTop: 10,
    borderRadius: 10
  },
  btntext: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20
  },
  container1: {
    margin: 10,
    padding: 12,
  },
  sectionStyle: {
    borderWidth: 1,
    borderColor: '#000',
    height: 50,
    borderRadius: 5,
    margin: 6,
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