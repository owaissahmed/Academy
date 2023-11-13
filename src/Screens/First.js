import {
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';

export default function First() {
  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/3.jpg')}>
        <Animatable.View
          animation={'zoomIn'}
          duration={2000}
          style={styles.submain}>
          <TextInput
            allowFontScaling={false}
            style={styles.login}
            placeholder="Enter Your User Text"
            placeholderTextColor={'grey'}
          />
          <TextInput
            allowFontScaling={false}
            style={styles.password}
            placeholder="Enter Your Password"
            placeholderTextColor={'grey'}
          />
          <TouchableOpacity style={styles.button}>
            <Text allowFontScaling={false} style={styles.buttontext}>
              LOGIN
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submain: {
    borderColor: '#36454F',
    borderWidth: 1.5,
    height: responsiveHeight(50),
    width: responsiveWidth(90),
    alignItems: 'center',
    borderRadius: 12,
    marginTop: responsiveHeight(3),
  },
  logo: {
    height: responsiveHeight(15),
    width: responsiveWidth(31),
    marginTop: responsiveHeight(3),
  },
  login: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    // backgroundColor: "gray",
    padding: 8,
    borderColor: '#36454F',
    color: '#36454F',
    borderWidth: 1.5,
    marginTop: responsiveHeight(5),
    borderRadius: 8,
    fontSize: responsiveFontSize(2),
  },
  password: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    padding: 8,
    color: '#36454F',
    borderColor: '#36454F',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    borderRadius: 8,
    fontSize: responsiveFontSize(2),
  },
  button: {
    backgroundColor: '#36454F',
    color: 'white',
    padding: 6,
    marginTop: responsiveHeight(3.5),
    borderRadius: 8,
    width: responsiveWidth(30),
  },
  buttontext: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.7,
    textAlign: 'center',
    fontSize: responsiveFontSize(2.25),
  },
});
