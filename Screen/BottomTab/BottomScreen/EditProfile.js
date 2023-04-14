import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
const { height, width } = Dimensions.get('screen')
const image1 = "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?cs=srgb&dl=pexels-pixabay-531880.jpg&fm=jpg"

const EditProfile = ({ navigation }) => {
    const [image, setimage] = useState(null)
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
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        name: user ? user.displayName : '',
                        email: user ? user.email : '',
                        password: '',
                        confirmPassword: '',
                    }}
                    onSubmit={async (values) => {

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
                                <Text style={{ color: '#FF4949', fontSize: 25 }}>Edit Profile</Text>
                            </View>
                            <View style={{ alignItems: "center" }}>
                                {user && user.photoURL ? (
                                    <Image
                                        source={{ uri: user.photoURL ? user.photoURL : image1 }}
                                        style={styles.image}
                                    />
                                ) : (
                                    <Image
                                        source={{ uri: image1 }}
                                        style={styles.image}
                                    />
                                )}
                            </View>
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
                                <Text style={styles.btntext}>Select Profile Image</Text>
                            </TouchableOpacity>
                            <View style={[styles.sectionStyle, { marginTop: 20 }]}>
                                <TextInput
                                    value={values.name}
                                    style={{ flex: 1, textAlign: "center", fontFamily: 'OpenSans-MediumItalic', fontFamily: 'OpenSans-MediumItalic' }}
                                    onChangeText={handleChange('name')}
                                    placeholder="Name"
                                    onBlur={() => setFieldTouched('name')}
                                />
                            </View>
                            {touched.name && errors.name &&
                                <Text style={{ fontSize: 12, color: '#FF0D10', marginLeft: "3%" }}>{errors.name}</Text>
                            }
                            <View style={styles.sectionStyle}>
                                <TextInput
                                    value={values.email}
                                    style={{ flex: 1, textAlign: "center", fontFamily: 'OpenSans-MediumItalic', fontFamily: 'OpenSans-MediumItalic' }}
                                    onChangeText={handleChange('email')}
                                    placeholder="Enter email address"
                                    onBlur={() => setFieldTouched('email')}
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
                        </ScrollView>
                    )}
                </Formik>
            </View>
        </ScrollView>
    )
}

export default EditProfile

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