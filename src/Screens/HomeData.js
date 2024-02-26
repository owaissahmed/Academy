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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Picker} from '@react-native-picker/picker';
import Modal from 'react-native-modal';

import {responsiveHeight} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const HomeData = ({navigation}) => {
  const [home, sethome] = useState([]);
  const [teachers, setteachers] = useState([]);
  const [isAdminModalVisible, setAdminModalVisible] = useState(false);
  const [name, setname] = useState();
  const [fees, setfees] = useState();
  const [feespaid, setfeespaid] = useState();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    const subscribe = firestore()
      .collection('teachers')
      .where('Response', '!=', '')
      .onSnapshot(querySnapshot => {
        const teachersData = [];
        querySnapshot.forEach(documentSnapshot => {
          teachersData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setteachers(teachersData);

        console.log('Online Data:', teachers);
      });
    const unsubscribe = firestore()
      .collection('users')
      .where('CourseName', '==', 'Home Tuition')
      .where('Status', '==', '')
      .onSnapshot(querySnapshot => {
        const homeData = [];
        querySnapshot.forEach(documentSnapshot => {
          homeData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        sethome(homeData);
      });

    return () => unsubscribe();
  }, []);

  const closeModalAdmin = () => {
    setAdminModalVisible(!isAdminModalVisible);
  };

  const AdminChange = newadmin => {
    setname(newadmin);
  };
  const FeesChange = newFees => {
    setfees(newFees);
  };
  const FeesPaidChange = newFeesPaid => {
    setfeespaid(newFeesPaid);
  };

  const handleSelectUser = user => {
    setAdminModalVisible(true);
    setSelectedUser(user);
  };

  const handleUpdateName = async () => {
    const {id} = selectedUser;
    setAdminModalVisible(!isAdminModalVisible);
    try {
      await firestore().collection('users').doc(id).update({
        Response: name,
        Teacher: selectedValue,
        Fees: fees,
        FeesPaid: feespaid,
      });
      setSelectedUser(null);
      console.log(selectedValue);
    } catch (error) {
      console.log('Error updating name:', error);
    }
    // setAdminModalVisible(!isAdminModalVisible);
    console.log(name, selectedValue);
  };

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        {home.length > 0 ? (
          <View>
            <View style={styles.FlatListVIew}>
              <FlatList
                data={home}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => handleSelectUser(item)}>
                    <View style={styles.DataView}>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Name : {item.Name}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Father Name : {item.Fathername}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Country : {item.Country}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Phone : {item.Phone}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Teacher : {item.Teacher}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Response : {item.Response}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Subject : {item.Subject}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Fees : {item.Fees}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        FeesPaid : {item.FeesPaid}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </View>
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
                  <TextInput
                    allowFontScaling={false}
                    autoFocus
                    style={styles.login}
                    onChangeText={FeesChange}
                    placeholder="Enter Fees"
                    placeholderTextColor={'grey'}
                  />
                  <TextInput
                    allowFontScaling={false}
                    autoFocus
                    style={styles.login}
                    onChangeText={FeesPaidChange}
                    placeholder="Enter Fees Paid"
                    placeholderTextColor={'grey'}
                  />
                  <View style={styles.pickergroup}>
                    <Picker
                      style={styles.picker}
                      dropdownIconColor={'#2e4c60'}
                      selectedValue={selectedValue}
                      onValueChange={(itemValue, itemIndex) =>
                        setSelectedValue(itemValue)
                      }>
                      <Picker.Item
                        label={'Select Teacher'}
                        value={'Select Teacher'}
                      />
                      {teachers.map((item, index) => (
                        <Picker.Item
                          key={index}
                          label={item.Name}
                          value={item.Name}
                        />
                      ))}
                    </Picker>
                  </View>
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

export default HomeData;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  FlatListVIew: {
    width: responsiveWidth(90),
  },
  DataView: {
    backgroundColor: '#2e4c60',
    height: 'auto',
    width: responsiveWidth(90),
    marginVertical: responsiveHeight(1),
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.5),
    borderRadius: 12,
  },

  Name: {
    fontSize: responsiveScreenFontSize(1.75),
    color: '#fff',
    paddingVertical: responsiveHeight(1),
    textAlign: 'center',
    fontFamily: 'good',
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
  modalBackground: {
    width: responsiveWidth(90),
    height: 'auto',
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
    // borderRadius: 6,
    letterSpacing: 1,
    marginTop: responsiveHeight(1),
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
  pickergroup: {
    alignItems: 'center',
    backgroundColor: '#FBFCF8',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    marginTop: responsiveHeight(1),
    borderColor: '#2e4c60',
    borderWidth: 1.5,
  },
  picker: {
    color: '#2e4c60',
    height: responsiveHeight(5.5),
    width: responsiveWidth(84),
  },
});
