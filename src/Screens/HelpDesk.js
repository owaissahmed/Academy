import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
import NetInfo from '@react-native-community/netinfo';
const HelpDesk = ({navigation}) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
  });

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

  function Internet() {
    showMessage({
      message: '⚪️ No Internet Connection',
      type: 'warning',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveScreenFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
    });
  }

  function Youtube() {
    if (isConnected == true) {
      Linking.openURL(
        'https://youtube.com/playlist?list=PLN0T4WcAQQmXUrslrRFHmCxlBI6JMLVmH&si=d0CWtoB7ZUma_2hS',
      );
    } else Internet();
  }
  function Questions() {
    if (isConnected == true) {
      navigation.navigate('Questions');
    } else Internet();
  }

  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
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
      <Animatable.View animation={'fadeInUp'} delay={1000} duration={2000}>
        <TouchableOpacity onPress={Youtube} style={styles.rectangle}>
          <View
            style={{
              width: responsiveWidth(25),
              height: responsiveHeight(10),
              //   backgroundColor: 'pink',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}>
            <Image
              style={{
                width: responsiveWidth(20),
                height: responsiveHeight(10),
                // backgroundColor: 'red',
              }}
              source={require('../Images/whiteyoutube.png')}
            />
          </View>

          <View
            style={{
              width: responsiveWidth(65),
              height: responsiveHeight(10),
              //   backgroundColor: 'green',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              //   marginLeft: responsiveWidth(10),
            }}>
            <Text allowFontScaling={false} style={styles.rectangletext}>
              DARS-e-NIZAMI HELP DESK
            </Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
      <Animatable.View animation={'fadeInUp'} delay={1000} duration={2000}>
        <TouchableOpacity onPress={Questions} style={styles.rectangle}>
          <View
            style={{
              width: responsiveWidth(25),
              height: responsiveHeight(15),
              //   backgroundColor: 'yellow',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}>
            <Image
              style={{
                width: responsiveWidth(16),
                height: responsiveHeight(9),
                // backgroundColor: 'red',
              }}
              source={require('../Images/q.png')}
            />
          </View>
          <View
            style={{
              width: responsiveWidth(65),
              height: responsiveHeight(10),
              // backgroundColor: 'green',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}>
            <Text allowFontScaling={false} style={styles.rectangletext}>
              Question/Answer
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            // display: 'flex',
            // flexDirection: 'row',
            width: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'green',
            marginTop: responsiveHeight(1),
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: responsiveWidth(55),
              justifyContent: 'space-evenly',
              // backgroundColor: 'green',
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
        </View>
      </Animatable.View>
    </ImageBackground>
  );
};

export default HelpDesk;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submain: {
    borderColor: '#2e4c60',
    // borderWidth: 1.5,
    width: responsiveWidth(90),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: responsiveHeight(3),
  },
  rectangle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(3),
    backgroundColor: '#2e4c60',
    height: responsiveHeight(15),
    marginVertical: responsiveHeight(1),
    width: responsiveWidth(95),
    alignItems: 'center',
    borderRadius: 12,
  },
  rectangletext: {
    fontSize: responsiveScreenFontSize(2.5),
    color: '#fff',
    lineHeight: 25,
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 30,
  },
});
