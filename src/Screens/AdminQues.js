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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const AdminQues = ({navigation}) => {
  const [online, setonline] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setname] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Questions')
      //   .where('Answer', '==', '')
      .onSnapshot(querySnapshot => {
        const onlineData = [];
        querySnapshot.forEach(documentSnapshot => {
          onlineData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setonline(onlineData);
      });

    return () => unsubscribe();
  }, []);

  const NameChange = newname => {
    setname(newname);
  };

  const handleSelectUser = user => {
    setSelectedUser(user);
  };
  const handleClose = () => {
    setSelectedUser(null);
  };

  const handleUpdateName = async () => {
    if (!selectedUser === 'Select Value' || name.trim() === '') {
      Alert.alert('Error', '⚫ Please Fill the Input');
      return;
    }

    const {id} = selectedUser;
    try {
      await firestore().collection('Questions').doc(id).update({Answer: name});
      setSelectedUser(null);
      setname('')
    } catch (error) {
      console.log('Error updating name:', error);
    }
  };

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
        {selectedUser && (
          <View style={styles.ModalView}>
            <Text style={styles.ModalHeading}>
              Enter Answer
            </Text>
            <TextInput
              allowFontScaling={false}
              style={styles.password}
              value={name}
              onChangeText={NameChange}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: responsiveWidth(70),
              }}>
              <TouchableOpacity style={styles.button} onPress={handleClose}>
                <Text allowFontScaling={false} style={styles.buttontext}>
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleUpdateName}>
                <Text allowFontScaling={false} style={styles.buttontext}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {online.length > 0 ? (
          <View>
            <View style={styles.FlatListVIew}>
              <FlatList
                data={online}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.Data}
                    onPress={() => handleSelectUser(item)}>
                    <View style={styles.DataView}>
                      <Text allowFontScaling={false} style={styles.CourseName}>
                        {item.Question}
                      </Text>
                      <Text
                      allowFontScaling={false}
                      style={styles.CourseName}> 
                      {item.Answer ? item.Answer : 'No Answer ❓'}
                        </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </View>
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

export default AdminQues;

const styles = StyleSheet.create({
  FlatListVIew: {
    width: responsiveWidth(98),
  },
  DataView: {
    backgroundColor: '#2e4c60',
    height: 'auto',
    width: responsiveWidth(98),
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
    paddingVertical: responsiveHeight(1),
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
    fontSize: responsiveScreenFontSize(2.25),
  },
  password: {
    borderRadius: 10,
    paddingVertical: responsiveHeight(0.5),
    marginVertical: responsiveHeight(1),
    marginHorizontal: responsiveWidth(3),
    color: '#2e4c60',
    width: responsiveWidth(80),
    textAlign: 'center',
    fontSize: responsiveScreenFontSize(2.25),
    borderWidth: 1.5,
    borderColor: '#2e4c60',
    color: '#2e4c60',
    height: responsiveHeight(5),
  },
});
