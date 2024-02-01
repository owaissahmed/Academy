import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import auth from '@react-native-firebase/auth';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
import NetInfo from '@react-native-community/netinfo';
const Questions = ({navigation}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTeacherModalVisible, setTeacherModalVisible] = useState(false);
  const [courses, setcourses] = useState([]);
  const [question, setquestion] = useState('');
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 1000);

    const subscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    const unsubscribe = firestore()
      .collection('Questions')
      .where('Answer', '!=', '')
      .onSnapshot(querySnapshot => {
        const coursesData = [];
        querySnapshot.forEach(documentSnapshot => {
          coursesData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });

        setcourses(coursesData);
      });
    return () => unsubscribe, subscribe();
  }, []);

  const openModal = () => {
    if (isConnected == false) {
      Internet();
    } else {
      setTeacherModalVisible(true);
    }
  };

  function EmptyInput() {
    Alert.alert('⚫ Warning', 'Please Fill All Inputs!');
  }
  function Internet() {
    Alert.alert('⚫ Warning', 'No Internet Connection!');
  }
  function Submit() {
    Alert.alert('⚫ Congrats', 'Your Question Has Been Submit');
  }
  function LogIn() {
    Alert.alert('⚫ Warning', 'You Need To Login First!');
  }
  const questionChange = newquestion => {
    setquestion(newquestion);
  };
  const CheckPassword = () => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      LogIn();
      setTimeout(() => {
        navigation.replace('Auth');
      }, 2000);
      return;
    }

    if (question.trim() === '') {
      EmptyInput();
      return;
    }

    if (!isConnected) {
      Internet();
      return;
    }

    const collectionRef = firestore().collection('Questions').add({
      Question: question,
      Answer: '',
      CreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setTeacherModalVisible(!isTeacherModalVisible);
    Submit();
    setquestion('');
  };
  const Close = () => {
    setTeacherModalVisible(!isTeacherModalVisible);
  };

  return (
    <View>
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
                onChangeText={questionChange}
                placeholder="Write Your Question"
                placeholderTextColor={'grey'}
              />
              <View style={styles.ModalButtonView}>
                <TouchableOpacity style={styles.Btn} onPress={Close}>
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
        {courses.length > 0 ? (
          <Animatable.View animation={'fadeInUp'} delay={1000} duration={2000}>
            <View style={styles.FlatListVIew}>
              <FlatList
                data={courses}
                renderItem={({item}) => (
                  <TouchableOpacity style={styles.Data}>
                    <View style={styles.DataView}>
                      <Text allowFontScaling={false} style={styles.CourseName}>
                        {item.Question}
                      </Text>
                    </View>
                    <View style={styles.DataView}>
                      <Text allowFontScaling={false} style={styles.Answer}>
                        {item.Answer}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          </Animatable.View>
        ) : (
          <>
            {loading == true ? (
              <Text allowFontScaling={false} style={styles.NoData}></Text>
            ) : (
              <Text allowFontScaling={false} style={styles.NoData}>
                No Data!!
              </Text>
            )}
          </>
        )}
        <Animatable.View
          style={{
            width: responsiveWidth(100),
            // height: responsiveHeight(15),
            // alignSelf: 'baseline',
            // backgroundColor: 'yellow',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            bottom: 0,
            position: 'absolute',
          }}
          animation={'fadeInUp'}
          delay={1000}
          duration={2000}>
          <TouchableOpacity onPress={openModal} style={styles.rectangle}>
            <View
              style={
                {
                  // width: responsiveWidth(25),
                  // height: responsiveHeight(15),
                  // backgroundColor: 'red',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  // display: 'flex',
                  // marginHorizontal: responsiveWidth(6),
                }
              }>
              <Image
                style={{
                  width: responsiveWidth(8),
                  height: responsiveHeight(4),
                  // backgroundColor: 'red',
                }}
                source={require('../Images/q.png')}
              />
            </View>
            <View
              style={
                {
                  // width: responsiveWidth(55),
                  // height: responsiveHeight(10),
                  // backgroundColor: 'green',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  // display: 'flex',
                  // marginHorizontal: responsiveWidth(2),
                }
              }>
              <Text allowFontScaling={false} style={styles.rectangletext}>
                Ask Question Now
              </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      </ImageBackground>
    </View>
  );
};

export default Questions;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  FlatListVIew: {
    width: responsiveWidth(98),
    marginBottom: responsiveHeight(8),
  },
  Data: {
    backgroundColor: '#fff',
    borderColor: '#2e4c60',
    height: 'auto',
    width: responsiveWidth(98),
    marginVertical: responsiveHeight(1),
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.75),
    borderRadius: 12,
  },
  DataView: {
    paddingVertical: responsiveHeight(0.5),
  },
  CourseName: {
    fontSize: responsiveScreenFontSize(2.25),
    color: '#fff',
    backgroundColor: '#2e4c60',
    textAlign: 'center',
    borderRadius: 12,
    width: responsiveWidth(95),
    alignItems: 'center',
    fontWeight: '400',
    paddingHorizontal: responsiveWidth(0.5),
    paddingVertical: responsiveHeight(0.5),
    lineHeight: 30,
  },
  Answer: {
    fontSize: responsiveScreenFontSize(2.25),
    color: '#fff',
    backgroundColor: '#2e4c60',
    textAlign: 'center',
    borderRadius: 12,
    width: responsiveWidth(95),
    alignItems: 'center',
    fontWeight: '400',
    paddingHorizontal: responsiveWidth(0.5),
    paddingVertical: responsiveHeight(0.5),
    lineHeight: 30,
  },
  NoData: {
    fontSize: responsiveScreenFontSize(4),
    color: 'red',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 3,
    textTransform: 'uppercase',
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
  rectangle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#2e4c60',
    height: responsiveHeight(7),
    width: responsiveWidth(100),
  },
  rectangletext: {
    width: responsiveWidth(70),
    fontSize: responsiveScreenFontSize(2.5),
    color: '#fff',
    lineHeight: 25,
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
    textTransform: 'uppercase',
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
});
