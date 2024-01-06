// import React, {useState, useRef, useEffect} from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   Dimensions,
//   ImageBackground,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   Image,
//   Linking,
// } from 'react-native';
// import PhoneInput from 'react-native-phone-number-input';
// import firestore from '@react-native-firebase/firestore';
// import firebase from '@react-native-firebase/app';
// import NetInfo from '@react-native-community/netinfo';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// const devicewidth = Dimensions.get('window').width;
// const deviceheight = Dimensions.get('window').height;
// import {useRoute} from '@react-navigation/native';
// import {useAppContext} from './AppContext';
// import * as Animatable from 'react-native-animatable';
// import FlashMessage, {showMessage} from 'react-native-flash-message';

// const Form = ({navigation}) => {
//   const [gmail, setgmail] = useState('');
//   const [password, setpassword] = useState('');
//   const [course, setcourse] = useState('');
//   const [value, setValue] = useState('');
//   const [country, setCountry] = useState('Pakistan');
//   const [countryCode, setCountryCode] = useState('');
//   const [formattedValue, setFormattedValue] = useState('');
//   const [valid, setValid] = useState(false);
//   const [visible, setVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);
//   const phoneInput = useRef(null);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       // console.log('Connection type', state.type);
//       // console.log('Is connected?', state.isConnected);
//       setIsConnected(state.isConnected);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   const gmailChange = newgmail => {
//     setgmail(newgmail);
//   };
//   const passwordChange = newpassword => {
//     setpassword(newpassword);
//   };

//   function show() {
//     showMessage({
//       message: '⚪️ Dont forget to send email after clicking on "SAVE" button',
//       backgroundColor: '#36454F',
//       color: 'white',
//       position: 'bottom',
//       titleStyle: {
//         fontSize: responsiveFontSize(2),
//         lineHeight: responsiveHeight(3),
//       },
//       duration: 50000,
//     });
//   }
//   function EmptyInput() {
//     showMessage({
//       message: '⚪️ Please Fill All Inputs',
//       // backgroundColor:'#36454F',
//       type: 'danger',
//       color: 'white',
//       position: 'bottom',
//       titleStyle: {
//         fontSize: responsiveFontSize(2.25),
//         lineHeight: responsiveHeight(3),
//       },
//       // duration: 5000,
//     });
//   }
//   function Internet() {
//     showMessage({
//       message: '⚪️ No Internet Connection',
//       // backgroundColor:'#36454F',
//       type: 'warning',
//       color: 'white',
//       position: 'bottom',
//       titleStyle: {
//         fontSize: responsiveFontSize(2.25),
//         lineHeight: responsiveHeight(3),
//       },
//       // duration: 5000,
//     });
//   }

//   const {setShowAlert} = useAppContext();

//   const GoBackHome = () => {
//     // Set the showAlert function in the context
//     setShowAlert(() => {
//       // Show the alert when this function is called
//       Alert.alert('⚫ Congrats', 'your Form has been Submitted!');
//     });
//   };

//   const Check = async () => {
//     if (gmail.trim() === '' || password.trim() === '' || value === '') {
//       EmptyInput();
//     } else if (isConnected == false) {
//       Internet();
//     } else {
//       setLoading(true);
//       setVisible(true);
//       show();
//       setTimeout(() => {
//         const checkValid = phoneInput.current?.isValidNumber(value);
//         setValid(checkValid ? checkValid : false);
//         setCountryCode(phoneInput.current?.getCountryCode() || '');
//         const collectionRef = firestore().collection('users').add({
//           gmail: gmail,
//           passwordgmail: password,
//           Coursegmail: 'Dars-e-Nizami',
//           Phone: formattedValue,
//           Country: countrygmail,
//           CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
//           Category: 'Aalim Course',
//           Status: '',
//           Response: 'Pending',
//           Teacher: '',
//           Fees: '',
//           FeesPaid: '',
//         });

//         const recipient = 'izhar2526@gmail.com'; // Replace with the recipient's email address
//         const subject = gmail;
//         const body = `${buttonText} \n ${countrygmail} \n ${formattedValue}`;

//         const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
//           subject,
//         )}&body=${encodeURIComponent(body)}`;

//         Linking.openURL(mailtoUrl).catch(err =>
//           console.error('Error opening email app:', err),
//         );
//         navigation.replace('Home');
//         setTimeout(() => {
//           GoBackHome();
//         }, 1000);
//       }, 5000);
//     }
//   };

