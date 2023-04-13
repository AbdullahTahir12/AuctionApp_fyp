import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const FavouriteScreen = ({navigation}) => {
  const [data, setData] = useState([]);
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


  useEffect(() => {
    if (!initializing && user && user.uid) {
      const subscriber = firestore()
        .collection('Item_Data')
        .where('uid', '==', user.uid)
        .where('status', '==', 'yes')
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
    }
  }, [initializing, user]);
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: "center", marginTop: "50%" }}>
            <Text style={{ color: 'red', fontSize: 18 }}>Nothing To Show</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const value = " "
          return (
            <View key={index} style={{ backgroundColor: "white", height: 76, marginTop: 20, width: "90%", alignSelf: "center", flexDirection: "row", borderRadius: 10, alignItems: "center" }}>
              <View style={{ marginLeft: 10 }}>
                <Image
                  source={{ uri: item.productimage }}
                  style={{
                    height: 40, width: 40, resizeMode: 'contain', borderRadius: 80
                  }}
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <TouchableOpacity onPress={() => {
                  navigation.navigate('ItemDetails', {
                    item: item,
                    uid: user == null ? 'user_not' : user.uid
                  })
                  // console.warn(user == null ? 'user_not' : user.uid)
                }}>
                  <Text>{item.title}</Text>
                  <Text>{item.description.length >= 30 ? item.description.substring(0, 30) + "..." : item.description}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }}
      />
    </View>
  )
}

export default FavouriteScreen

const styles = StyleSheet.create({})