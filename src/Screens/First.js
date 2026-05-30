import React, { useEffect } from 'react';
import {
  View,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
export default function First({ navigation }) {

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      setTimeout(() => {
        if (token) {
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      }, 3000);

    } catch (error) {
      navigation.replace('Login');
    }
  };

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}
      >
        <View style={styles.div}>
          <Animatable.Image
            animation="fadeInDown"
            duration={3000}
            delay={250}
            style={styles.calligraphy}
            source={require('../Images/calligraphy.png')}
          />

          <Animatable.Text
            animation="fadeInUp"
            duration={3000}
            delay={250}
            style={styles.Knowledge}
          >
            The Knowledge Is Light
          </Animatable.Text>

        </View>
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
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    height: responsiveHeight(50),
    width: responsiveWidth(90),
    alignItems: 'center',
    borderRadius: 12,
    marginTop: responsiveHeight(3),
  },
  div: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  calligraphy: {
    height: responsiveHeight(26),
    width: responsiveWidth(75),
  },
  Knowledge: {
    fontFamily: 'good',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(2.75),
    marginTop: responsiveHeight(1),
    letterSpacing: 0.25,
  },
});
