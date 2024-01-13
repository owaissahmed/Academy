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
import * as Animatable from 'react-native-animatable';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';
const UserSignup = ({navigation}) => {
  const [gmail, setgmail] = useState('');
  const [password, setpassword] = useState('');
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [visible, setVisible] = useState(true);
  const [loading, setloading] = useState(true);
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

    setloading(false);
    setVisible(false);

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

  function GoToAuth() {
    navigation.replace('Auth');
  }
  function GoToHome() {
    navigation.replace('Home');
  }

  function Empty() {
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
      Empty();
      console.log('That email EmptyInput is already in use!');
    } else if (isConnected == false) {
      Internet();
    } else {
      auth()
        .createUserWithEmailAndPassword(gmail, password)
        .then(() => {
          setloading(true);
          setVisible(true);
          showMessage({
            message: '⚪️ Successfully Account Create!',
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
            setloading(false);
            setVisible(false);
            GoToHome();
          }, 2000);
          console.log('User account created');
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

  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
      <>
        <FlashMessage position={'center'} />
      </>
      <Modal visible={visible} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            // width:devicewidth,
            // height:deviceheight,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'rgba(0, 0, 0, 0.100)',
          }}>
          {loading ? <ActivityIndicator size="larger" color="#2e4c60" /> : null}
        </View>
      </Modal>

      <Animatable.View animation={'zoomIn'} delay={1000} duration={2000}>
        <SafeAreaView style={styles.submain}>
          <Image style={styles.logo} source={require('../Images/logo.png')} />
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
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text
              onPress={GoToAuth}
              allowFontScaling={false}
              style={styles.Createtext}>
              Already Have An Account!!
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
    width: responsiveWidth(40),
  },
  buttontext: {
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

export default UserSignup;
