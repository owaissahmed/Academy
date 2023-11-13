import { StyleSheet, Text, View,Image,Dimensions } from 'react-native'
import React from 'react'
import { responsiveFontSize,responsiveHeight,responsiveScreenWidth } from 'react-native-responsive-dimensions'
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

export default function First() {
  return (
    <View>
     <Image style={styles.background} source={require('../Images/background.jpg')}/>
    </View>
  )
}

const styles = StyleSheet.create({
  background:{
    width: devicewidth,
    height: deviceheight,
  }
})