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
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Animatable from 'react-native-animatable';
import FlashMessage, {showMessage} from 'react-native-flash-message';

const TeacherForm = ({navigation}) => {
  const [name, setname] = useState('');
  const [father, setfather] = useState('');
  const [Jamia, setJamia] = useState('');
  const [Experience, setExperience] = useState('');
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [profile, setprofile] = useState('');
  const [uploadpic, setuploadpic] = useState(false);
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

  const NameChange = newname => {
    setname(newname);
  };
  const FatherChange = newfather => {
    setfather(newfather);
  };
  const JamiaChange = newJamia => {
    setJamia(newJamia);
  };
  const ExperienceChange = newExperience => {
    setExperience(newExperience);
  };

  const handleOnCountryChange = country => {
    setCountry(country);
  };

  const selectImage = () => {
    const options = {
      title: 'Select an image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // set the selected image
        setSelectedImage(response);
        // console.log(response);
      }
    });
  };

  const countryName = country?.name || 'Pakistan';

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
  function selectPic() {
    showMessage({
      message: '⚪️ Please Select The Picture',
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

  const {setShowAlert} = useAppContext();

  const GoBackHome = () => {
    // Set the showAlert function in the context
    setShowAlert(() => {
      // Show the alert when this function is called
      Alert.alert('⚫ Congrats', 'your Form has been Submitted!');
    });
  };
  const UploadnewImage = async () => {
    console.log(selectedImage);
    if (isConnected == true) {
      if (selectedImage) {
        setuploadpic(true);
        const reference = storage().ref(selectedImage.assets[0].fileName);
        const pathToFile = selectedImage.assets[0].uri;
        await reference.putFile(pathToFile);
      }
      if (selectedImage) {
        const profilepic = await storage()
          .ref(selectedImage.assets[0].fileName)
          .getDownloadURL();
        setprofile(profilepic);
        console.log(profile);
      } else {
        selectPic();
      }
    } else {
      Internet();
    }
  };

  const uploadAndCheck = async () => {
    console.log(selectedImage);
    if (name.trim() === '' || father.trim() === '' || value === '') {
      EmptyInput();
    } else if (isConnected === false) {
      Internet();
    } else {
      setuploadpic(true);
      if (selectedImage) {
        const reference = storage().ref(selectedImage.assets[0].fileName);
        const pathToFile = selectedImage.assets[0].uri;
        await reference.putFile(pathToFile);

        const profilepic = await storage()
          .ref(selectedImage.assets[0].fileName)
          .getDownloadURL();
        setprofile(profilepic);
        console.log(profile);
      } else {
        selectPic();
      }

      setLoading(true);
      setVisible(true);
      show();

      setTimeout(() => {
        const checkValid = phoneInput.current?.isValidNumber(value);
        setValid(checkValid ? checkValid : false);
        setCountryCode(phoneInput.current?.getCountryCode() || '');

        const collectionRef = firestore().collection('teachers').add({
          Name: name,
          Fathername: father,
          picture: profile,
          Phone: formattedValue,
          Country: countryName,
          DayTime: firebase.firestore.FieldValue.serverTimestamp(),
        });

        const recipient = 'izhar2526@gmail.com'; // Replace with the recipient's email address
        const subject = name;
        const body = `Teacher \n ${Experience} \n ${Jamia} \n ${countryName} \n ${formattedValue}`;

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
    }
  };

 const Check = async () => {
  if (name.trim() === '' || father.trim() === '' || value === '') {
    EmptyInput();
  } else if (isConnected == false) {
    Internet();
  } else if (!selectedImage) {
    selectPic();
  } else {
    setLoading(true);
    setVisible(true);

    if (selectedImage) {
      setuploadpic(true);
      const reference = storage().ref(selectedImage.assets[0].fileName);
      const pathToFile = selectedImage.assets[0].uri;
      await reference.putFile(pathToFile);
    }

    if (selectedImage) {
      const profilepic = await storage()
        .ref(selectedImage.assets[0].fileName)
        .getDownloadURL();
      setprofile(profilepic);
      console.log(profile);

      if (profilepic) {
        show();
        setTimeout(() => {
          const checkValid = phoneInput.current?.isValidNumber(value);
          setValid(checkValid ? checkValid : false);
          setCountryCode(phoneInput.current?.getCountryCode() || '');
          const collectionRef = firestore().collection('teachers').add({
            Name: name,
            Fathername: father,
            picture: profilepic,
            Phone: formattedValue,
            Country: countryName,
            DayTime: firebase.firestore.FieldValue.serverTimestamp(),
          });

          const recipient = 'izhar2526@gmail.com';
          const subject = name;
          const body = `Teacher \n ${Experience} \n ${Jamia} \n ${countryName} \n ${formattedValue}`;

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
      } else {
        // Handle the case when there is no profile URL
        // For example, you can display an error message or take other actions
        console.log("Profile URL is empty");
      }
    }
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
            backgroundColor: 'rgba(0, 0, 0, 0.100)',
          }}>
          {loading ? (
            <ActivityIndicator size="larger" color="#2e4c60" />
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
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: responsiveWidth(80),
              justifyContent: 'space-between',
              marginTop: responsiveHeight(1),
            }}>
            <TouchableOpacity onPress={selectImage} style={styles.button}>
              <Text allowFontScaling={false} style={styles.buttontext}>
                Select Picture
              </Text>
            </TouchableOpacity>
            <View>
              {selectedImage ? (
                <Image
                  source={{uri: selectedImage.assets[0].uri}}
                  style={{
                    width: responsiveWidth(30),
                    marginVertical: responsiveHeight(1),
                    // height: 100,
                    height: responsiveHeight(15),
                  }}
                />
              ) : null}
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={{
                // backgroundColor:'lightblue',
                marginVertical: responsiveHeight(1),
              }}
              onPress={() => {
                Check();
              }}>
              <Image
                style={{
                  width: responsiveWidth(10),
                  height: responsiveHeight(4),
                }}
                source={require('../Images/arrow.png')}
              />
            </TouchableOpacity>
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
    // paddingVertical:-10,
    color: '#2e4c60',
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2.8),
    textAlignVertical: 'center',
    fontFamily: 'mushaf',
    // backgroundColor:'red',
    // textAlignVertical:'center'
  },
  button: {
    backgroundColor: '#2e4c60',
    color: 'white',
    padding: 6,
    marginVertical: responsiveHeight(2),
    // marginTop: responsiveHeight(2),
    // marginBottom: responsiveHeight(2),
    borderRadius: 8,
    width: responsiveWidth(38),
  },
  buttontext: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.7,
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
  },
});

export default TeacherForm;
