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
      Linking.openURL('https://www.youtube.com/@azhar-ul-islam');
    } else Internet();
  }
  function Questions() {
    if (isConnected == true) {
     navigation.navigate('Questions')
    } else Internet();
  }

  return (
    <View>
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
              // backgroundColor: 'red',
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
                width: responsiveWidth(55),
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
                width: responsiveWidth(55),
                height: responsiveHeight(10),
                // backgroundColor: 'green',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}>
              <Text allowFontScaling={false} style={styles.rectangletext}>
                Ask a Question
              </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      </ImageBackground>
    </View>
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

  rectangle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
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
  },
});
