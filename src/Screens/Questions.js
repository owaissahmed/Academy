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
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
import {useRoute} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {Picker} from '@react-native-picker/picker';
const Questions = ({navigation}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTeacherModalVisible, setTeacherModalVisible] = useState(false);
  const [courses, setcourses] = useState([]);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const CoursesForm = title => {
    navigation.navigate('Form', {TextHomeTuition: title});
  };

  const openModal = () => {
    if (isConnected == false) {
      Internet();
    } else {
      setTeacherModalVisible(true);
    }
  };
  const CheckPassword = () => {
    // fetchData();
    setTeacherModalVisible(!isTeacherModalVisible);
  };

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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 1000);

    const subscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    const unsubscribe = firestore()
      .collection('Old Courses')
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

    return () => unsubscribe,subscribe();
  }, []);

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
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
               
                dropdownIconColor={'#2e4c60'}
                onValueChange={itemValue => setsubject(itemValue)}
                style={styles.picker}>
                <Picker.Item
                  label={
                   'What Do You Want To Learn' 
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
            // position: 'absolute',
          }}
          animation={'fadeInUp'}
          delay={1000}
          duration={2000}>
          <TouchableOpacity onPress={openModal} style={styles.rectangle}>
            <View
              style={{
                // width: responsiveWidth(25),
                // height: responsiveHeight(15),
                // backgroundColor: 'red',
                // justifyContent: 'center',
                // alignItems: 'center',
                // display: 'flex',
                marginHorizontal: responsiveWidth(6),
              }}>
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
              style={{
                width: responsiveWidth(55),
                // height: responsiveHeight(10),
                // backgroundColor: 'green',
                // justifyContent: 'center',
                // alignItems: 'center',
                // display: 'flex',
              }}>
              <Text allowFontScaling={false} style={styles.rectangletext}>
                Ask Question..
              </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
        {courses.length > 0 ? (
          <Animatable.View animation={'fadeInUp'} delay={1000} duration={2000}>
            <View style={styles.FlatListVIew}>
              <FlatList
                data={courses}
                renderItem={({item}) => (
                  <TouchableOpacity style={styles.DataView}>
                    <View style={styles.DataView}>
                      <Text allowFontScaling={false} style={styles.CourseName}>
                        {item.CourseName}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Videos: {item.Videos}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Price : {item.Price}
                      </Text>
                      <View style={styles.ButtonView}>
                        <TouchableOpacity
                          style={styles.Button}
                          onPress={() => Demo(item.Link)}>
                          <Text
                            allowFontScaling={false}
                            style={styles.ButtonText}>
                            Demo Class
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.Button}
                          onPress={() => CoursesForm(item.CourseName)}>
                          <Text
                            allowFontScaling={false}
                            style={styles.ButtonText}>
                            Addmission
                          </Text>
                        </TouchableOpacity>
                      </View>
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
    width: responsiveWidth(95),
    marginBottom: responsiveHeight(8),
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
    fontSize: responsiveScreenFontSize(3.25),
    color: '#2e4c60',
    backgroundColor: 'white',
    marginTop: responsiveHeight(-1),
    marginBottom: responsiveHeight(1),
    textAlign: 'center',
    fontFamily: 'good',
    borderRadius: 12,
    width: responsiveWidth(90),
    fontFamily: 'mushaf',
    alignItems: 'center',
    paddingBottom: responsiveHeight(0.75),
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
    color: 'black',
    height: responsiveHeight(5),
  },
  ButtonView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: responsiveWidth(100),
  },
  Button: {
    marginTop: responsiveHeight(1),
    backgroundColor: '#fff',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 8,
  },
  ButtonText: {
    color: '#2e4c60',
    fontSize: responsiveScreenFontSize(2.25),
    fontFamily: 'nunito',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  rectangle: {
    display: 'flex',
    flexDirection: 'row',
    // alignSelf:'flex-end',
    // alignContent:'flex-end',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // paddingHorizontal: responsiveWidth(5),
    backgroundColor: '#2e4c60',
    height: responsiveHeight(7),
    // marginBottom: responsiveHeight(1),
    width: responsiveWidth(100),
    // borderRadius: 12,
    // bottom:0
  },
  rectangletext: {
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
