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
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';
const Auth = ({navigation}) => {
  const [gmail, setgmail] = useState('');
  const [password, setpassword] = useState('');
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userCourses, setuserCourses] = useState([]);
  const [visiblE, setVisiblE] = useState(true);
  const [loadinG, setloadinG] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [USER, setUSER] = useState(null);
  const [name, setname] = useState('');
  const [teacherUser, setteacherUser] = useState('');
  const [teacherData, setteacherData] = useState('');
  useEffect(() => {
    setTimeout(() => {
      setloadinG(false);
      setVisiblE(false);
    }, 1000);

    const Subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        setUSER(user.email);
        firestore()
          .collection('users')
          .where('Gmail', '==', user.email)
          .onSnapshot(querySnapshot => {
            const userCoursesData = [];
            querySnapshot.forEach(documentSnapshot => {
              userCoursesData.push({
                id: documentSnapshot.id,
                ...documentSnapshot.data(),
              });
            });

            setuserCourses(userCoursesData);
          });
      }
    });

    const Subscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUSER(user.email);
        firestore()
          .collection('teachers')
          .where('Gmail', '==', user.email)
          .onSnapshot(querySnapshot => {
            const userCoursesData = [];
            querySnapshot.forEach(documentSnapshot => {
              userCoursesData.push({
                id: documentSnapshot.id,
                ...documentSnapshot.data(),
              });
            });

            setteacherData(userCoursesData);
          });
      }
    });

    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      Subscribe, Subscriber, unsubscribe, subscriber();
    };
  }, []);

  async function Demo(Link) {
    try {
      if (Link !== '') {
        await Linking.openURL(Link);
      } else {
        Alert.alert('Error', 'No Class Available');
      }
    } catch (error) {
      if (error.message.includes('No Activity found to handle Intent')) {
        Alert.alert('Error', 'No app is available to handle the URL.');
      } else {
        console.error('Error opening URL:', error);
        Alert.alert('Error', 'Could not open the URL. Please try again later.');
      }
    }
  }

  const gmailChange = newgmail => {
    setgmail(newgmail);
  };
  const passwordChange = newpassword => {
    setpassword(newpassword);
  };

  function GoToSignup() {
    navigation.replace('UserSignup');
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
  function LogOut() {
    showMessage({
      message: '⚪️ Successfully LOGOUT!',
      color: 'white',
      position: 'bottom',
      type: 'success',
      titleStyle: {
        fontSize: responsiveFontSize(2),
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

  function login() {
    if (gmail.trim() === '' || password.trim() === '') {
      EmptyInput();
    } else if (isConnected == false) {
      Internet();
    } else {
      auth()
        .signInWithEmailAndPassword(gmail, password)
        .then(() => {
          navigation.navigate('First');
          showMessage({
            message: '⚪️ Successfully Sign In!',
            color: 'white',
            position: 'bottom',
            type: 'success',
            titleStyle: {
              fontSize: responsiveFontSize(2),
              lineHeight: responsiveHeight(3),
            },
          });
          setgmail('');
          setpassword('');
          console.log('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/invalid-email') {
            showMessage({
              message: '⚪️ Invalid-Email',
              type: 'warning',
              color: 'white',
              position: 'bottom',
              titleStyle: {
                fontSize: responsiveFontSize(2.25),
                lineHeight: responsiveHeight(3),
              },
            });
          } else if (error.code === 'auth/invalid-credential') {
            showMessage({
              message: '⚪️ Invalid-Password',
              type: 'warning',
              color: 'white',
              position: 'bottom',
              titleStyle: {
                fontSize: responsiveFontSize(2.25),
                lineHeight: responsiveHeight(3),
              },
            });
          }
          console.log(error);
        });
    }
  }

  const NameChange = newname => {
    setname(newname);
  };

  const handleSelectUser = user => {
    setSelectedUser(user);
  };

  const handleUpdateName = async () => {
    if (!selectedUser === 'Select Value' || name.trim() === '') {
      Alert.alert('Error', '⚫ Please Fill the Input');
      return;
    }

    const {id} = selectedUser;
    try {
      await firestore().collection('users').doc(id).update({FeesPaid: name});
      setSelectedUser(null);
    } catch (error) {
      console.log('Error updating name:', error);
    }
  };

  const isUserSignedIn = () => {
    return user !== null;
  };

  const LogingOut = async () => {
    if (isConnected == false) {
      Internet();
    } else {
      try {
        LogOut();
        setTimeout(async () => {
          await auth().signOut();
          navigation.replace('First');
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <>
      {isUserSignedIn() ? (
        <View>
          <ImageBackground
            resizeMode="cover"
            style={{
              width: devicewidth,
              height: deviceheight,
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop:
                selectedUser == null
                  ? responsiveHeight(0)
                  : responsiveHeight(15),
              paddingBottom:
                selectedUser != null
                  ? responsiveHeight(12)
                  : responsiveHeight(0),
            }}
            source={require('../Images/background.jpg')}>
            <Modal visible={visiblE} animationType="fade" transparent={true}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.100)',
                }}>
                {loadinG ? (
                  <ActivityIndicator size="large" color="#2e4c60" />
                ) : (
                  <Text allowFontScaling={false} style={{color: '#ffffff'}}>
                    Loading...
                  </Text>
                )}
              </View>
            </Modal>

            {selectedUser && (
              <View style={styles.ModalView}>
                <Text style={styles.ModalHeading}>
                  Enter Your Paid Fees Details
                </Text>
                <TextInput
                  allowFontScaling={false}
                  style={styles.password}
                  value={name}
                  onChangeText={NameChange}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleUpdateName}>
                  <Text allowFontScaling={false} style={styles.buttontext}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {teacherData.length > 0 ? (
              <TouchableOpacity style={styles.DataView}>
                <View style={styles.DataView}>
                  <Text allowFontScaling={false} style={styles.Gmail}>
                    {teacherData[0].Gmail}
                  </Text>
                  <Text allowFontScaling={false} style={styles.Name}>
                    Name : {teacherData[0].Name}
                  </Text>
                  <Text allowFontScaling={false} style={styles.Name}>
                    Father Name : {teacherData[0].Fathername}
                  </Text>
                  <Text allowFontScaling={false} style={styles.Name}>
                    CNIC : {teacherData[0].Cnic}
                  </Text>
                  <Text allowFontScaling={false} style={styles.Name}>
                    Phone No. : {teacherData[0].Phone}
                  </Text>
                  <Text allowFontScaling={false} style={styles.Name}>
                    Subject : {teacherData[0].Subject}
                  </Text>
                  <Text allowFontScaling={false} style={styles.Name}>
                    Education : {teacherData[0].Education}
                  </Text>
                  <Text allowFontScaling={false} style={styles.Name}>
                    Islamic Education : {teacherData[0].IslamicEducation}
                  </Text>
                  <Text allowFontScaling={false} style={styles.Name}>
                    Experience : {teacherData[0].Experience}
                  </Text>
                  <TouchableOpacity
                    onPress={LogingOut}
                    style={{width: responsiveWidth(50)}}>
                    <Text style={styles.UpdButton}>LogOut</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ) : null}

            {userCourses.length > 0 ? (
              <Animatable.View
                animation={'fadeInUp'}
                delay={1000}
                duration={2000}>
                <View style={styles.FlatListVIew}>
                  <FlatList
                    data={userCourses}
                    renderItem={({item}) => (
                      <TouchableOpacity style={styles.DataView}>
                        <View style={styles.DataView}>
                          <Text
                            allowFontScaling={false}
                            style={styles.CourseName}>
                            {item.CourseName}
                          </Text>
                          <Text allowFontScaling={false} style={styles.Name}>
                            Name : {item.Name}
                          </Text>
                          <Text allowFontScaling={false} style={styles.Name}>
                            Father Name : {item.Fathername}
                          </Text>

                          {item.Response !== 'Pending' ? (
                            <>
                            {item.Teacher ? (
                              <Text
                                allowFontScaling={false}
                                style={styles.Name}>
                                Teacher : {item.Teacher}
                              </Text>
                            ) : null}
                              {item.Subject ? (
                                <Text
                                  allowFontScaling={false}
                                  style={styles.Name}>
                                  Subject : {item.Subject}
                                </Text>
                              ) : null}
                              <Text
                                allowFontScaling={false}
                                style={styles.Name}>
                                Fees: {item.Fees}
                              </Text>
                              <Text
                                allowFontScaling={false}
                                style={styles.Name}>
                                Fees Paid: {item.FeesPaid}
                              </Text>
                              {item.Playlist ? (
                                <TouchableOpacity
                                  style={{width: responsiveWidth(100)}}
                                  onPress={() => Demo(item.Playlist)}>
                                  <Text style={styles.UpdButton}>
                                    Go To Course
                                  </Text>
                                </TouchableOpacity>
                              ) : null}
                              <TouchableOpacity
                                style={{width: responsiveWidth(100)}}
                                onPress={() => handleSelectUser(item)}>
                                <Text style={styles.UpdButton}>
                                  Update Paid Fees
                                </Text>
                              </TouchableOpacity>
                            </>
                          ) : (
                            <Text allowFontScaling={false} style={styles.Name}>
                              Response : {item.Response}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                  />
                </View>
              </Animatable.View>
            ) : (
              <>
                {teacherData.length > 0 ? null : loadinG === true ? null : (
                  <Text allowFontScaling={false} style={styles.NoData}>
                    No Data!!
                  </Text>
                )}
              </>
            )}
          </ImageBackground>
        </View>
      ) : (
        <ImageBackground
          resizeMode="cover"
          style={styles.background}
          source={require('../Images/background.jpg')}>
          <>
            <FlashMessage position={'center'} />
          </>
          <Animatable.View animation={'zoomIn'} delay={1000} duration={2000}>
            <SafeAreaView style={styles.submain}>
              <Image
                style={styles.logo}
                source={require('../Images/logo.png')}
              />
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
                  style={styles.passwordGmail}
                  placeholder="Enter Your Password"
                  placeholderTextColor={'grey'}
                />
                <TouchableOpacity style={styles.buttonGmail} onPress={login}>
                  <Text allowFontScaling={false} style={styles.buttontextGmail}>
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
            </SafeAreaView>
          </Animatable.View>
        </ImageBackground>
      )}
    </>
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
    width: responsiveWidth(90),
    backgroundColor: '#2e4c60',
    paddingHorizontal: responsiveWidth(0.25),
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
  passwordGmail: {
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
  buttonGmail: {
    backgroundColor: '#2e4c60',
    color: 'white',
    padding: 6,
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
    borderRadius: 8,
    width: responsiveWidth(30),
  },
  buttontextGmail: {
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
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  FlatListVIew: {
    width: responsiveWidth(95),
  },
  DataView: {
    backgroundColor: '#2e4c60',
    height: 'auto',
    width: responsiveWidth(95),
    marginVertical: responsiveHeight(1),
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.75),
    borderRadius: 12,
  },

  Name: {
    paddingHorizontal: responsiveWidth(8),
    fontSize: responsiveScreenFontSize(2.25),
    color: '#fff',
    paddingVertical: responsiveHeight(1),
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
  },

  CourseName: {
    paddingHorizontal: responsiveWidth(8),
    fontSize: responsiveScreenFontSize(2.5),
    color: '#2e4c60',
    backgroundColor: 'white',
    paddingVertical: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    textAlign: 'center',
    fontFamily: 'good',
    borderRadius: 12,
    letterSpacing: 2,
  },
  Gmail: {
    paddingHorizontal: responsiveWidth(8),
    fontSize: responsiveScreenFontSize(2.25),
    color: '#2e4c60',
    backgroundColor: 'white',
    paddingVertical: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    textAlign: 'center',
    fontFamily: 'good',
    borderRadius: 12,
    letterSpacing: 2,
    width: responsiveWidth(90),
  },
  UpdButton: {
    paddingHorizontal: responsiveWidth(8),
    fontSize: responsiveScreenFontSize(2.25),
    color: '#2e4c60',
    backgroundColor: 'white',
    paddingVertical: responsiveHeight(1),
    marginTop: responsiveHeight(1),
    textAlign: 'center',
    fontFamily: 'good',
    borderRadius: 12,
    letterSpacing: 2,
  },
  NoData: {
    fontSize: responsiveScreenFontSize(4),
    color: 'red',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  ModalView: {
    display: 'flex',
    position: 'relative',
    backgroundColor: 'white',
    width: responsiveWidth(90),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    marginBottom: responsiveHeight(1),
  },
  ModalHeading: {
    fontSize: responsiveScreenFontSize(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    color: '#fff',
    width: responsiveWidth(90),
    backgroundColor: '#2e4c60',
    paddingVertical: responsiveHeight(1.5),
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
    marginBottom: responsiveHeight(1),
  },
  Phone: {
    fontSize: responsiveScreenFontSize(2.25),
    backgroundColor: '#2e4c60',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
    marginVertical: responsiveHeight(1.5),
  },
  Welcometext: {
    fontSize: responsiveFontSize(1.75),
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 1,
    marginTop: responsiveHeight(2),
    width: responsiveWidth(90),
    backgroundColor: '#2e4c60',
    paddingHorizontal: responsiveWidth(0.25),
    paddingVertical: responsiveHeight(2),
  },
  button: {
    backgroundColor: '#2e4c60',
    color: 'white',
    padding: 6,
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
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
  password: {
    borderRadius: 10,
    paddingVertical: responsiveHeight(0.5),
    marginVertical: responsiveHeight(1),
    marginHorizontal: responsiveWidth(3),
    color: '#2e4c60',
    width: responsiveWidth(80),
    textAlign: 'center',
    fontSize: responsiveFontSize(2.25),
    borderWidth: 1.5,
    borderColor: '#2e4c60',
    color: '#2e4c60',
    height: responsiveHeight(5),
  },
});

export default Auth;
