import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {React} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
const Admin = ({navigation}) => {
  function gotoAddCourse() {
    navigation.navigate('AddCourse');
  }
  function gotoStudentsData() {
    navigation.navigate('StudentsData');
  }
  function gotoTeachersData() {
    navigation.navigate('TeachersData');
  }
  function gotoAddOldCourse() {
    navigation.navigate('AddOldCourse');
  }
  function gotoAdminQues() {
    navigation.navigate('AdminQues');
  }
  function gotoAddPlaylist() {
    navigation.navigate('AddPlaylist');
  }

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
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
          style={styles.squareView}
          duration={2000}
          delay={100}
          animation="fadeInDown">
          <TouchableOpacity onPress={gotoStudentsData}>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.squaretext}>
                STUDENTS DATA
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={gotoTeachersData}>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.squaretext}>
                TEACHERS DATA
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={gotoAddCourse}>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.squaretext}>
                ADD NEW COURSE
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={gotoAddOldCourse}>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.squaretext}>
                ADD OLD COURSE
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={gotoAdminQues}>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.squaretext}>
                QUESTIONS
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={gotoAddPlaylist}>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.squaretext}>
              ADD PLAYLIST
              </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      </ImageBackground>
    </View>
  );
};

export default Admin;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rectangle: {
    display: 'flex',
    justifyContent: 'center',
    // backgroundColor: 'green',
    alignItems: 'center',
    // height: responsiveHeight(16),
    marginTop: responsiveHeight(-2),
  },

  rectangletext: {
    fontFamily: 'mushaf',
    height: responsiveHeight(12.5),
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(8.5),
    textAlign: 'center',
    marginBottom: responsiveHeight(-1),
  },
  rectangletext_: {
    fontFamily: 'mushaf',
    height: responsiveHeight(7),
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(4.5),
    textAlign: 'center',
    marginBottom: responsiveHeight(2),
  },
  squaretext: {
    fontSize: responsiveScreenFontSize(2.5),
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
  },
  squareView: {
    display: 'flex',
    flexDirection:'row',
    flexWrap:'wrap',
    // backgroundColor: 'green',
    justifyContent: 'center',
    // alignItems: 'center',
    height:'auto',
    width: responsiveWidth(100),
  },
  square: {
    marginTop: responsiveHeight(2),
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    height: responsiveHeight(15),
    width: responsiveWidth(45),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#2e4c60',
    marginHorizontal: responsiveWidth(2),
  },
});
