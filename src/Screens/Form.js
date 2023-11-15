import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {StyleProp, TextStyle} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';

const Form = () => {
  const [value, setValue] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const phoneInput = useRef(null); 
const Check = () => {
  if (value) {
    const checkValid = phoneInput.current?.isValidNumber(value);
    setValid(checkValid ? checkValid : false);
    setCountryCode(phoneInput.current?.getCountryCode() || '');
    console.log(formattedValue);
  } else Alert.alert('⚠️ WARNING', 'Please Fill All Inputs');
}
  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/3.jpg')}>
      <View>
        <SafeAreaView style={styles.submain}>
          <TextInput
            allowFontScaling={false}
            style={styles.login}
            placeholder="Enter Your User Text"
            placeholderTextColor={'grey'}
            autoFocus
          />
          <TextInput
            allowFontScaling={false}
            style={styles.password}
            placeholder="Enter Your Password"
            placeholderTextColor={'grey'}
          />
          <View>
            <PhoneInput
              textInputProps={{
                placeholderTextColor: 'grey',
              }}
              containerStyle={{
                width: responsiveWidth(80),
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
              ref={phoneInput}
              defaultValue={value}
              defaultCode="PK"
              layout="first"
              backgroundColor="red"
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
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={Check}>
              <Text allowFontScaling={false} style={styles.buttontext}>
                LOGIN
              </Text>
            </TouchableOpacity>
          </>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'silver',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    height: 50,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7CDB8A',
    // shadowColor: 'rgba(0,0,0,0.4)',
    // shadowOffset: {
    //   width: 1,
    //   height: 5,
    // },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  phoneinput: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'red',
    height: 200,
  },
  redColor: {
    backgroundColor: '#F57777',
  },
  message: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submain: {
    borderColor: '#36454F',
    borderWidth: 1.5,
    // height: responsiveHeight(38),
    width: responsiveWidth(90),
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#FBFCF8',
    padding: 8,
    borderColor: '#36454F',
    color: '#36454F',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    // borderRadius: 8,
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
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
  },
  button: {
    backgroundColor: '#36454F',
    color: 'white',
    padding: 6,
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(3),
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

export default Form;
