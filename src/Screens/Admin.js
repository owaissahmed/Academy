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
import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import {useAppContext} from './AppContext';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
const Admin = ({navigation}) => {

function gotoAddCourse(params) {
  navigation.navigate('AddCourse')
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
            style={styles.rectangle}>
            <Text allowFontScaling={false} style={styles.rectangletext}>
              ازھارالاسلام اکیڈمی
            </Text>
            <Text allowFontScaling={false} style={styles.rectangletext_}>
              آن لائن دینی تعلیم کا مستند ادارہ
            </Text>
          </Animatable.View>
        </View>
        <TouchableOpacity>
          <View style={styles.square}>
            <Text allowFontScaling={false} style={styles.squaretext}>
             STUDENTS DATA
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.square}>
            <Text allowFontScaling={false} style={styles.squaretext}>
             TEACHERS DATA
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={gotoAddCourse}>
          <View style={styles.square}>
            <Text allowFontScaling={false} style={styles.squaretext}>
            ADD NEW COURSE
            </Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default Admin;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  rectangle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(16),
    marginTop: responsiveHeight(-2),
  },

  rectangletext: {
    fontFamily: 'mushaf',
    height: responsiveHeight(12.5),
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(8.5),
    textAlign: 'center',
    marginBottom: responsiveHeight(-1),
  },
  rectangletext_: {
    fontFamily: 'mushaf',
    height: responsiveHeight(7),
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(4.5),
    textAlign: 'center',
    marginBottom: responsiveHeight(2),
  },
  squaretext: {
    fontSize: responsiveScreenFontSize(2.5),
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing:2
    // marginTop: responsiveHeight(1),
  },
  square: {
    marginTop: responsiveHeight(-6),
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    height: responsiveHeight(16),
    width: responsiveWidth(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor:'#2e4c60',
    marginHorizontal: responsiveWidth(3),
    // marginBottom: responsiveHeight(1),
  },
  info: {
    height: responsiveHeight(8),
    width: responsiveWidth(10),
    marginVertical: responsiveHeight(0.75),
  },
  quran: {
    height: responsiveHeight(8),
    width: responsiveWidth(24),
    marginTop: responsiveHeight(1),
  },
  coming: {
    height: responsiveHeight(9),
    width: responsiveWidth(30),
    // marginTop: responsiveHeight(0.75),
  },
  online: {
    height: responsiveHeight(9),
    width: responsiveWidth(24),
    marginBottom: responsiveHeight(0.5),
  },
  home: {
    height: responsiveHeight(9),
    width: responsiveWidth(35),
    marginTop: responsiveHeight(1),
  },
  books: {
    height: responsiveHeight(8),
    width: responsiveWidth(19),
    marginTop: responsiveHeight(1),
  },
  teacher: {
    height: responsiveHeight(9.5),
    width: responsiveWidth(26),
  },
  youtube: {
    height: responsiveHeight(9),
    width: responsiveWidth(20),
    marginTop: responsiveHeight(0.5),
  },

  modalBackground: {
    width: responsiveWidth(90),
    height: responsiveHeight(30),
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  login: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    backgroundColor: '#FBFCF8',
    padding: 8,
    borderColor: '#36454F',
    color: '#36454F',
    borderWidth: 1.5,
    fontFamily: 'good',
    borderRadius: 6,
    letterSpacing: 1,
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(2),
  },
  modalImage: {
    height: responsiveHeight(11),
    width: responsiveWidth(24),
    marginTop: responsiveHeight(1),
  },
  ModalButtonView: {
    marginTop: responsiveHeight(1),

    width: responsiveWidth(85),

    marginBottom: responsiveHeight(1),

    paddingHorizontal: responsiveWidth(4),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Btn: {
    backgroundColor: '#36454F',
    color: 'white',
    padding: 6,
    borderRadius: 8,
    width: responsiveWidth(30),
  },
  BtnText: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.7,
    textAlign: 'center',
    fontSize: responsiveFontSize(2.25),
  },
});
