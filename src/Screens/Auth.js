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
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import {useRoute} from '@react-navigation/native';
import {useAppContext} from './AppContext';
import * as Animatable from 'react-native-animatable';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';
const Auth = ({navigation}) => {
  const [gmail, setgmail] = useState('');
  const [password, setpassword] = useState('');
  const [user, setUser] = useState(null);
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
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
    });

    // Unsubscribe on component unmount

    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe, subscriber();
    };
  }, []);

  const gmailChange = newgmail => {
    setgmail(newgmail);
  };
  const passwordChange = newpassword => {
    setpassword(newpassword);
  };

  function GoToSignup() {
    navigation.replace('Signup');
  }

  function GoToHome() {
    navigation.replace('Home');
  }

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
      // duration: 50000,
    });
  }
  function EmptyInput() {
    showMessage({
      message: '⚪️ Please Fill All Inputs',
      // backgroundColor:'#2e4c60',
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
      // backgroundColor:'#2e4c60',
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

  function login() {
    if (gmail.trim() === '' || password.trim() === '') {
      EmptyInput();
    } else if (isConnected == false) {
      Internet();
    } else {
      auth()
        .signInWithEmailAndPassword(gmail, password)
        .then(() => {
          showMessage({
            message: '⚪️ Successfully Sign In!',
            // backgroundColor: '#2e4c60',
            color: 'white',
            position: 'bottom',
            type: 'success',
            titleStyle: {
              fontSize: responsiveFontSize(2),
              lineHeight: responsiveHeight(3),
            },
            // duration: 5000,
          });
          setTimeout(() => {
            GoToHome();
          }, 2000);
          console.log('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }
          if (
            error.code === 'auth/invalid-email' ||
            'auth/invalid-credential'
          ) {
            showMessage({
              message: '⚪️ Invalid-Email / Password',
              // backgroundColor:'#2e4c60',
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
          console.log(error);
        });
    }
  }

  const Logout = async () => {
    if (isConnected == false) {
      Internet();
    } else {
      try {
        await auth().signOut();
        setgmail('');
        setpassword('');
        showMessage({
          message: '⚪️ Successfully LogOut!',
          // backgroundColor: '#2e4c60',
          color: 'white',
          position: 'bottom',
          type: 'success',
          titleStyle: {
            fontSize: responsiveFontSize(2),
            lineHeight: responsiveHeight(3),
          },
          // duration: 5000,
        });
        console.log('banda shaat');
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const isUserSignedIn = () => {
    return user !== null;
  };

  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
      
      <>
        <FlashMessage position={'center'} />
      </>
      <Animatable.View animation={'zoomIn'} delay={1000} duration={2000}>
        <SafeAreaView style={styles.submain}>
          <Image style={styles.logo} source={require('../Images/logo.png')} />
          {isUserSignedIn() ? (
            <View style={{alignItems: 'center'}}>
              <Text style={styles.Welcometext}>{user.email}</Text>
              <TouchableOpacity style={styles.Coursesbutton} >
                <Text allowFontScaling={false} style={styles.Coursesbuttontext}>
                  Your Courses
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={Logout}>
                <Text allowFontScaling={false} style={styles.buttontext}>
                  LOGOUT
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <TextInput
                value={gmail}
                onChangeText={gmailChange}
                allowFontScaling={false}
                style={styles.login}
                keyboardType="email-address"
                placeholder="Enter Your Gmail"
                placeholderTextColor={'grey'}
              />
              <TextInput
                onChangeText={passwordChange}
                value={password}
                allowFontScaling={false}
                style={styles.password}
                placeholder="Enter Your Password"
                placeholderTextColor={'grey'}
              />
              <TouchableOpacity style={styles.button} onPress={login}>
                <Text allowFontScaling={false} style={styles.buttontext}>
                  LOGIN
                </Text>
              </TouchableOpacity>
              <View>
                <Text
                  onPress={GoToSignup}
                  allowFontScaling={false}
                  style={styles.Createtext}>
                  Create Account Now!!
                </Text>
              </View>
            </View>
          )}
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
  Welcometext: {
    fontSize: responsiveFontSize(1.75),
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 1,
    marginTop: responsiveHeight(2),
    width:responsiveWidth(90),
    backgroundColor: '#2e4c60',
    paddingHorizontal: responsiveWidth(0.25),
    // marginHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
  },
  login: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    backgroundColor: '#FBFCF8',
    padding: 8,
    borderColor: '#2e4c60',
    borderRadius: 8,
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
    borderRadius: 8,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
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
  Coursesbutton: {
    backgroundColor: '#2e4c60',
    color: 'white',
    padding: 6,
    marginTop: responsiveHeight(2),
    // marginBottom: responsiveHeight(2),
    borderRadius: 8,
    width: responsiveWidth(50),
  },
  Coursesbuttontext: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.7,
    textAlign: 'center',
    fontSize: responsiveFontSize(2.25),
  },
  Createtext: {
    color: '#2e4c60',
    fontWeight: '600',
    letterSpacing: 0.7,
    textAlign: 'center',
    fontSize: responsiveFontSize(2.25),
    marginBottom: responsiveHeight(1),
  },
});

export default Auth;
