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
const Playlist = ({navigation}) => {
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
      .collection('Playlists')
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

  async function youtube(Link) {
    try {
      if (!isConnected) {
        Alert.alert('⚫ Warning', 'No Internet Connection!');
      } else if (Link !== '') {
        await Linking.openURL(Link);
      } else {
        Alert.alert('Error', 'No Playlist Available');
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
    if (isConnected) {
      const username = 'allamaazharalimadani'; // Replace with the actual Facebook page username
      const url = `https://www.facebook.com/${username}`;

      Linking.openURL(url)
        .then(data => {
          console.log('Facebook Opened: ', data);
        })
        .catch(() => {
          Error('Facebook');
        });
    } else Internet();
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
        Error('Whatsapp');
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

  function Error(app) {
    showMessage({
      message: `Error In Opening ${app}`,
      type: 'danger',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveScreenFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
    });
  }

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
        <Animatable.View animation={'fadeInDown'} delay={1000} duration={2000}>
          <Image
            style={{
              width: responsiveWidth(40),
              height: responsiveHeight(15),
            }}
            source={require('../Images/logo.png')}
          />
        </Animatable.View>
        {courses.length > 0 ? (
          <Animatable.View animation={'fadeInUp'} delay={1000} duration={2000}>
            <View style={styles.FlatListVIew}>
              <FlatList
                data={courses}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => youtube(item.Link)}
                    style={styles.Data}>
                    <View style={styles.DataView}>
                      <Text allowFontScaling={false} style={styles.CourseName}>
                        {item.Name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          </Animatable.View>
        ) : (
          <View>
            {loading == true ? (
              <Text allowFontScaling={false} style={styles.NoData}></Text>
            ) : (
              <Text allowFontScaling={false} style={styles.NoData}>
                No Data!!
              </Text>
            )}
          </View>
        )}
        <Animatable.View
          animation={'fadeInUp'}
          delay={1000}
          duration={2000}
          style={{
            width: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: responsiveHeight(1),
          }}>
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
        </Animatable.View>
      </ImageBackground>
    </View>
  );
};

export default Playlist;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  FlatListVIew: {
    height: responsiveHeight(60),
    width: responsiveWidth(98),
  },
  Data: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#2e4c60',
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
    fontSize: responsiveScreenFontSize(3.25),
    color: '#fff',
    textAlign: 'center',
    borderRadius: 12,
    width: responsiveWidth(95),
    paddingBottom: responsiveHeight(0.5),
    fontFamily: 'mushaf',
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
});
