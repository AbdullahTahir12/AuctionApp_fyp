import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Button, Modal } from 'react-native'
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { Formik } from 'formik'
import * as yup from 'yup'
import { Picker } from '@react-native-picker/picker';

const image1 = "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?cs=srgb&dl=pexels-pixabay-531880.jpg&fm=jpg"

const AdminAddItem = ({ navigation, route }) => {
    const [productimage, setproductimage] = useState(null);
    const [changeimage, setchangeimage] = useState('');
    const [type, settype] = useState('add');
    const [selectedStartDate, setselectedStartDate] = useState(null);
    const [selectedEndDate, setselectedEndDate] = useState(null);
    const minDate = new Date(2006, 6, 3);
    const maxDate = new Date(2028, 6, 3);
    const [second_model, setsecond_model] = useState(false)
    const [data, setdata] = useState([])

    function onDateChange(date, type) {
        if (type === 'END_DATE') {
            setselectedEndDate(date)
        } else {
            setselectedEndDate(null)
            setselectedStartDate(date)
        }
    }

    // console.warn(route.params)
    useEffect(() => {
        // console.warn(route.params.type)
        if (route.params) {
            settype(route.params.type)
            setselectedStartDate(route.params.data.selectedStartDate)
            setselectedEndDate(route.params.data.selectedEndDate)
            setproductimage(route.params.data.productimage)
        } else {
            settype('add')
        }
    }, [])

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Formik
                // enableReinitialize={true}
                initialValues={{
                    title: route.params && type == "add" ? route.params.data.title : '',
                    description: route.params ? route.params.data.description : '',
                    price: route.params ? route.params.data.price : '',
                    category_type: route.params ? route.params.data.category_type : ''
                }}
                onSubmit={async (values) => {
                    if (productimage == null) {
                        alert("Select a photo")
                    } else {
                        if (changeimage == 'changed' && type == 'add') {
                            try {
                                const uploadUri = productimage;
                                let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
                                const storageRef = storage().ref(`Item_Images/${filename}`);
                                const task = storageRef.putFile(uploadUri);
                                await task;
                                const url = await storageRef.getDownloadURL();
                                firestore()
                                    .collection('Item_Data')
                                    .doc(route.params.key)
                                    .update({
                                        title: values.title,
                                        description: values.description,
                                        price: values.price,
                                        selectedStartDate: moment(selectedStartDate).format('YYYY-MM-DD, 00:00:00'),
                                        selectedEndDate: moment(selectedEndDate).format('YYYY-MM-DD, 23:59:59'),
                                        productimage: url,
                                        status: 'no',
                                        category_type: values.category_type,
                                        user_add_category: "Admin",
                                        winning_person_key: ''
                                    })
                                    .then(() => {
                                        console.log('User updated!');
                                    });

                            } catch (error) {
                                console.log('Error creating user: ', error);
                                return null;
                            }
                        } else {
                            try {
                                firestore()
                                    .collection('Item_Data')
                                    .doc(route.params.key)
                                    .update({
                                        title: values.title,
                                        description: values.description,
                                        price: values.price,
                                        selectedStartDate: selectedStartDate,
                                        selectedEndDate: selectedEndDate,
                                        productimage: url,
                                        status: 'no',
                                        category_type: values.category_type,
                                        user_add_category: "Admin",
                                        winning_person_key: ''
                                    })
                                    .then(() => {
                                        console.log('User updated!');
                                    });

                            } catch (error) {
                                console.log('Error creating user: ', error);
                                return null;
                            }
                        }
                    }
                }
                }
                validationSchema={yup.object().shape({
                    title: yup
                        .string()
                        .min(3, 'Too Short!')
                        .max(50, 'Too Long!')
                        .matches(/^[a-zA-Z0-9" "!@#$%^&*]+$/)
                        .required('title is required.'),
                    description: yup
                        .string()
                        .min(25, 'Too Short!')
                        .max(46, 'Too Long!')
                        .matches(/^[a-zA-Z0-9" "!@#$%^&*]+$/)
                        .required('Description is required.'),
                    price: yup.string()
                        .required('Price is required'),
                    category_type: yup.string().required('Please select a category'),
                })}
            >
                {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, isSubmitting, }) => (
                    <ScrollView style={styles.container1}>
                        {
                            productimage == null ?
                                <View style={{ alignItems: "center" }}>
                                    <Image
                                        source={{ uri: image1 }}
                                        style={styles.image}
                                    />
                                </View>
                                :
                                <View style={{ alignItems: "center" }}>
                                    <Image
                                        source={{ uri: productimage }}
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
                                setproductimage(image.path);
                                setchangeimage('changed')
                            }).catch((err) => {
                                console.log(err)
                            })
                        }} style={[styles.btn, { width: "45%" }]}>
                            <Text style={[styles.btntext, { fontSize: 16 }]}>Select Image</Text>
                        </TouchableOpacity>
                        <View style={[styles.sectionStyle, { marginTop: 20 }]}>
                            <TextInput
                                value={values.title}
                                style={{ flex: 1, textAlign: "center", fontFamily: 'OpenSans-MediumItalic', fontFamily: 'OpenSans-MediumItalic' }}
                                onChangeText={handleChange('title')}
                                placeholder="Enter Title"
                                onBlur={() => setFieldTouched('title')}
                                placeholderTextColor={'grey'}
                            />
                        </View>
                        {touched.title && errors.title &&
                            <Text style={{ fontSize: 12, color: '#FF0D10', marginLeft: "3%" }}>{errors.title}</Text>
                        }
                        <View style={styles.sectionStyle}>
                            <TextInput
                                value={values.description}
                                style={{ flex: 1, textAlign: "center", fontFamily: 'OpenSans-MediumItalic', fontFamily: 'OpenSans-MediumItalic' }}
                                onChangeText={handleChange('description')}
                                placeholder="Enter Description"
                                onBlur={() => setFieldTouched('description')}
                                placeholderTextColor={'grey'}
                            />
                        </View>
                        {touched.description && errors.description &&
                            <Text style={{ fontSize: 12, color: '#FF0D10', marginLeft: "3%" }}>{errors.description}</Text>
                        }
                        <View style={styles.sectionStyle}>
                            <TextInput
                                value={values.price}
                                style={{ flex: 1, textAlign: "center", fontFamily: 'OpenSans-MediumItalic', fontFamily: 'OpenSans-MediumItalic' }}
                                onChangeText={handleChange('price')}
                                placeholder="Enter Price"
                                onBlur={() => setFieldTouched('price')}
                                placeholderTextColor={'grey'}
                            />
                        </View>
                        {touched.price && errors.price &&
                            <Text style={{ fontSize: 12, color: '#FF0D10', marginLeft: "3%" }}>{errors.price}</Text>
                        }
                        <View style={styles.sectionStyle}>
                            <View style={styles.border}>
                                <Picker
                                    selectedValue={values.category_type}
                                    style={{ height: 45, width: "100%" }}
                                    onValueChange={handleChange('category_type')}
                                >
                                    <Picker.Item label="Select Category" value="" />
                                    <Picker.Item label="Electrical" value="Electrical" />
                                    <Picker.Item label="Clothes" value="Clothes" />
                                    <Picker.Item label="Sports" value="Sports" />
                                    <Picker.Item label="Art And Design" value="Art And Design" />
                                    <Picker.Item label="Others" value="Others" />
                                </Picker>
                                {touched.category_type && errors.category_type &&
                                    <Text style={{ fontSize: 11, color: 'red' }}>{errors.category_type}</Text>
                                }
                            </View>
                        </View>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => setsecond_model(false)}
                            visible={second_model}>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: "center",
                                backgroundColor: "#000000aa"
                            }}>
                                <View style={{ backgroundColor: "lightgrey", padding: "9%" }}>
                                    <CalendarPicker
                                        height={330}
                                        width={330}
                                        scaleFactor={375}
                                        startFromMonday={true}
                                        allowRangeSelection={true}
                                        minDate={minDate}
                                        maxDate={maxDate}
                                        todayBackgroundColor="lightblue"
                                        selectedDayColor="#7300e6"
                                        selectedDayTextColor="#FFFFFF"
                                        onDateChange={onDateChange}
                                        textStyle={{
                                            // fontFamily: 'Cochin',
                                            color: 'black',
                                        }}
                                    />
                                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
                                        <TouchableOpacity
                                            onPress={() => setsecond_model(false)}
                                            style={{
                                                backgroundColor: '#007066',
                                                paddingHorizontal: 55,
                                                paddingVertical: 10,
                                                borderRadius: 10
                                            }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 14,
                                                textAlign: "center"
                                            }}>Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => setsecond_model(false)}
                                            style={{
                                                backgroundColor: '#007066',
                                                paddingHorizontal: 55,
                                                paddingVertical: 10,
                                                borderRadius: 10
                                            }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 14,
                                                textAlign: "center"
                                            }}>Select</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity
                                style={[styles.btn, { marginTop: 10, width: '100%' }]}
                                onPress={() => setsecond_model(true)}
                            >
                                <Text style={styles.btntext}>Select Duration</Text>
                            </TouchableOpacity>
                        </View>
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
                                            <Text style={styles.btntext}>Add Item</Text>
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
        </ScrollView>
    );
};

export default AdminAddItem;

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
        // margin: 10,
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
