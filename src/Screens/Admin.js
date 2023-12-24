import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Admin = ({navigation}) => {
  return (
    <View>
      <Text onPress={()=>navigation.navigate('AddCourse')}>Admin</Text>
    </View>
  )
}

export default Admin

const styles = StyleSheet.create({})