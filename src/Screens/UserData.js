import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
const devicewidth = Dimensions.get('window').width;
import {Picker} from '@react-native-picker/picker';

const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
import {useRoute} from '@react-navigation/native';
const UserData = ({navigation}) => {
  const [userCourses, setuserCourses] = useState([]);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const [name, setname] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 1000);

    const unsubscribe = firestore()
      .collection('users')
      .where('Phone', '==', phoneNo)
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

    return () => unsubscribe();
  }, []);

  function show() {
    showMessage({
      message: '⚪️ Dont forget to send email after clicking on "SAVE" button',
      backgroundColor: '#36454F',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2),
        lineHeight: responsiveHeight(3),
      },
      duration: 50000,
    });
  }

  const NameChange = newname => {
    setname(newname);
  };

  const handleSelectUser = user => {
    setSelectedUser(user);
  };

  const handleUpdateName = async () => {
    if (!selectedUser === 'Select Value' || name.trim() === '') {
      Alert.alert('Error','⚫ Please Fill the Input');
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

  const route = useRoute();
  const {phoneNo} = route.params;

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={{
          width: devicewidth,
          height: deviceheight,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop:
            selectedUser == null ? responsiveHeight(0) : responsiveHeight(15),
          paddingBottom:
            selectedUser != null ? responsiveHeight(12) : responsiveHeight(0),
        }}
        source={require('../Images/background.jpg')}>
        <Modal visible={visible} animationType="fade" transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              // marginBottom:responsiveHeight(5),
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
            <TouchableOpacity style={styles.button} onPress={handleUpdateName}>
              <Text allowFontScaling={false} style={styles.buttontext}>
                Update
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {userCourses.length > 0 ? (
          <Animatable.View animation={'fadeInUp'} delay={1000} duration={2000}>
            <View style={styles.FlatListVIew}>
              <FlatList
                data={userCourses}
                renderItem={({item}) => (
                  <TouchableOpacity style={styles.DataView}>
                    <View style={styles.DataView}>
                      <Text allowFontScaling={false} style={styles.CourseName}>
                        {item.CourseName}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Name : {item.Name}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Father Name : {item.Fathername}
                      </Text>
                      <>
                        {item.Response !== 'Pending' ? (
                          <>
                            <Text allowFontScaling={false} style={styles.Name}>
                              Teacher: {item.Teacher}
                            </Text>
                            <Text allowFontScaling={false} style={styles.Name}>
                              Fees: {item.Fees}
                            </Text>
                            <Text allowFontScaling={false} style={styles.Name}>
                              Fees Paid: {item.FeesPaid}
                            </Text>
                            <TouchableOpacity
                              style={{width: responsiveWidth(100)}}
                              onPress={() => handleSelectUser(item)}>
                              <Text style={styles.UpdButton}>Update Paid Fees</Text>
                            </TouchableOpacity>
                         </>
                        ) : (
                          <Text allowFontScaling={false} style={styles.Name}>
                        Response : {item.Response}
                      </Text>
                        )}
                      </>
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

export default UserData;

const styles = StyleSheet.create({
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
    // lineHeight:25,
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
    // lineHeight:25,
    letterSpacing: 2,
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
    // lineHeight:25,
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
    // borderRadius: 10,
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
    // paddingVertical: responsiveHeight(1),
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
    marginVertical: responsiveHeight(1.5),
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
    color: 'black',
    height: responsiveHeight(5),
  },
});
