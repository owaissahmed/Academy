import {
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  Linking,
} from 'react-native';
import {React, useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import { useAppContext } from './AppContext';
// import { useAppContext } from './AppContext';
import FlashMessage,{showMessage} from 'react-native-flash-message';
import * as Animatable from 'react-native-animatable';

export default function Home({route,navigation }) {
  const [isConnected, setIsConnected] = useState(false);

  const { showAlert } = useAppContext();

  useEffect(() => {
    if (showAlert) {
      showAlert();
    }
  }, [showAlert]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function Internet() {
    showMessage({
      message: '⚪️ No Internet Connection',
      // backgroundColor:'#36454F',
      type: 'warning',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
      // duration: 5000,
    });
  }

  function Youtube() {
    if (isConnected == true) {
      Linking.openURL('https://www.youtube.com/@azhar-ul-islam');
    } else Internet()
  }

  function Courses() {
    if (isConnected == true) {
    navigation.navigate('Form')
    } else  Internet()
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
        <View style={styles.submain}>
          <Animatable.View
            duration={2000}
            delay={100}
            animation="fadeInUp"
            style={styles.rectangle}>
            <Text allowFontScaling={false} style={styles.rectangletext}>
              ازھارالاسلام اکیڈمی
            </Text>
            <Text allowFontScaling={false} style={styles.rectangletext_}>
              آن لائن دینی تعلیم کا مستند ادارہ
            </Text>
          </Animatable.View>
        </View>
        <Animatable.View
          duration={2000}
          delay={100}
          animation="fadeInUp"
          style={styles.squarediv}>
          <TouchableOpacity onPress={Youtube}>
            <View
              style={styles.square}>
              <Image
                style={styles.youtube}
                source={require('../Images/youtube.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext__}>
                DARS-e-NIZAMI HELP DESK
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={Courses}>
            <View
              style={styles.square}>
              <Image
                style={styles.books}
                source={require('../Images/books.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext}>
                SHORT COURSES
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={styles.square}>
              <Image
                style={styles.online}
                source={require('../Images/online.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext}>
                ONLINE TUTION
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={styles.square}>
              <Image
                style={styles.home}
                source={require('../Images/home.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext}>
                HOME TUTION
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={styles.square}>
              <Image
                style={styles.quran}
                source={require('../Images/quran.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext__}>
                DARS-e-NIZAMI COURSE
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={styles.square}>
              <Image
                style={styles.info}
                source={require('../Images/info.png')}
              />
              <Text allowFontScaling={false} style={styles.squaretext}>
                ABOUT US
              </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  squarediv: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: responsiveWidth(95),
    marginTop: responsiveHeight(-6),
  },
  rectangletext: {
    fontFamily: 'mushaf',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(8.5),
    textAlign: 'center',
  },
  rectangletext_: {
    fontFamily: 'mushaf',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(4.5),
    textAlign: 'center',
    marginTop: responsiveHeight(-3),
  },
  squaretext: {
    fontSize: responsiveScreenFontSize(2.35),
    color: '#2e4c60',
    textAlign: 'center',
    fontFamily: 'good',
    marginTop: responsiveHeight(1),
  },
  squaretext__: {
    fontSize: responsiveScreenFontSize(2),
    color: '#2e4c60',
    textAlign: 'center',
    fontFamily: 'good',
    marginTop: responsiveHeight(1),
    lineHeight: 20,
  },
  square: {
    marginTop: responsiveHeight(3),
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    height: responsiveHeight(19),
    width: responsiveWidth(39),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: responsiveWidth(3),
  },
  info: {
    height: responsiveHeight(8),
    width: responsiveWidth(10),
  },
  quran: {
    height: responsiveHeight(8),
    width: responsiveWidth(24),
    marginTop: responsiveHeight(1),
  },
  online: {
    height: responsiveHeight(9),
    width: responsiveWidth(24),
    marginBottom: responsiveHeight(0.5),
  },
  home: {
    height: responsiveHeight(9),
    width: responsiveWidth(35),
    marginTop: responsiveHeight(1),
  },
  books: {
    height: responsiveHeight(9),
    width: responsiveWidth(20),
    marginTop: responsiveHeight(1),
  },
  youtube: {
    height: responsiveHeight(9),
    width: responsiveWidth(20),
    marginTop: responsiveHeight(0.5),
  },
});