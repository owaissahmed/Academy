import {
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  Linking,
} from 'react-native';
import {React, useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import {useAppContext} from './AppContext';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
export default function Home({route}) {
  const [isConnected, setIsConnected] = useState(false);
  const {showAlert} = useAppContext();
  const navigation = useNavigation();
  const [isTeacherModalVisible, setTeacherModalVisible] = useState(false);
  const [isAdminModalVisible, setAdminModalVisible] = useState(false);
  const [name, setname] = useState();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const TeacherChange = newname => {
    setname(newname);
  };
  const AdminChange = newadmin => {
    setname(newadmin);
  };

  useEffect(() => {
    if (showAlert) {
      showAlert();
    }
  }, [showAlert]);

  function Internet() {
    Alert.alert('⚫ Warning', 'No Internet Connection!');
  }

  function Youtube() {
    if (isConnected == true) {
      Linking.openURL('https://www.youtube.com/@azhar-ul-islam');
    } else Internet();
  }

  function Courses() {
    if (isConnected == true) {
      navigation.navigate('Courses');
    } else Internet();
  }
  function UpcomingCourses() {
    if (isConnected == true) {
      navigation.navigate('UpcomingCourses');
    } else Internet();
  }
  function UserAccount() {
    navigation.navigate('UserAccount');
  }
  function Admin() {
    navigation.navigate('Admin');
  }

  const OnlineTuition = () => {
    if (isConnected == false) {
      Internet();
    } else navigation.navigate('OnlineTuition', {buttonText: 'Online Tuition'});
  };

  const HomeTuition = () => {
    if (isConnected == false) {
      Internet();
    } else
      navigation.navigate('HomeTuition', {TextHomeTuition: 'Home Tuition'});
  };

  const DarseNizamiForm = () => {
    if (isConnected == false) {
      Internet();
    } else
      navigation.navigate('DarseNizamiForm', {
        TextDarseNizami: 'Dars-e-Nizami',
      });
  };
  const About = () => {
    navigation.navigate('About');
  };
  const CheckPassword = () => {
    if (name === '1') {
      setTeacherModalVisible(!isTeacherModalVisible);
      setTimeout(() => {
        navigation.navigate('TeacherForm');
      }, 1000);
    } else {
      Alert.alert('⚫ Warning', 'Wrong Password!');
    }
  };

  const closeModal = () => {
    setTeacherModalVisible(!isTeacherModalVisible);
  };
  const openModal = () => {
    if (isConnected == false) {
      Internet();
    } else {
      setTeacherModalVisible(true);
    }
  };
  const CheckPasswordAdmin = () => {
    if (name === '2') {
      setAdminModalVisible(!isAdminModalVisible);
      setTimeout(() => {
        navigation.navigate('Admin');
      }, 1000);
    } else {
      Alert.alert('⚫ Warning', 'Wrong Password!');
    }
  };

  const closeModalAdmin = () => {
    setAdminModalVisible(!isAdminModalVisible);
  };
  const openModalAdmin = () => {
    if (isConnected == false) {
      Internet();
    } else {
      setAdminModalVisible(true);
    }
  };

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        <Animatable.View
          duration={2000}
          delay={100}
          animation="fadeInDown"
          style={styles.navbar}>
          <TouchableOpacity onPress={openModalAdmin}>
            <Image
              style={styles.logo}
              source={require('../Images/round.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={UserAccount}>
            <Image
              style={styles.account}
              source={require('../Images/account.png')}
            />
          </TouchableOpacity>
        </Animatable.View>
        <View style={styles.submain}>
          <Animatable.View
            duration={2000}
            delay={100}
            animation="fadeInUp"
            style={styles.rectangle}>
            <Text allowFontScaling={false} style={styles.rectangletext}>
              ازھارالاسلام اکیڈمی
            </Text>
            <Text allowFontScaling={false} style={styles.rectangletext_}>
              آن لائن دینی تعلیم کا مستند ادارہ
            </Text>
          </Animatable.View>
        </View>
        <Animatable.View
          duration={2000}
          delay={100}
          animation="fadeInUp"
          style={styles.squarediv}>
          <TouchableOpacity onPress={Youtube}>
            <View style={styles.square}>
              <Image
                style={styles.youtube}
                source={require('../Images/youtube.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext__}>
                DARS-e-NIZAMI HELP DESK
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={Courses}>
            <View style={styles.square}>
              <Image
                style={styles.books}
                source={require('../Images/books.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext}>
                SHORT COURSES
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={OnlineTuition}>
            <View style={styles.square}>
              <Image
                style={styles.online}
                source={require('../Images/online.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext}>
                ONLINE TUTION
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={HomeTuition}>
            <View style={styles.square}>
              <Image
                style={styles.home}
                source={require('../Images/home.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext}>
                HOME TUTION
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={DarseNizamiForm}>
            <View style={styles.square}>
              <Image
                style={styles.quran}
                source={require('../Images/quran.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext__}>
                DARS-e-NIZAMI COURSE
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={UpcomingCourses}>
            <View style={styles.square}>
              <Image
                style={styles.coming}
                source={require('../Images/coming.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext__}>
                UPCOMING COURSES
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={openModal}>
            <View style={styles.square}>
              <Image
                style={styles.teacher}
                source={require('../Images/teacher.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext}>
                FOR TEACHERS
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={About}>
            <View style={styles.square}>
              <Image
                style={styles.info}
                source={require('../Images/info.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext}>
                ABOUT US
              </Text>
            </View>
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
                <TextInput
                  allowFontScaling={false}
                  autoFocus
                  style={styles.login}
                  onChangeText={TeacherChange}
                  placeholder="Enter Password"
                  placeholderTextColor={'grey'}
                />
                <View style={styles.ModalButtonView}>
                  <TouchableOpacity style={styles.Btn} onPress={closeModal}>
                    <Text allowFontScaling={false} style={styles.BtnText}>
                      Close
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.Btn} onPress={CheckPassword}>
                    <Text allowFontScaling={false} style={styles.BtnText}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          </Modal>
          <Modal
            isVisible={isAdminModalVisible}
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
                <TextInput
                  allowFontScaling={false}
                  autoFocus
                  style={styles.login}
                  onChangeText={AdminChange}
                  placeholder="Enter Password"
                  placeholderTextColor={'grey'}
                />
                <View style={styles.ModalButtonView}>
                  <TouchableOpacity
                    style={styles.Btn}
                    onPress={closeModalAdmin}>
                    <Text allowFontScaling={false} style={styles.BtnText}>
                      Close
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.Btn}
                    onPress={CheckPasswordAdmin}>
                    <Text allowFontScaling={false} style={styles.BtnText}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          </Modal>
        </Animatable.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  navbar: {
    width: responsiveWidth(100),
    marginTop: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  account: {
    height: responsiveHeight(4.5),
    width: responsiveWidth(9),
  },
  logo: {
    height: responsiveHeight(4.5),
    width: responsiveWidth(9),
  },
  rectangle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(16),
    marginTop: responsiveHeight(-2),
  },
  squarediv: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: responsiveWidth(95),
  },
  rectangletext: {
    fontFamily: 'mushaf',
    height: responsiveHeight(12.5),
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(8.5),
    textAlign: 'center',
    marginBottom: responsiveHeight(-1),
  },
  rectangletext_: {
    fontFamily: 'mushaf',
    height: responsiveHeight(7),
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(4.5),
    textAlign: 'center',
    marginBottom: responsiveHeight(2),
  },
  squaretext: {
    fontSize: responsiveScreenFontSize(2),
    color: '#2e4c60',
    textAlign: 'center',
    fontFamily: 'good',
    marginTop: responsiveHeight(1),
  },
  squaretext__: {
    fontSize: responsiveScreenFontSize(2),
    color: '#2e4c60',
    textAlign: 'center',
    fontFamily: 'good',
    marginTop: responsiveHeight(0.5),
    lineHeight: 20,
  },
  square: {
    marginTop: responsiveHeight(1.5),
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    height: responsiveHeight(16),
    width: responsiveWidth(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: responsiveWidth(3),
    marginBottom: responsiveHeight(1),
  },
  info: {
    height: responsiveHeight(8),
    width: responsiveWidth(10),
    marginVertical: responsiveHeight(0.75),
  },
  quran: {
    height: responsiveHeight(8),
    width: responsiveWidth(24),
    marginTop: responsiveHeight(1),
  },
  coming: {
    height: responsiveHeight(9),
    width: responsiveWidth(30),
    // marginTop: responsiveHeight(0.75),
  },
  online: {
    height: responsiveHeight(9),
    width: responsiveWidth(24),
    marginBottom: responsiveHeight(0.5),
  },
  home: {
    height: responsiveHeight(9),
    width: responsiveWidth(35),
    marginTop: responsiveHeight(1),
  },
  books: {
    height: responsiveHeight(8),
    width: responsiveWidth(19),
    marginTop: responsiveHeight(1),
  },
  teacher: {
    height: responsiveHeight(9.5),
    width: responsiveWidth(26),
  },
  youtube: {
    height: responsiveHeight(9),
    width: responsiveWidth(20),
    marginTop: responsiveHeight(0.5),
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
  login: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    backgroundColor: '#FBFCF8',
    padding: 8,
    borderColor: '#36454F',
    color: '#36454F',
    borderWidth: 1.5,
    fontFamily: 'good',
    borderRadius: 6,
    letterSpacing: 1,
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(2),
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Btn: {
    backgroundColor: '#36454F',
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
