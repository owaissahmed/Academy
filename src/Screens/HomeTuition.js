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
  Image,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import PhoneInput from 'react-native-phone-number-input';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import {Picker} from '@react-native-picker/picker';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import {useAppContext} from './AppContext';
import * as Animatable from 'react-native-animatable';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {useRoute} from '@react-navigation/native';

const HomeTuition = ({navigation}) => {
  const [isTeacherModalVisible, setTeacherModalVisible] = useState(false);
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
  const [online, setonline] = useState([]);
  const [subject, setsubject] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [TeacherselectedValue, setTeacherSelectedValue] = useState('');
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

  const fetchData = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('teachers')
        .where('Subject', '==', subject)
        .where('Response', '!=' ,'')
        .get();

      const onlineData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setonline(onlineData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const CheckPassword = () => {
    fetchData();
    setTeacherModalVisible(!isTeacherModalVisible);
  };

  useEffect(() => {
    fetchData();
  }, [subject]);

  const openModal = () => {
    if (isConnected == false) {
      Internet();
    } else {
      setTeacherModalVisible(true);
    }
  };

  const route = useRoute();
  const buttonText = route.params?.TextHomeTuition || 'Home Tuition';
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

  function Subject() {
    showMessage({
      message: '⚪️ Please Select The Subject',

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
  function Teacher() {
    showMessage({
      message: '⚪️ Please Select The Teacher',

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
    // Replace with your actual or dummy WhatsApp phone number
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

    if (name.trim() === '' || father.trim() === '' || value === '') {
      EmptyInput();
      return;
    }

    if (subject === '') {
      Subject();
      return;
    }

    if (selectedValue === 'Select Teacher' || selectedValue === '') {
      Teacher();
      return;
    }

    if (!isConnected) {
      Internet();
      return;
    }

    setLoading(true);
    setVisible(true);
    show();
    const StudentSubject = subject;
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
        Category: 'Tuition',
        Status: '',
        Response: 'Pending',
        Teacher: selectedValue,
        Fees: '',
        FeesPaid: '',
        Subject: StudentSubject,
        Response:'Pending'
      });

      const recipient = 'izhar2526@gmail.com'; // Replace with the recipient's email address
      const subject = name;
      const body = `Home Tuition \n ${countryName} \n ${formattedValue}`;

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
          <Text allowFontScaling={false} style={styles.default}>
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
          <Text allowFontScaling={false} style={styles.default}>
            {country && country === 'Pakistan'
              ? 'Pakistan'
              : country
              ? country.name
              : ''}
          </Text>
          <TouchableOpacity style={styles.Subjectbutton} onPress={openModal}>
            <Text allowFontScaling={false} style={styles.Subjectbuttontext}>
              {subject === '' ? 'What do you want to Learn' : subject}
            </Text>
          </TouchableOpacity>
          <View style={styles.pickergroup}>
            <Picker
              style={styles.picker}
              dropdownIconColor={'#2e4c60'}
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }>
              <Picker.Item label="Select Teacher" value="Select Teacher" />
              {online.map((item, index) => (
                <Picker.Item key={index} label={item.Name} value={item.Name} />
              ))}
              {subject != '' ? (
                <Picker.Item label="Admin Choice" value="Admin Choice" />
              ) : null}
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={Check}>
            <Text allowFontScaling={false} style={styles.buttontext}>
              SAVE
            </Text>
          </TouchableOpacity>

          <Modal
            isVisible={isTeacherModalVisible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropTransitionInTiming={1000}
            backdropTransitionOutTiming={1000}>
            <View style={styles.modal}>
              <ImageBackground
                resizeMode="cover"
                style={styles.modalBackground}
                source={require('../Images/background.jpg')}>
                <Image
                  style={styles.modalImage}
                  source={require('../Images/logo.png')}
                />
                <View style={styles.pickergroup}>
                  <Picker
                    selectedValue={TeacherselectedValue}
                    dropdownIconColor={'#2e4c60'}
                    onValueChange={itemValue => setsubject(itemValue)}
                    style={styles.picker}>
                    <Picker.Item
                      label={
                        subject === '' ? 'What Do You Want To Learn' : subject
                      }
                      value="What Do You Want To Learn"
                    />
                    <Picker.Item label="نحو" value="نحو" />
                    <Picker.Item label="حدیث" value="حدیث" />
                    <Picker.Item label="صرف" value="صرف" />
                    <Picker.Item label="اصولِ فقہ" value="اصولِ فقہ" />
                    <Picker.Item label="فقہ" value="فقہ" />
                    <Picker.Item label="عقائد" value="عقائد" />
                    <Picker.Item label="بلاغت" value="بلاغت" />
                    <Picker.Item label="مناظرہ" value="مناظرہ" />
                    <Picker.Item label="تفسیر" value="تفسیر" />
                    <Picker.Item label="وراثت" value="وراثت" />
                    <Picker.Item label="منطق" value="منطق" />
                    <Picker.Item label="اصولِ حدیث" value="اصولِ حدیث" />
                    <Picker.Item label="اصولِ تفسیر" value="اصولِ تفسیر" />
                  </Picker>
                </View>
                <View style={styles.ModalButtonView}>
                  <TouchableOpacity style={styles.Btn} onPress={CheckPassword}>
                    <Text allowFontScaling={false} style={styles.BtnText}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          </Modal>
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
    height: responsiveHeight(13),
    width: responsiveWidth(33),
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
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    width: responsiveWidth(90),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  pickergroup: {
    alignItems: 'center',
    backgroundColor: '#FBFCF8',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(6),
    width: responsiveWidth(80),

    marginTop: responsiveHeight(3),
    borderColor: '#2e4c60',
    borderWidth: 1.5,
  },
  picker: {
    color: '#2e4c60',
    height: responsiveHeight(5.5),
    width: responsiveWidth(84),
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
  highlight: {
    fontWeight: '700',
  },
  Subjectbutton: {
    width: responsiveWidth(80),
    paddingVertical: 12,
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

export default HomeTuition;
