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

export default function Home() {
  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        <View style={styles.topHeadingView}>
          <Animatable.Text
            duration={2000}
            delay={250}
            style={styles.topHeading}>
            ازھارالاسلام اکیڈمی
          </Animatable.Text>
          <Animatable.Text
            duration={2000}
            delay={250}
            style={styles.subHeading}>
            آن لائن دینی تعلیم کا مستند ادارہ
          </Animatable.Text>
        </View>
        <View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>درس نظامی ہیلپ ڈیسک</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}> شارٹ کورسز </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>آن لائن ٹیوشن</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}> ہوم ٹیویشن</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>درس نظامی کورس</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>درس نظامی کورس</Text>
      </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  div: {
    // display:'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  topHeadingView: {
    // backgroundColor:'red'
  },
  topHeading: {
    fontFamily: 'mushaf',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(7.5),
    textAlign: 'center',
  },
  subHeading: {
    fontFamily: 'mushaf',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(4),
    textAlign: 'center',
    //  backgroundColor:'red',
    marginTop: responsiveHeight(-3),
  },
  button: {
    backgroundColor: '#2e4c60',
    // padding: 6,
    marginTop: responsiveHeight(1),
    borderRadius: 4,
    height: responsiveHeight(6),
    width: responsiveWidth(85),
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  buttonText: {
    // fontFamily: 'mushaf',
    color: '#fff',
    // fontWeight: '600',
    // letterSpacing: 0.7,
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    alignContent: 'center',
  },
});
