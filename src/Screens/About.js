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

const About = ({navigation}) => {

function Completed() {
  navigation.navigate('CompletedProject')
}

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
          <TouchableOpacity style={styles.button} onPress={Completed}>
              <Text allowFontScaling={false} style={styles.buttontext}>
              پایہ   تکمیل   تک   پہنچنے   والے   منصوبے
              </Text>
            </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
              <Text allowFontScaling={false} style={styles.buttontext}>
              مستقبل  قریب  کے  منصوبے
              </Text>
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
    justifyContent: 'center',
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
    marginBottom: responsiveHeight(2),
  },
  squarediv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(95),
    //   marginTop: responsiveHeight(-6),
  },

  button: {
    backgroundColor: '#2e4c60',
    color: 'white',
    // padding: 6,
    marginTop: responsiveHeight(3),
    // marginBottom: responsiveHeight(2),
paddingBottom:responsiveHeight(1),
    borderRadius: 8,
    width: responsiveWidth(80),
  },
  buttontext: {
    fontSize: responsiveScreenFontSize(4),
    color: '#fff',
    fontFamily: 'mushaf',
    fontWeight: '600',
    // letterSpacing: 0.7,
    textAlign: 'center',
    // fontSize: responsiveFontSize(2.25),
  },
});
