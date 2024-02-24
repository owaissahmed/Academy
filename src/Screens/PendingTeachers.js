import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';

const PendingTeachers = ({route, navigation}) => {
  const [teacher, setteacher] = useState([]);
  const [isAdminModalVisible, setAdminModalVisible] = useState(false);
  const [name, setname] = useState();
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('teachers')
      .where('Response', '==', '')
      .onSnapshot(querySnapshot => {
        const teacherData = [];
        querySnapshot.forEach(documentSnapshot => {
          teacherData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setteacher(teacherData);
      });

    return () => unsubscribe();
  }, []);

 

  const closeModalAdmin = () => {
    setAdminModalVisible(!isAdminModalVisible);
  };
  
  const AdminChange = newadmin => {
    setname(newadmin);
  };

  const handleSelectUser = user => {
    setAdminModalVisible(true);
    setSelectedUser(user);
  };

  const handleUpdateName = async () => {
    const {id} = selectedUser;
    try {
      await firestore().collection('teachers').doc(id).update({Response: name});
      setSelectedUser(null);
      setAdminModalVisible(!isAdminModalVisible);
    } catch (error) {
      console.log('Error updating name:', error);
    }
    setAdminModalVisible(!isAdminModalVisible);
  };

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        {teacher.length > 0 ? (
          <View>
            <Animatable.View
              animation={'zoomIn'}
              delay={1000}
              duration={2000}
              style={styles.FlatListVIew}>
              <FlatList
                data={teacher}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.DataView}
                    onPress={() => handleSelectUser(item)}>
                    <View style={styles.DataView}>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Name : {item.Name}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Father Name : {item.Fathername}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Gmail : {item.Gmail}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Phone : {item.Phone}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Subject : {item.Subject}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Experience : {item.Experience}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        IslamicEducation : {item.IslamicEducation}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Education : {item.Education}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Response : {item.Response}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </Animatable.View>
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
                    placeholder="Enter Response"
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
                      onPress={handleUpdateName}>
                      <Text allowFontScaling={false} style={styles.BtnText}>
                        Update
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>
            </Modal>
          </View>
        ) : (
          <Text allowFontScaling={false} style={styles.NoData}>
            No Data!!
          </Text>
        )}
      </ImageBackground>
    </View>
  );
};

export default PendingTeachers;

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
    paddingVertical: responsiveHeight(0.5),
    borderRadius: 12,
  },

  Name: {
    fontSize: responsiveScreenFontSize(2),
    color: '#fff',
    paddingVertical: responsiveHeight(1),
    textAlign: 'center',
    // fontFamily: 'good',
    letterSpacing: 1,
  },
  NoData: {
    fontSize: responsiveScreenFontSize(4),
    color: 'red',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 3,
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
    fontSize: responsiveScreenFontSize(2),
  },
  LogOutText: {
    width: responsiveWidth(80),
    color: '#2e4c60',
    fontFamily: 'good',
    borderRadius: 6,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: responsiveHeight(4),
    fontSize: responsiveScreenFontSize(2.5),
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
    fontSize: responsiveScreenFontSize(2.25),
  },
});
