import React, {useState, useRef, useEffect, useSyncExternalStore} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  Linking,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import NetInfo from '@react-native-community/netinfo';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import {useRoute} from '@react-navigation/native';
import {useAppContext} from './AppContext';
import * as Animatable from 'react-native-animatable';
import FlashMessage, {showMessage} from 'react-native-flash-message';

const UserAccount = ({navigation,route}) => {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [countryCode, setCountryCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const phoneInput = useRef(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleOnCountryChange = country => {
    setCountry(country);
  };

  function EmptyInput() {
    showMessage({
      message: '⚪️ Please Fill All Inputs',
      // backgroundColor:'#36454F',
      type: 'danger',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
      // duration: 5000,
    });
  }
  function Internet() {
    showMessage({
      message: '⚪️ No Internet Connection',
      // backgroundColor:'#36454F',
      type: 'warning',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
      // duration: 5000,
    });
  }

  function Search() {
    if (formattedValue.trim() === '') {
      EmptyInput();
    } else if (isConnected == false) {
      Internet();
    } else
    navigation.replace('UserData', {phoneNo: formattedValue})
  }

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        <>
          <FlashMessage position={'center'} />
        </>
        <Animatable.View
          animation={'zoomIn'}
          delay={1000}
          duration={2000}
          style={styles.main}>
          <Text style={styles.Enter}>Enter Phone No. To See Your Requests</Text>
          <View>
            <PhoneInput
              textInputProps={{
                placeholderTextColor: 'grey',
              }}
              containerStyle={{
                width: responsiveWidth(90),
                height: responsiveHeight(6),
                marginTop: responsiveHeight(3),
                borderColor: '#36454F',
                borderWidth: 1.5,
                backgroundColor: '#FBFCF8',
              }}
              flagButtonStyle={{
                backgroundColor: '#FBFCF8',
              }}
              textInputStyle={{
                height: responsiveHeight(6),
                width: responsiveWidth(70),
                color: '#36454F',
                marginTop: responsiveHeight(0.2),
                fontSize: responsiveFontSize(2),
                textAlignVertical: 'center',
              }}
              codeTextStyle={{
                color: '#36454F',
                fontSize: responsiveFontSize(2),
                height: responsiveHeight(7),
                fontWeight: 'normal',
                textAlignVertical: 'center',
              }}
              onChangeCountry={handleOnCountryChange}
              ref={phoneInput}
              defaultValue={value}
              defaultCode="PK"
              layout="first"
              onChangeText={text => {
                setValue(text);
              }}
              onChangeFormattedText={text => {
                setFormattedValue(text);
                setCountryCode(phoneInput.current?.getCountryCode() || '');
              }}
              countryPickerProps={{withAlphaFilter: true}}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={Search}>
            <Text allowFontScaling={false} style={styles.buttontext}>
              SEARCH
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </ImageBackground>
    </View>
  );
};

export default UserAccount;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  main: {
    backgroundColor: '#2e4c60',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    paddingTop: responsiveHeight(4),
    paddingBottom: responsiveHeight(3),
    // borderColor: '#‌fff',
    borderRadius: 12,
    // justifyContent: 'space-evenly',
  },
  Enter: {
    fontSize: responsiveFontSize(2.5),
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'good',
    paddingHorizontal: responsiveScreenWidth(2),
    // paddingVertical: responsiveHeight(2),
    width: responsiveWidth(95),
    // height: responsiveHeight(6),
    // textTransform: 'uppercase',
    // backgroundColor:'lightblue',
    letterSpacing: 1,
    lineHeight: 25,
    marginTop: responsiveHeight(-1),
  },
  button: {
    backgroundColor: '#fff',
    color: 'white',
    padding: 6,
    marginTop: responsiveHeight(3),
    // marginBottom: responsiveHeight(),
    borderRadius: 8,
    width: responsiveWidth(30),
  },
  buttontext: {
    color: '#2e4c60',
    fontWeight: '600',
    letterSpacing: 0.7,
    textAlign: 'center',
    fontSize: responsiveFontSize(2.25),
  },
});
