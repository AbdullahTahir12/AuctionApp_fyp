import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import moment, { now } from 'moment';
import auth from '@react-native-firebase/auth';
const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  useEffect(() => {
    const subscriber = firestore()
      .collection('Item_Data')
      .onSnapshot(querySnapshot => {
        const users = [];
        querySnapshot.forEach(documentSnapshot => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setData(users);
      });

    return () => subscriber();
  }, []);


  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);


  return (
    <View style={styles.container}>
      <View style={{ padding: 10, marginLeft: 10 }}>
        <FlatList
          data={data}
          ListHeaderComponent={
            <View style={{ marginRight: 20 }}>
              <Text style={styles.headertxt}>Auction App</Text>
              <View style={styles.banner}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.bannertxt1}>20%</Text>
                  <Text style={styles.bannertxt2}>OFF</Text>
                </View>
                <View>
                  <Text style={styles.bannertxt3}>Discounts on Auctions</Text>
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <TextInput
                  placeholder='Find Product'
                  style={styles.textInput}
                />
              </View>
            </View>
          }
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={{ width: "49%", height: 308, marginTop: 10, alignItems: 'flex-start' }}>
                <TouchableOpacity activeOpacity={0.3}
                  onPress={() => {
                    navigation.navigate('ItemDetails', {
                      item: item,
                      uid: user == null ? 'user_not' : user.uid
                    })
                    // console.warn(user == null ? 'user_not' : user.uid)
                  }}>
                  <Image
                    source={{ uri: item.productimage }}
                    style={{ width: 187, height: 220, resizeMode: 'cover' }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: 'black' }}>{item.title}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>{item.selectedEndDate}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: 'black' }}>$15</Text>
                    <TouchableOpacity onPress={() => {
                      navigation.navigate('ItemDetails', {
                        item: item,
                        uid: user == null ? 'user_not' : user.uid
                      })
                      // console.warn(user == null ? 'user_not' : user.uid)
                    }} style={{ backgroundColor: '#FF4949', paddingHorizontal: 10, borderRadius: 10 }}>
                      <Text style={{ fontSize: 20, color: 'white' }}>Buy</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  headertxt: {
    color: '#FF4949',
    fontSize: 20,
    fontWeight: '400'
  },
  banner: {
    height: 148,
    width: "100%",
    backgroundColor: "#FF4949",
    marginTop: 5,
    borderRadius: 5
  },
  bannertxt1: {
    marginTop: 25,
    marginLeft: 15,
    fontSize: 40,
    color: 'white',
    fontWeight: '600'
  },
  bannertxt2: {
    marginTop: 45,
    marginLeft: 5,
    fontSize: 20,
    color: 'white',
    fontWeight: '600'
  },
  bannertxt3: {
    marginLeft: 15,
    fontSize: 16,
    color: 'white',
    fontWeight: '600'
  },
  textInput: {
    borderWidth: 1
  }
})