//   return (
//     <ImageBackground
//       resizeMode="cover"
//       style={styles.background}
//       source={require('../Images/background.jpg')}>
//       <Modal visible={visible} animationType="fade" transparent={true}>
//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: 'rgba(0, 0, 0, 0.100)',
//           }}>
//           {loading ? (
//             <ActivityIndicator size="larger" color="black" />
//           ) : (
//             <Text allowFontScaling={false} style={{color: '#ffffff'}}>
//               Loading...
//             </Text>
//           )}
//         </View>
//       </Modal>
//       <>
//         <FlashMessage position={'center'} />
//       </>
//       <Animatable.View animation={'zoomIn'} delay={1000} duration={2000}>
//         <SafeAreaView style={styles.submain}>
//           <Image style={styles.logo} source={require('../Images/logo.png')}/>
//           <TextInput
//             onChangeText={gmailChange}
//             allowFontScaling={false}
//             style={styles.login}
//             placeholder="Enter Your Gmail"
//             placeholderTextColor={'grey'}
//           />
//           <TextInput
//             onChangeText={passwordChange}
//             allowFontScaling={false}
//             style={styles.password}
//             placeholder="Enter Your Password"
//             placeholderTextColor={'grey'}
//           />
//           <TouchableOpacity style={styles.button} onPress={Check}>
//             <Text allowFontScaling={false} style={styles.buttontext}>
//               SAVE
//             </Text>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </Animatable.View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   logo: {
//     height: responsiveHeight(15),
//     width: responsiveWidth(40),
//     marginTop: responsiveHeight(2),
//   },
//   phoneinput: {
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//     backgroundColor: 'red',
//     height: 200,
//   },
//   redColor: {
//     backgroundColor: '#F57777',
//   },
//   message: {
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 20,
//     marginBottom: 20,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//   },
//   background: {
//     width: devicewidth,
//     height: deviceheight,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   submain: {
//     borderColor: '#36454F',
//     borderWidth: 1.5,
//     width: responsiveWidth(90),
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 12,
//     marginTop: responsiveHeight(3),
//   },
//   login: {
//     height: responsiveHeight(6),
//     width: responsiveWidth(80),
//     backgroundColor: '#FBFCF8',
//     padding: 8,
//     borderColor: '#36454F',
//     color: '#36454F',
//     borderWidth: 1.5,
//     marginTop: responsiveHeight(2),
//     fontSize: responsiveFontSize(2),
//   },
//   password: {
//     height: responsiveHeight(6),
//     width: responsiveWidth(80),
//     padding: 8,
//     color: '#36454F',
//     borderColor: '#36454F',
//     borderWidth: 1.5,
//     marginTop: responsiveHeight(3),
//     backgroundColor: '#FBFCF8',
//     fontSize: responsiveFontSize(2),
//   },
//   default: {
//     height: responsiveHeight(6),
//     width: responsiveWidth(80),
//     padding: 8,
//     color: '#36454F',
//     borderColor: '#36454F',
//     borderWidth: 1.5,
//     marginTop: responsiveHeight(3),
//     backgroundColor: '#FBFCF8',
//     fontSize: responsiveFontSize(2),
//     textAlignVertical: 'center',
//   },
//   defaultCourse: {
//     height: responsiveHeight(6),
//     width: responsiveWidth(80),
//     paddingHorizontal: 6,
//     paddingBottom: 4,
//     // paddingVertical:-10,
//     color: '#36454F',
//     borderColor: '#36454F',
//     borderWidth: 1.5,
//     marginTop: responsiveHeight(3),
//     backgroundColor: '#FBFCF8',
//     fontSize: responsiveFontSize(2.8),
//     textAlignVertical: 'center',
//     fontFamily: 'mushaf',
//     // backgroundColor:'red',
//     // textAlignVertical:'center'
//   },
//   button: {
//     backgroundColor: '#36454F',
//     color: 'white',
//     padding: 6,
//     marginTop: responsiveHeight(3),
//     marginBottom: responsiveHeight(2),
//     borderRadius: 8,
//     width: responsiveWidth(30),
//   },
//   buttontext: {
//     color: '#fff',
//     fontWeight: '600',
//     letterSpacing: 0.7,
//     textAlign: 'center',
//     fontSize: responsiveFontSize(2.25),
//   },
// });

// export default Form;

// auth()
//   .createUserWithEmailAndPassword(
//     'do@example.com',
//     'SuperSecretPassword!',
//   )
//   .then(() => {
//     console.log('User account created & signed in!');
//   })
//   .catch(error => {
//     if (error.code === 'auth/email-already-in-use') {
//       console.log('That email address is already in use!');
//     }

//     if (error.code === 'auth/invalid-email') {
//       console.log('That email address is invalid!');
//     }

//     console.log(error);
//   });

// //   const handleLogout = async () => {
// //     try {
// //       await auth().signOut();
// //       console.log('banda shaat');
// //     } catch (error) {
// //       console.log(error.message);
// //     }
// //   };

import React, {useState, useEffect} from 'react';
import {View, Text, TextInput,Button, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';

function Auth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
    });

    return () => subscriber(); // Unsubscribe on component unmount
  }, []);

  const isUserSignedIn = () => {
    return user !== null;
  };

  return (
    <View style={styles.container}>
      {isUserSignedIn() ? (
        <View>
          <TextInput
            // onChangeText={gmailChange}
            allowFontScaling={false}
            style={styles.login}
            placeholder="Enter Your Gmail"
            placeholderTextColor={'grey'}
          />
          <TextInput
            // onChangeText={passwordChange}
            allowFontScaling={false}
            style={styles.password}
            placeholder="Enter Your Password"
            placeholderTextColor={'grey'}
          />
        </View>
      ) : (
        <View>
          <TextInput
            // onChangeText={gmailChange}
            allowFontScaling={false}
            style={styles.login}
            placeholder="Enter Your hkjh"
            placeholderTextColor={'grey'}
          />
          <TextInput
            // onChangeText={passwordChange}
            allowFontScaling={false}
            style={styles.password}
            placeholder="Enter Your Pahkhssword"
            placeholderTextColor={'grey'}
          />
        </View>
      )}
      {user ? (
        <Button title="Logout" onPress={() => auth().signOut()} />
      ) : (
        <Button
          title="Login"
          onPress={() => {
            /* Implement your login logic here */
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Auth;
