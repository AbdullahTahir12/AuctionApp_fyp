import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('screen')

const SearchScreen = ({ navigation }) => {
  const [active, setActive] = useState(1)
  const [active_category_type, setActive_category_type] = useState('Electrical')
  const [data, setData] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, category_type: 'Electrical' },
    { id: 2, category_type: 'Clothes' },
    { id: 3, category_type: 'Sports' },
    { id: 4, category_type: 'Art And Design' },
    { id: 5, category_type: 'Technology' },
    { id: 6, category_type: 'Others' },
  ]

  useEffect(() => {
    const subscriber = firestore()
      .collection('Item_Data')
      .where('category_type', '==', active_category_type)
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
  }, [active_category_type]);


  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <TextInput
          placeholder='Find the best auctions'
          onChangeText={(e) => setSearchQuery(e)}
          style={{
            borderWidth: 1,
            width: '95%',
            borderRadius: 10,
            backgroundColor:'lightgrey'
          }}
          placeholderTextColor={'black'}
        />
      </View>
      <View>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <View style={{ width: 150, marginLeft: 15, marginTop: 10 }}>
                <TouchableOpacity onPress={() => {
                  if (item.id == 1) {
                    setActive(1)
                    setActive_category_type('Electrical')
                  }
                  else if (item.id == 2) {
                    setActive(2)
                    setActive_category_type('Clothes')
                  }
                  else if (item.id == 3) {
                    setActive(3)
                    setActive_category_type('Sports')
                  }
                  else if (item.id == 4) {
                    setActive(4)
                    setActive_category_type('Art And Design')
                  }
                  else if (item.id == 5) {
                    setActive(5)
                    setActive_category_type('Technology')
                  } else {
                    setActive(6)
                    setActive_category_type('Others')
                  }
                }} style={{ width: 150, backgroundColor: item.id == active ? '#FF4949' : 'grey', padding: 10, borderRadius: 20 }}>
                  <Text style={{ textAlign: 'center', color: item.id == active ? "white" : 'black', fontSize: 16 }}>{item.category_type}</Text>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </View>

      <View>
        <FlatList
          contentContainerStyle={{
            paddingBottom: 150
          }}
          data={data.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))}
          numColumns={2}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: "center", marginTop: "50%" }}>
              <Text style={{ color: 'red', fontSize: 18 }}>Nothing To Show</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={{ width: "49%", height: 308, marginTop: 10, alignItems: 'flex-start', padding: 15 }}>
                <TouchableOpacity activeOpacity={0.3}
                  onPress={() => {
                    navigation.navigate('ItemDetails', {
                      key: item.key,
                      selectedEndDate: item.selectedEndDate,
                      productimage: item.productimage,
                      user_add_category: item.user_add_category,
                      uid: user == null ? 'user_not' : user.uid
                    })
                  }}
                >
                  <Image
                    source={{ uri: item.productimage }}
                    style={{ width: width / 2.4, height: height / 4, resizeMode: 'cover' }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: 'black', marginTop: 5 }}>{item.title}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: 'black', marginTop: 5 }}>{item.selectedEndDate}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: 'black' }}>{item.price}</Text>
                    <TouchableOpacity onPress={() => {
                      navigation.navigate('ItemDetails', {
                        key: item.key,
                        selectedEndDate: item.selectedEndDate,
                        productimage: item.productimage,
                        user_add_category: item.user_add_category,
                        uid: user == null ? 'user_not' : user.uid
                      })
                    }} style={{ backgroundColor: '#FF4949', paddingHorizontal: 15, borderRadius: 10 }}>
                      <Text style={{ fontSize: 14, color: 'white' }}>Buy</Text>
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

export default SearchScreen

const styles = StyleSheet.create({})
