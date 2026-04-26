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
  ActivityIndicator,
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
import auth from '@react-native-firebase/auth';
export default function Home({route}) {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setusername] = useState([]);
  const {showAlert} = useAppContext();
  const navigation = useNavigation();
  // const [isTeacherModalVisible, setTeacherModalVisible] = useState(false);
  const [isAdminModalVisible, setAdminModalVisible] = useState(false);
  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const [name, setname] = useState();
  const [visiblE, setVisiblE] = useState(true);
  const [loadinG, setloadinG] = useState(true);

  useEffect(() => {
  let subscriber;
  try {
    subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        const userEmail = user.email;
        const uname = userEmail.split(/\d|@/)[0];
        setusername(uname);
      } else {
        setusername('');
      }
    });
  } catch (error) {
    console.log('Firebase not ready:', error);
  }

  const unsubscribe = NetInfo.addEventListener(state => {
    setIsConnected(state.isConnected);
  });
  setloadinG(false);
  setVisiblE(false);

  return () => {
    if (subscriber) subscriber();
    unsubscribe();
  };
}, []);

  // const TeacherChange = newname => {
  //   setname(newname);
  // };
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
    if (isConnected == true) {
      navigation.navigate('UserAccount');
    } else Internet();
  }

  function Login() {
    navigation.navigate('Auth');
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
  const HelpDesk = () => {
    if (isConnected == false) {
      Internet();
    } else navigation.navigate('HelpDesk');
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
    navigation.navigate('CompletedProject');
  };

  const LogingOut = async () => {
    if (isConnected == false) {
      Internet();
    } else {
      try {
        setUserModalVisible(!isUserModalVisible);
        setloadinG(true);
        setVisiblE(true);
        setTimeout(async () => {
          await auth().signOut();
          navigation.replace('First');
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const closeAdminModal = () => {
    setUserModalVisible(!isUserModalVisible);
  };
  const openModal = () => {
    if (isConnected == false) {
      Internet();
    } else {
      navigation.navigate('TeacherForm');
    }
  };
  const UseropenModal = () => {
    if (isConnected == false) {
      Internet();
    } else {
      setUserModalVisible(true);
    }
  };
  const CheckPasswordAdmin = () => {
    if (name === 'Azhar8304') {
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
      <Modal visible={visiblE} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {loadinG ? <ActivityIndicator size="large" color="#2e4c60" /> : null}
        </View>
      </Modal>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        <View
          style={{
            // backgroundColor: 'red',
            alignItems: 'center',
            // alignSelf:'center',
            // alignContent:'space-evenly',
            width: devicewidth,
            height: deviceheight,
            justifyContent: 'space-evenly',
          }}>
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
            {username != '' ? (
              <TouchableOpacity onPress={UseropenModal}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: responsiveWidth(70),
                  }}>
                  <Text allowFontScaling={false} style={styles.Welcometext}>
                    {username != '' ? `Hi, ${username}` : null}
                  </Text>
                  <Image
                    style={styles.down}
                    source={require('../Images/down.png')}
                  />
                </View>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={Login}>
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
            <TouchableOpacity onPress={HelpDesk}>
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
                <Text allowFontScaling={false} style={styles.squaretext___}>
                  ONLINE TUITION
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={HomeTuition}>
              <View style={styles.square}>
                <Image
                  style={styles.home}
                  source={require('../Images/home.png')}
                />
                <Text allowFontScaling={false} style={styles.squaretext___}>
                  HOME TUITION
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
                  BECOME A TEACHER
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
                  ABOUT OUR ACADEMY
                </Text>
              </View>
            </TouchableOpacity>

            <Modal
              isVisible={isUserModalVisible}
              animationIn="zoomIn"
              animationOut="zoomOut"
              animationInTiming={1000}
              animationOutTiming={1000}
              backdropTransitionInTiming={1000}
              backdropTransitionOutTiming={1000}>
              <View style={styles.modal}>
                <ImageBackground
                  resizeMode="cover"
                  style={styles.logoutmodalBackground}
                  source={require('../Images/background.jpg')}>
                  <Image
                    style={styles.modalImage}
                    source={require('../Images/logo.png')}
                  />
                  <Text allowFontScaling={false} style={styles.LogOutText}>
                    Are You Sure To LogOut ?
                  </Text>
                  <TextInput />
                  <View style={styles.LogOutModalButtonView}>
                    <TouchableOpacity
                      style={styles.Btn}
                      onPress={closeAdminModal}>
                      <Text allowFontScaling={false} style={styles.BtnText}>
                        Close
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Btn} onPress={LogingOut}>
                      <Text allowFontScaling={false} style={styles.BtnText}>
                        LogOut
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
        </View>
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
    // backgroundColor:'red'
  },

  navbar: {
    width: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(4),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(-1),
    // backgroundColor:'red',
   paddingVertical:responsiveHeight(1)
  },

  account: {
    height: responsiveHeight(4.5),
    width: responsiveWidth(9.25),
  },
  logo: {
    height: responsiveHeight(4.5),
    width: responsiveWidth(9.25),
  },
  down: {
    height: responsiveHeight(3),
    width: responsiveWidth(6),
  },
  rectangle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(16),
    // backgroundColor: 'blue',
    marginTop: responsiveHeight(-4.5),
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
    // marginBottom: responsiveHeight(1),
  },
  squaretext: {
    fontSize: responsiveScreenFontSize(2),
    marginBottom: responsiveHeight(0.5),
    color: '#2e4c60',
    textAlign: 'center',
    fontFamily: 'good',
    marginTop: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(0.5),
  },
  squaretext___: {
    fontSize: responsiveScreenFontSize(2),
    color: '#2e4c60',
    textAlign: 'center',
    fontFamily: 'good',
    marginTop: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(0.5),
  },
  Welcometext: {
    fontSize: responsiveScreenFontSize(2),
    color: '#2e4c60',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 1,
    paddingHorizontal: responsiveWidth(2.25),
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
    marginTop: responsiveHeight(1.25),
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
  },
  online: {
    height: responsiveHeight(9),
    width: responsiveWidth(24),
    marginBottom: responsiveHeight(0.5),
  },
  home: {
    height: responsiveHeight(9),
    width: responsiveWidth(35),
    marginTop: responsiveHeight(0.5),
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

  logoutmodalBackground: {
    width: responsiveWidth(90),
    height: responsiveHeight(28),
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
    borderColor: '#2e4c60',
    color: '#2e4c60',
    borderWidth: 1.5,
    fontFamily: 'good',
    borderRadius: 6,
    letterSpacing: 1,
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(2),
  },
  LogOutText: {
    width: responsiveWidth(80),
    color: '#2e4c60',
    fontFamily: 'good',
    borderRadius: 6,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: responsiveHeight(4),
    fontSize: responsiveFontSize(2.5),
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
  LogOutModalButtonView: {
    width: responsiveWidth(85),

    marginBottom: responsiveHeight(2),

    paddingHorizontal: responsiveWidth(4),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
