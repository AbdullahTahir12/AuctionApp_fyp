import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={{ padding: 10 }}>
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
        <FlatList
          data={[
            { id: 1, name: "Ms" },
            { id: 2, name: "Ms" }
          ]}

          renderItem={({ item, index }) => {
            return (
              <View>
                <TouchableOpacity>
                  <Text>{item.name}</Text>
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