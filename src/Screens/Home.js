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
import {React,useEffect,useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function Youtube() {
    if (isConnected == true) {
      Linking.openURL('https://www.youtube.com/@azhar-ul-islam');
    } else Alert.alert('⚠️ WARNING', 'No Internet Connection');
  }
  // function gotosignup() {
  //   if (isConnected == true) {
  //     navigation.navigate('Signup');
  //   } else Alert.alert('⚠️ WARNING', 'No Internet Connection');
  // }

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        <View style={styles.submain}>
        <View style={styles.rectangle}>
        <Text allowFontScaling={false} style={styles.rectangletext}>
        ازھارالاسلام اکیڈمی
      </Text>
        <Text allowFontScaling={false} style={styles.rectangletext_}>
        آن لائن دینی تعلیم کا مستند ادارہ
      </Text>
        </View>
      </View>
      <View style={styles.squarediv}>
        <TouchableOpacity >
          <View style={styles.square}>
          <Image style={styles.youtube} source={require('../Images/youtube.png')}/>
            <Text allowFontScaling={false} style={styles.squaretext__}>
            DARS-e-NIZAMI HELP DESK
          </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity >
          <View style={styles.square}>
          <Image style={styles.books} source={require('../Images/books.png')}/>
            <Text allowFontScaling={false} style={styles.squaretext}>
            SHORT COURSES
          </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.square}>
          <Image style={styles.online} source={require('../Images/online.png')}/>
            <Text allowFontScaling={false} style={styles.squaretext}>
            ONLINE TUTION
          </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity >
          <View style={styles.square}>
          <Image style={styles.home} source={require('../Images/home.png')}/>
            <Text allowFontScaling={false} style={styles.squaretext}>
            HOME TUTION
          </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity >
          <View style={styles.square}>
          <Image style={styles.quran} source={require('../Images/quran.png')}/>
            <Text allowFontScaling={false} style={styles.squaretext__}>
            DARS-e-NIZAMI COURSE
          </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity >
          <View style={styles.square}>
            <Image style={styles.info} source={require('../Images/info.png')}/>
            <Text allowFontScaling={false} style={styles.squaretext}>
            ABOUT US
          </Text>
          </View>
        </TouchableOpacity>
      </View>
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
  div: {
    // display:'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  bottom: {
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'flex-end',
  },
  topHeadingView: {
    // backgroundColor:'red'
  },
  topHeading: {
    fontFamily: 'mushaf',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(7.5),
    textAlign: 'center',
    marginTop: responsiveHeight(5),
  },
  subHeading: {
    fontFamily: 'mushaf',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(4),
    textAlign: 'center',
    //  backgroundColor:'red',
    marginTop: responsiveHeight(-3),
  },
  button: {
    backgroundColor: '#2e4c60',
    // padding: 6,
    marginTop: responsiveHeight(1),
    borderRadius: 4,
    height: responsiveHeight(5.75),
    width: responsiveWidth(90),
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  buttonText: {
    fontFamily: 'good',
    color: '#fff',
    // fontWeight: '600',
    // letterSpacing: 0.7,
    textAlign: 'center',
    fontSize: responsiveFontSize(2.15),
    alignContent: 'center',
    letterSpacing: 0.25,
  },


  squarediv: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: responsiveWidth(95),
    // backgroundColor:'red',
    marginTop:responsiveHeight(-6)
        
  },
  submain: {
    // height: responsiveHeight(8),
    // width: responsiveWidth(90),
    // marginBottom: responsiveHeight(3),
    // alignItems: 'center',
    // backgroundColor:'red'
  },
  rectangle: {
    // borderColor: '#135229',
    // borderWidth: 1.5,
    // height: responsiveHeight(10),
    // width: responsiveWidth(90),
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderRadius: 12,
  },
  rectangletext: {
    fontFamily: 'mushaf',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(8.5),
    textAlign: 'center',
    // marginTop: responsiveHeight(4),
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
    marginTop:responsiveHeight(1),
  },
  squaretext__: {
    fontSize: responsiveScreenFontSize(2),
    color: '#2e4c60',
    textAlign: 'center',
    fontFamily: 'good',
    marginTop:responsiveHeight(1),
// backgroundColor:'green',
lineHeight:20
    // paddingHorizontal: responsiveWidth(1),
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
  //  alignContent:'flex-end',
    marginHorizontal: responsiveWidth(3),
  },
  info:{
    height: responsiveHeight(8),
    width: responsiveWidth(10),
    marginBottom:responsiveHeight(0.75),
  //  marginVertical:responsiveHeight(1),
    // backgroundColor:'silver'
  },
  quran:{
    height: responsiveHeight(8),
    width: responsiveWidth(24),
    marginTop:responsiveHeight(1),
    // marginVertical:responsiveHeight(1),
    // backgroundColor:'silver'
  },
  online:{
    height: responsiveHeight(9),
    width: responsiveWidth(24),
    marginBottom:responsiveHeight(0.5),
    // marginVertical:responsiveHeight(1),
    // backgroundColor:'silver'
  },
  home:{
    height: responsiveHeight(9),
    width: responsiveWidth(35),
    marginTop:responsiveHeight(1),
    // marginVertical:responsiveHeight(1),
    // backgroundColor:'silver'
  },
  books:{
    height: responsiveHeight(9),
    width: responsiveWidth(20),
    marginTop:responsiveHeight(1),
    // marginVertical:responsiveHeight(1),
    // backgroundColor:'silver'
  },
  youtube:{
    height: responsiveHeight(9),
    width: responsiveWidth(20),
    marginTop:responsiveHeight(0.5),
    // marginVertical:responsiveHeight(1),
    // backgroundColor:'silver'
  }

});


// <Animatable.View
// duration={2000}
// delay={250}
// animation="fadeInUp"
// style={styles.topHeadingView}>
// <Animatable.Text
//   duration={2000}
//   delay={250}
//   style={styles.topHeading}>
//   ازھارالاسلام اکیڈمی
// </Animatable.Text>
// <Animatable.Text
//   duration={2000}
//   delay={250}
//   style={styles.subHeading}>
//   آن لائن دینی تعلیم کا مستند ادارہ
// </Animatable.Text>
// </Animatable.View>
// <Animatable.View animation="fadeInUp" duration={2000} delay={400}>
// <TouchableOpacity style={styles.button} onPress={Youtube}>
//   <Text style={styles.buttonText}>DARS-e-NIZAMI HELP DESK</Text>
// </TouchableOpacity>
// <TouchableOpacity style={styles.button}>
//   <Text style={styles.buttonText}>SHORT COURSES</Text>
// </TouchableOpacity>
// <TouchableOpacity style={styles.button}>
//   <Text style={styles.buttonText}>ONLINE TUTION</Text>
// </TouchableOpacity>
// <TouchableOpacity style={styles.button}>
//   <Text style={styles.buttonText}>HOME TUTION</Text>
// </TouchableOpacity>
// <TouchableOpacity style={styles.button}>
//   <Text style={styles.buttonText}>DARS-e-NIZAMI COURSE</Text>
// </TouchableOpacity>
// </Animatable.View>
// <Animatable.View
// animation="fadeInUp"
// duration={2000}
// delay={600}
// style={styles.bottom}>
// <TouchableOpacity style={styles.button}>
//   <Text style={styles.buttonText}>ABOUT US</Text>
// </TouchableOpacity>
// </Animatable.View>