import {
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {React, useLayoutEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

import * as Animatable from 'react-native-animatable';

export default function First({navigation}) {
  useLayoutEffect(() => {
    gotoHome();
  }, []);
  function gotoHome() {
    setTimeout(() => {
      navigation.replace('Auth');
    }, 4000);
  }

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
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
            allowFontScaling={false}
            delay={250}
            style={styles.Knowledge}>
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
    borderColor: '#36454F',
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
