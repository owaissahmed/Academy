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
  Linking,
} from 'react-native';
import {React, useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';

const About = ({navgation}) => {
  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        <View style={styles.submain}>
          <Animatable.View
            duration={2000}
            delay={100}
            animation="fadeInUp"
            style={styles.rectangle}>
            <Text allowFontScaling={false} style={styles.rectangletext}>
              ازھارالاسلام اکیڈمی
            </Text>
            <Text allowFontScaling={false} style={styles.rectangletext_}>
              آن لائن دینی تعلیم کا مستند ادارہ
            </Text>
          </Animatable.View>
        </View>
        <Animatable.View
          duration={2000}
          delay={100}
          animation="fadeInUp"
          style={styles.squarediv}>
          <TouchableOpacity>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.squaretext__}>
                DARS-e-NIZAMI HELP DESK
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.squaretext}>
                SHORT COURSES
              </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      </ImageBackground>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  squarediv: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: responsiveWidth(95),
    marginTop: responsiveHeight(-6),
  },
  rectangletext: {
    fontFamily: 'mushaf',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(8.5),
    textAlign: 'center',
  },
  rectangletext_: {
    fontFamily: 'mushaf',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(4.5),
    textAlign: 'center',
    marginTop: responsiveHeight(-3),
  },
  squaretext: {
    fontSize: responsiveScreenFontSize(2.35),
    color: '#2e4c60',
    textAlign: 'center',
    fontFamily: 'good',
    marginTop: responsiveHeight(1),
  },
  squaretext__: {
    fontSize: responsiveScreenFontSize(2),
    color: '#2e4c60',
    textAlign: 'center',
    fontFamily: 'good',
    marginTop: responsiveHeight(1),
    lineHeight: 20,
  },
  square: {
    marginTop: responsiveHeight(3),
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    height: responsiveHeight(19),
    width: responsiveWidth(39),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: responsiveWidth(3),
  },
});
