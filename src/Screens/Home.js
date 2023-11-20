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
  const Youtube = () => {
    Linking.openURL('https://www.youtube.com/@azhar-ul-islam');
  };

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        <Animatable.View
          duration={2000}
          delay={250}
          animation="fadeInUp"
          style={styles.topHeadingView}>
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
        </Animatable.View>
        <Animatable.View  animation="fadeInUp" duration={2000} delay={400}>
          <TouchableOpacity style={styles.button} onPress={Youtube}>
            <Text style={styles.buttonText}>DARS-e-NIZAMI HELP DESK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>SHORT COURSES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>ONLINE TUTION</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>HOME TUTION</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>DARS-e-NIZAMI COURSE</Text>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View  animation="fadeInUp" duration={2000} delay={600} style={styles.bottom}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>ABOUT US</Text>
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
    justifyContent: 'space-evenly',
  },
  div: {
    // display:'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  bottom: {
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'flex-end',
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
    marginTop: responsiveHeight(5),
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
    height: responsiveHeight(5.75),
    width: responsiveWidth(90),
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  buttonText: {
    fontFamily: 'good',
    color: '#fff',
    // fontWeight: '600',
    // letterSpacing: 0.7,
    textAlign: 'center',
    fontSize: responsiveFontSize(2.15),
    alignContent: 'center',
    letterSpacing: 0.25,
  },
});
