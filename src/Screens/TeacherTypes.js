import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
import NetInfo from '@react-native-community/netinfo';
const TeacherTypes = ({navigation}) => {
  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
      <>
        <FlashMessage position={'center'} />
      </>

      <Animatable.View animation={'fadeInDown'} delay={1000} duration={2000}>
        <Image
          style={{
            width: responsiveWidth(40),
            height: responsiveHeight(15),
          }}
          source={require('../Images/logo.png')}
        />
      </Animatable.View>
      <Animatable.View animation={'fadeInUp'} delay={1000} duration={2000}>
        <TouchableOpacity onPress={()=> (navigation.navigate('TeachersData'))} style={styles.rectangle}>
          <View
            style={{
              width: responsiveWidth(90),
              height: responsiveHeight(10),
                // backgroundColor: 'green',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              //   marginLeft: responsiveWidth(10),
            }}>
            <Text allowFontScaling={false} style={styles.rectangletext}>
              Accepted Teachers
            </Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
      <Animatable.View animation={'fadeInUp'} delay={1000} duration={2000}>
        <TouchableOpacity onPress={()=> (navigation.navigate('PendingTeachers'))} style={styles.rectangle}>
          <View
            style={{
              width: responsiveWidth(90),
              height: responsiveHeight(10),
            //   backgroundColor: 'green',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}>
            <Text allowFontScaling={false} style={styles.rectangletext}>
              Pending Teachers
            </Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    </ImageBackground>
  );
};

export default TeacherTypes;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submain: {
    borderColor: '#2e4c60',
    // borderWidth: 1.5,
    width: responsiveWidth(90),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: responsiveHeight(3),
  },
  rectangle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(3),
    backgroundColor: '#2e4c60',
    height: responsiveHeight(15),
    marginVertical: responsiveHeight(1),
    width: responsiveWidth(95),
    alignItems: 'center',
    borderRadius: 12,
  },
  rectangletext: {
    fontSize: responsiveScreenFontSize(2.5),
    color: '#fff',
    lineHeight: 25,
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 30,
  },
});
