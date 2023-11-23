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
  Linking,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import firestore from '@react-native-firebase/firestore';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
import FlashMessage, {showMessage} from 'react-native-flash-message';

const Form = () => {
  const [name, setname] = useState('');
  const [father, setfather] = useState('');
  const [value, setValue] = useState('');
  const [country, setcountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const phoneInput = useRef(null);

  const NameChange = newname => {
    setname(newname);
  };
  const FatherChange = newfather => {
    setfather(newfather);
  };
  const CountryChange = newcountry => {
    setcountry(newcountry);
  };

  const Check = () => {
    if (name.trim() === '') {
      Alert.alert('⚠️ WARNING', 'Please Enter Your Name');
    } else if (father.trim() === '') {
      Alert.alert('⚠️ WARNING', 'Please Enter Your Father Name');
    } else if (country === '') {
      Alert.alert('⚠️ WARNING', 'Please Enter Your Country');
    } else if (value === '') {
      Alert.alert('⚠️ WARNING', 'Please Enter Your Phone No.');
    } else {
      const checkValid = phoneInput.current?.isValidNumber(value);
      setValid(checkValid ? checkValid : false);
      setCountryCode(phoneInput.current?.getCountryCode() || '');
      const collectionRef = firestore().collection('users').add({
        Name: name,
        Fathername: father,
        Phone: formattedValue,
        Country: country,
      });
      const recipient = 'muhammadowais25122003@gmail.com'; // Replace with the recipient's email address
      const subject = father;
      const body = country;

      // Construct the mailto URL
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;

      // Open the default email app
      Linking.openURL(mailtoUrl).catch(err =>
        console.error('Error opening email app:', err),
      );

      Alert.alert('🎉 CONGTRATS', 'YOUR FORM HAS BEEN SUBMITTED');
    }
  };
  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
      <>
        <FlashMessage statusBarHeight={responsiveHeight(1)}/>
      </>
      <Animatable.View animation={'zoomIn'} delay={1000} duration={2000}>
        <SafeAreaView style={styles.submain}>
          <TextInput
            onChangeText={NameChange}
            allowFontScaling={false}
            style={styles.login}
            placeholder="Enter Your Name"
            placeholderTextColor={'grey'}
          />
          <TextInput
            onChangeText={FatherChange}
            allowFontScaling={false}
            style={styles.password}
            placeholder="Enter Your Father Name"
            placeholderTextColor={'grey'}
          />
          <TextInput
            onChangeText={CountryChange}
            allowFontScaling={false}
            style={styles.password}
            placeholder="Enter Your Country Name"
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
              onPress={() => showMessage({message: 'Hello World'})}>
              <Text allowFontScaling={false} style={styles.buttontext}>
                SAVE
              </Text>
            </TouchableOpacity>
          </>
        </SafeAreaView>
      </Animatable.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  highlight: {
    fontWeight: '700',
  },
});

export default Form;
