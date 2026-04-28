import React, { useState, useRef, useEffect } from 'react';
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
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
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
import { useAppContext } from './AppContext';
import auth from '@react-native-firebase/auth';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useRoute } from '@react-navigation/native';
const DarseNizamiForm = ({ navigation }) => {
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [profile, setprofile] = useState('');
  const [uploadpic, setuploadpic] = useState(false);
  const [GenderselectedValue, setGenderSelectedValue] =
    useState('Select Gender');
  const [ClassselectedValue, setClassSelectedValue] = useState(
    'Select Class To Get Addmission',
  );
  const [age, setage] = useState('');

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
  const handleValueChange = value => {
    setGenderSelectedValue(value);
  };
  const handleClassChange = value => {
    setClassSelectedValue(value);
  };
  const AgeChange = newage => {
    setage(newage);
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
        setSelectedImage(response);
      }
    });
  };

  const route = useRoute();
  const buttonText = route.params?.TextDarseNizami || 'Dars-e-Nizami';
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
  function selectPic() {
    showMessage({
      message: '⚪️ Please Select The Picture',

      type: 'danger',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
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

  const { setShowAlert } = useAppContext();

  const GoBackHome = () => {
    setShowAlert(() => {
      Alert.alert('⚫ Congrats', 'your Form has been Submitted!');
    });
  };

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

  function Gender() {
    showMessage({
      message: '⚪️ Please Select Gender',

      type: 'danger',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
    });
  }
  function Class() {
    showMessage({
      message: '⚪️ Please Select Class',

      type: 'danger',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
    });
  }
  const openInstagram = () => {
    const username = 'allama_azhar_ali_madani'; // Replace with the actual Instagram username
    const url = `https://www.instagram.com/${username}`;

    Linking.openURL(url)
      .then(() => {
        Error('Instagram');
      })
      .catch(() => {
        console.log('Error opening Instagram');
      });
  };

  const openFacebook = () => {
    const username = 'allamaazharalimadani'; // Replace with the actual Facebook page username
    const url = `https://www.facebook.com/${username}`;

    Linking.openURL(url)
      .then(data => {
        console.log('Facebook Opened: ', data);
      })
      .catch(() => {
        Error('Facebook');
      });
  };

  const openWhatsApp = () => {
    const phoneNumber = '+923154411997';
    const url = `whatsapp://send?phone=${phoneNumber}`;

    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened: ', data);
      })
      .catch(() => {
        Error('WhatsApp');
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
    if (ClassselectedValue === 'Select Class To Get Addmission') {
      Class();
      return;
    }

    if (
      age === '' ||
      name.trim() === '' ||
      father.trim() === '' ||
      value === ''
    ) {
      EmptyInput();
      return;
    }
    if (GenderselectedValue === 'Select Gender') {
      Gender();
      return;
    }
    if (!selectedImage && ClassselectedValue != 'عامہ سالِ اول') {
      selectPic();
      return;
    }

    if (!isConnected) {
      Internet();
      return;
    }

    setLoading(true);
    setVisible(true);

    if (ClassselectedValue === 'عامہ سالِ اول') {
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
          Category: 'Aalim Course',
          Status: '',
          Response: 'Pending',
          Teacher: '',
          Fees: '',
          FeesPaid: '',
          Gender: GenderselectedValue,
          Age: age,
          Class: ClassselectedValue,
        });

        const recipient = 'izhar2526@gmail.com'; // Replace with the recipient's email address
        const subject = name;
        const body = `Dars e Nizami \n ${countryName} \n ${formattedValue}`;

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

          const collectionRef = firestore().collection('users').add({
            Gmail: currentUser.email,
            Name: name,
            Fathername: father,
            CourseName: buttonText,
            Phone: formattedValue,
            Country: countryName,
            CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            Category: 'Aalim Course',
            Status: '',
            Response: 'Pending',
            picture: profilepic,
            Teacher: '',
            Fees: '',
            FeesPaid: '',
            Gender: GenderselectedValue,
            Age: age,
            Class: ClassselectedValue,
          });

          const recipient = 'izhar2526@gmail.com'; // Replace with the recipient's email address
          const subject = name;
          const body = `Dars e Nizami \n ${countryName} \n ${formattedValue}`;

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
            <ActivityIndicator size="large" color="#2e4c60" />
          ) : (
            <Text allowFontScaling={false} style={{ color: '#ffffff' }}>
              Loading...
            </Text>
          )}
        </View>
      </Modal>
      <>
        <FlashMessage position={'center'} />
      </>
      <View>
        <SafeAreaView style={styles.submain}>
          <Image style={styles.logo} source={require('../Images/landscape-logo.png')} />
          <ScrollView style={{ height: responsiveHeight(75) }}>
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
              allowFontScaling={false}
              style={styles.password}
              placeholder="Enter Your Age"
              inputMode={'tel'}
              placeholderTextColor={'grey'}
              onChangeText={AgeChange}
            />
            <View style={styles.pickergroup}>
              <Picker
                style={styles.picker}
                selectedValue={GenderselectedValue}
                dropdownIconColor={'#2e4c60'}
                onValueChange={handleValueChange}>
                <Picker.Item label="Select Gender" value="Select Gender" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
            <Text allowFontScaling={false} style={styles.default}>
              {buttonText}
            </Text>
            <View style={styles.pickergroup}>
              <Picker
                style={styles.picker}
                selectedValue={ClassselectedValue}
                dropdownIconColor={'#2e4c60'}
                onValueChange={handleClassChange}>
                <Picker.Item
                  label="Select Class To Get Addmission"
                  value="Select Class To Get Addmission"
                />
                <Picker.Item label="عامہ سالِ اول" value="عامہ سالِ اول" />
                <Picker.Item label="عامہ سالِ دوم" value="عامہ سالِ دوم" />
                <Picker.Item label="خاصہ سالِ اول" value="خاصہ سالِ اول" />
                <Picker.Item label=" خاصہ سالِ دوم" value=" خاصہ سالِ دوم" />
                <Picker.Item label="عالیہ سالِ اول" value="عالیہ سالِ اول" />
                <Picker.Item label="عالیہ سالِ دوم" value="عالیہ سالِ دوم" />
                <Picker.Item label="عالمیہ سالِ اول" value="عالمیہ سالِ اول" />
                <Picker.Item label="عالمیہ سالِ دوم" value="عالمیہ سالِ دوم" />
              </Picker>
            </View>
            {ClassselectedValue ===
              'Select Class To Get Addmission' ? null : ClassselectedValue ===
                'عامہ سالِ اول' ? null : (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: responsiveWidth(80),
                  justifyContent: selectedImage ? 'space-between' : 'center',
                  marginTop: responsiveHeight(2),
                }}>
                <TouchableOpacity
                  onPress={selectImage}
                  style={styles.buttonPic}>
                  <Text allowFontScaling={false} style={styles.buttonPictext}>
                    Select Last Class MarkSheet
                  </Text>
                </TouchableOpacity>
                <View>
                  {selectedImage ? (
                    <Image
                      source={{ uri: selectedImage.assets[0].uri }}
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
            )}
            <View>
              <PhoneInput
                textInputProps={{
                  placeholderTextColor: 'grey',
                }}
                containerStyle={{
                  width: responsiveWidth(90),
                  height: responsiveHeight(5),
                  borderRadius: 6,
                  marginTop: responsiveHeight(3),
                  borderColor: '#2e4c60',
                  borderWidth: 1.5,
                  backgroundColor: '#FBFCF8',
                }}
                flagButtonStyle={{
                  backgroundColor: '#FBFCF8',
                }}
                textInputStyle={{
                  height: responsiveHeight(5),
                  borderRadius: 6,
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
                countryPickerProps={{ withAlphaFilter: true }}
              />
            </View>
            <Text allowFontScaling={false} style={styles.default}>
              {country && country === 'Pakistan'
                ? 'Pakistan'
                : country
                  ? country.name
                  : ''}
            </Text>
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={Check}>
            <Text allowFontScaling={false} style={styles.buttontext}>
              SAVE
            </Text>
          </TouchableOpacity>
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
          <View style={{ marginBottom: responsiveHeight(1) }}>
            <Text allowFontScaling={false} style={{ color: '#2e4c60', fontWeight: 'bold' }}>
              CONTACT US
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: responsiveHeight(8),
    width: responsiveWidth(90),
    marginTop: responsiveHeight(1),
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
    // borderColor: '#2e4c60',
    height: responsiveHeight(90),
    // borderWidth: 1.5,
    width: responsiveWidth(90),
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 12,

    // marginVertical: responsiveHeight(3),
  },
  pickergroup: {
    alignItems: 'center',
    backgroundColor: '#FBFCF8',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(5),
    borderRadius: 6,
    width: responsiveWidth(90),
    marginTop: responsiveHeight(3),
    borderColor: '#2e4c60',
    borderWidth: 1.5,
  },
  picker: {
    color: '#2e4c60',
    height: responsiveHeight(6.5),
    width: responsiveWidth(90),
  },
  Genderpicker: {
    backgroundColor: 'white',
    color: '#2e4c60',
    width: responsiveWidth(90),
    borderColor: '#2e4c60',
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
    borderWidth: 1.5,
    borderRadius: 10,
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(3),

  },
  login: {
    height: responsiveHeight(5),
    borderRadius: 6,
    backgroundColor: '#FBFCF8',
    padding: 8,
    borderColor: '#2e4c60',
    color: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(2),
    // marginBottom: responsiveHeight(2),
    fontSize: responsiveFontSize(2),
  },
  password: {
    height: responsiveHeight(5),
    borderRadius: 6,
    width: responsiveWidth(90),
    padding: 8,
    color: '#2e4c60',
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
  },
  default: {
    height: responsiveHeight(5),
    borderRadius: 6,
    width: responsiveWidth(90),
    padding: 8,
    color: '#2e4c60',
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
    textAlignVertical: 'center',
  },
  buttonNext: {
    // borderColor: '#2e4c60',
    // borderWidth: 1.5,
    // width: responsiveWidth(90),
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 12,
  },
  button: {
    backgroundColor: '#2e4c60',
    color: 'white',
    padding: 6,
    justifyContent: 'center',
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
  Subjectbutton: {
    height: responsiveHeight(5),
    borderRadius: 6,
    width: responsiveWidth(90),
    paddingVertical: 9,
    paddingHorizontal: 8,
    color: '#2e4c60',
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
  },
  Subjectbuttontext: {
    color: '#2e4c60',
    fontSize: responsiveFontSize(2),
  },
  highlight: {
    fontWeight: '700',
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  Btn: {
    backgroundColor: '#2e4c60',
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

export default DarseNizamiForm;
