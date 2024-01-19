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
import firebase from '@react-native-firebase/app';
import NetInfo from '@react-native-community/netinfo';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import {useRoute} from '@react-navigation/native';
import {useAppContext} from './AppContext';
import * as Animatable from 'react-native-animatable';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';

const Form = ({navigation}) => {
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

  const countryName = country?.name || 'Pakistan';

  const route = useRoute();

  const buttonText = route.params?.TextHomeTuition || 'course';

  function show() {
    showMessage({
      message: '⚪️ Dont forget to send email after clicking on "SAVE" button',
      backgroundColor: '#2e4c60',
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
          
      type: 'danger',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
          
    });
  }
  function Error(app) {
    showMessage({
      message: `Error In Opening ${app}`,
          
      type: 'danger',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
          
    });
  }
  function Internet() {
    showMessage({
      message: '⚪️ No Internet Connection',
          
      type: 'warning',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
          
    });
  }

  const {setShowAlert} = useAppContext();

  const GoBackHome = () => {
    setShowAlert(() => {
      Alert.alert('⚫ Congrats', 'your Form has been Submitted!');
    });
  };

  function LogIn() {
    showMessage({
      message: '⚪️ You Need to Logged In First',
          
      type: 'danger',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
      duration: 2000,
    });
  }

  const openInstagram = () => {
    const username = 'allama_azhar_ali_madani'; // Replace with the actual Instagram username
    const url = `https://www.instagram.com/${username}`;

    Linking.openURL(url)
      .then(data => {
        console.log('Instagram Opened: ', data);
      })
      .catch(() => {
        Error('Instagram');
      });
  };

  const openFacebook = () => {
    if (isConnected) {
      const username = 'allamaazharalimadani'; // Replace with the actual Facebook page username
      const url = `https://www.facebook.com/${username}`;

      Linking.openURL(url)
        .then(data => {
          console.log('Facebook Opened: ', data);
        })
        .catch(() => {
          Error('Facebook');
        });
    } else Internet();
  };

  const openWhatsApp = () => {
    // Replace with your actual or dummy WhatsApp phone number
    const phoneNumber = '+923154411997';
    const url = `whatsapp://send?phone=${phoneNumber}`;

    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened: ', data);
      })
      .catch(() => {
        Error('Whatsapp');
      });
  };

  const openTelegram = () => {
    const username = 'Azharulislamacademy'; // Replace with the actual Telegram username
    const url = `https://t.me/${username}`;

    Linking.openURL(url)
      .then(data => {
        console.log('Telegram Opened: ', data);
      })
      .catch(() => {
        Error('Telegram');
      });
  };

  const Check = async () => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      LogIn();
      setTimeout(() => {
        navigation.replace('Auth');
      }, 2000);
      return;
    }

    if (name.trim() === '' || father.trim() === '' || value === '') {
      EmptyInput();
      return;
    }

    if (!isConnected) {
      Internet();
      return;
    }

    setLoading(true);
    setVisible(true);
    show();

    setTimeout(() => {
      const checkValid = phoneInput.current?.isValidNumber(value);
      setValid(checkValid ? checkValid : false);
      setCountryCode(phoneInput.current?.getCountryCode() || '');

      const collectionRef = firestore().collection('users').add({
        Gmail: currentUser.email,
        Name: name,
        Fathername: father,
        CourseName: buttonText,
        Phone: formattedValue,
        Country: countryName,
        CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        Category: 'Courses',
        Status: '',
        Response: 'Pending',
        Teacher: '',
        Fees: '',
        FeesPaid: '',
      });

      const recipient = 'izhar2526@gmail.com'; // Replace with the recipient's email address
      const subject = name;
      const body = `${buttonText} \n ${countryName} \n ${formattedValue}`;

      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;

      Linking.openURL(mailtoUrl).catch(err =>
        console.error('Error opening email app:', err),
      );

      navigation.replace('Home');

      setTimeout(() => {
        GoBackHome();
      }, 1000);
    }, 5000);
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
            backgroundColor: 'rgba(0, 0, 0, 0.100)',
          }}>
          {loading ? (
            <ActivityIndicator size="larger" color="black" />
          ) : (
            <Text allowFontScaling={false} style={{color: '#ffffff'}}>
              Loading...
            </Text>
          )}
        </View>
      </Modal>
      <>
        <FlashMessage position={'center'} />
      </>
      <Animatable.View animation={'zoomIn'} delay={1000} duration={2000}>
        <SafeAreaView style={styles.submain}>
          <Image style={styles.logo} source={require('../Images/logo.png')} />
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
          <Text allowFontScaling={false} style={styles.defaultCourse}>
            {buttonText}
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
                borderColor: '#2e4c60',
                borderWidth: 1.5,
                backgroundColor: '#FBFCF8',
              }}
              flagButtonStyle={{
                backgroundColor: '#FBFCF8',
              }}
              textInputStyle={{
                height: responsiveHeight(6),
                width: responsiveWidth(70),
                color: '#2e4c60',
                marginTop: responsiveHeight(0.2),
                fontSize: responsiveFontSize(2),
                textAlignVertical: 'center',
              }}
              codeTextStyle={{
                color: '#2e4c60',
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
          <Text allowFontScaling={false} style={styles.default}>
            {country && country === 'Pakistan'
              ? 'Pakistan'
              : country
              ? country.name
              : ''}
          </Text>
          <>
            <TouchableOpacity style={styles.button} onPress={Check}>
              <Text allowFontScaling={false} style={styles.buttontext}>
                SAVE
              </Text>
            </TouchableOpacity>
          </>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: responsiveWidth(55),
              justifyContent: 'space-evenly',
              marginBottom: responsiveHeight(1),
            }}>
            <TouchableOpacity onPress={openFacebook}>
              <Image
                style={{
                  width: responsiveWidth(7.25),
                  height: responsiveHeight(3.5),
                }}
                source={require('../Images/fb.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openInstagram}>
              <Image
                style={{
                  width: responsiveWidth(7.25),
                  height: responsiveHeight(3.5),
                }}
                source={require('../Images/instagram.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openWhatsApp}>
              <Image
                style={{
                  width: responsiveWidth(7.25),
                  height: responsiveHeight(3.5),
                }}
                source={require('../Images/whatsapp.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openTelegram}>
              <Image
                style={{
                  width: responsiveWidth(7.25),
                  height: responsiveHeight(3.5),
                }}
                source={require('../Images/telegram.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: responsiveHeight(1)}}>
            <Text style={{color: '#2e4c60', fontWeight: 'bold'}}>
              CONTACT US
            </Text>
          </View>
        </SafeAreaView>
      </Animatable.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
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
    borderColor: '#2e4c60',
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
    borderColor: '#2e4c60',
    color: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(2),
  },
  password: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    padding: 8,
    color: '#2e4c60',
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
  },
  default: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    padding: 8,
    color: '#2e4c60',
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
    textAlignVertical: 'center',
  },
  defaultCourse: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    paddingHorizontal: 6,
    paddingBottom: 4,
    color: '#2e4c60',
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2.8),
    textAlignVertical: 'center',
    fontFamily: 'mushaf',
  },
  button: {
    backgroundColor: '#2e4c60',
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
});

export default Form;
