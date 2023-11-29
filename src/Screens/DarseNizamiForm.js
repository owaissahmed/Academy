import React, {useState, useRef, useEffect} from 'react';
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
import NetInfo from '@react-native-community/netinfo';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
// import { useAppContext } from './AppContext';
import { useAppContext } from './AppContext';
import * as Animatable from 'react-native-animatable';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import { useRoute } from '@react-navigation/native';
const DarseNizamiForm = ({navigation}) => {
  const [name, setname] = useState('');
  const [father, setfather] = useState('');
  const [course, setcourse] = useState('');
  const [value, setValue] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [countryCode, setCountryCode] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const phoneInput = useRef(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
    //   console.log('Connection type', state.type);
    //   console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const NameChange = newname => {
    setname(newname);
  };
  const FatherChange = newfather => {
    setfather(newfather);
  };
  const handleOnCountryChange = country => {
    setCountry(country);
  };

  const route = useRoute();
  const buttonText = route.params?.TextDarseNizami || 'Dars-e-Nizami';

  function show() {
    showMessage({
      message: '⚪️ Dont forget to send email after clicking on "SAVE" button',
      backgroundColor: '#36454F',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2),
        lineHeight: responsiveHeight(3),
      },
      duration: 50000,
    });
  }
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

  const { setShowAlert } = useAppContext();

  const GoBackHome = () => {
    // Set the showAlert function in the context
    setShowAlert(() => {
      // Show the alert when this function is called
      Alert.alert('⚫ Congrats', 'your Form has been Submitted!');
    });
  };

  const Check = async () => {
    if (
      name.trim() === '' ||
      father.trim() === '' ||
      value === ''
    ) {
     EmptyInput()
    } else if (isConnected == false){
      Internet()
    } else {
      setLoading(true);
      setVisible(true);
      show();
      setTimeout(() => {
        const checkValid = phoneInput.current?.isValidNumber(value);
        setValid(checkValid ? checkValid : false);
        setCountryCode(phoneInput.current?.getCountryCode() || '');
        const collectionRef = firestore().collection('users').add({
          Name: name,
          Fathername: father,
          Course: 'Dars-e-Nizami',
          Phone: formattedValue,
          Country: country.name,
        });
        const recipient = 'muhammadowais25122003@gmail.com'; // Replace with the recipient's email address
        const subject = name;
        const body = `Dars-e-Nizami \n ${country.name}\n ${formattedValue}`;

        // Construct the mailto URL
        
        const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;

        // Open the default email app
        Linking.openURL(mailtoUrl).catch(err =>
          console.error('Error opening email app:', err),
        );
        navigation.replace('Home');
        setTimeout(() => {
          GoBackHome ()
        }, 1000);
      }, 5000);
    }
  };
  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
      <Modal visible={visible} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // marginBottom:responsiveHeight(5),
            backgroundColor: 'rgba(0, 0, 0, 0.100)',
          }}>
          {loading ? (
            <ActivityIndicator size="larger" color="black" />
          ) : (
            <Text  allowFontScaling={false} style={{color: '#ffffff'}}>Loading...</Text>
          )}
        </View>
      </Modal>
      <>
        <FlashMessage position={'center'} />
      </>
      <Animatable.View animation={'zoomIn'} delay={1000} duration={2000}>
        <SafeAreaView style={styles.submain}>
        <Image style={styles.logo} source={require('../Images/logo.png')}/>
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
          <Text  allowFontScaling={false} style={styles.default}>{buttonText}</Text>
          <Text  allowFontScaling={false} style={styles.default}>
          {country && country === 'Pakistan'
            ? 'Pakistan'
            : country
            ? country.name
            : ''}
        </Text>
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
              onChangeCountry={handleOnCountryChange}
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
            <TouchableOpacity style={styles.button} onPress={Check}>
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
  logo:{
  height: responsiveHeight(15),
  width: responsiveWidth(40),
  marginTop: responsiveHeight(2),
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
  login: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    backgroundColor: '#FBFCF8',
    padding: 8,
    borderColor: '#36454F',
    color: '#36454F',
    borderWidth: 1.5,
    marginTop: responsiveHeight(2),
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
  default: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    padding: 8,
    color: '#36454F',
    borderColor: '#36454F',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
    textAlignVertical:"center"
  },
  button: {
    backgroundColor: '#36454F',
    color: 'white',
    padding: 6,
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
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

export default DarseNizamiForm;
