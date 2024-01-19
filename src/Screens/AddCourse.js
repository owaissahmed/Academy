import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  // Alert,
  Modal,
  Image,
  // Linking,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import {Picker} from '@react-native-picker/picker';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
import FlashMessage, {showMessage} from 'react-native-flash-message';

const AddCourse = ({navigation}) => {
  const [course, setcourse] = useState('');
  const [duration, setduration] = useState('');
  const [fee, setFee] = useState('');
  const [startDate, setstartDate] = useState('');
  const [days, setdays] = useState('');
  const [time, settime] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedValue, setSelectedValue] = useState('For Male');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const CourseName = coursename => {
    setcourse(coursename);
  };
  const Duration = duration => {
    setduration(duration);
  };
  const FeeChange = fee => {
    setFee(fee);
  };
  const DayChange = day => {
    setdays(day);
  };
  const TimeChange = time => {
    settime(time);
  };
  const startDateChange = startDate => {
    setstartDate(startDate);
  };
  const handleValueChange = value => {
    setSelectedValue(value);
  };

  function show() {
    showMessage({
      message: '⚪️ Course Added',
      type: 'success',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2),
        lineHeight: responsiveHeight(3),
      },
      duration: 50000,
    });
  }

  function Internet() {
    showMessage({
      message: '⚪️ No Internet Connection',
      type: 'warning',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
    });
  }

  const Check = async () => {
    if (isConnected == false) {
      Internet();
    } else {
      const collectionRef = firestore().collection('New Course').add({
        CourseName: course,
        Duration: duration,
        Fees: fee,
        Days: days,
        Time: time,
        StartDate: startDate,
        Gender: selectedValue,
      });

      show();
      setTimeout(() => {
        navigation.replace('Home');
      }, 2000);
      // }, 5000);
    }
  };

  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
      <>
        <FlashMessage position={'center'} />
      </>
      <Animatable.View animation={'zoomIn'} delay={1000} duration={2000}>
        <SafeAreaView style={styles.submain}>
          <TextInput
            onChangeText={CourseName}
            allowFontScaling={false}
            style={styles.login}
            placeholder="Enter Course Name"
            placeholderTextColor={'grey'}
          />
          <TextInput
            onChangeText={Duration}
            allowFontScaling={false}
            style={styles.password}
            placeholder="Enter Duration"
            placeholderTextColor={'grey'}
          />
          <TextInput
            onChangeText={FeeChange}
            allowFontScaling={false}
            style={styles.password}
            placeholder="Enter Fees"
            placeholderTextColor={'grey'}
          />
          <TextInput
            onChangeText={DayChange}
            allowFontScaling={false}
            style={styles.password}
            placeholder="Enter Class Days"
            placeholderTextColor={'grey'}
          />
          <TextInput
            onChangeText={TimeChange}
            allowFontScaling={false}
            style={styles.password}
            placeholder="Enter Timings"
            placeholderTextColor={'grey'}
          />
          <TextInput
            onChangeText={startDateChange}
            allowFontScaling={false}
            style={styles.password}
            placeholder="Enter Course Starting Date"
            placeholderTextColor={'grey'}
          />
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={handleValueChange}>
              <Picker.Item label="For Male" value="For Male" />
              <Picker.Item label="For Female" value="For Female" />
              <Picker.Item label="For Both" value="For Both" />
            </Picker>
          </View>
          <>
            <TouchableOpacity style={styles.button} onPress={Check}>
              <Text allowFontScaling={false} style={styles.buttontext}>
                SAVE
              </Text>
            </TouchableOpacity>
          </>
        </SafeAreaView>
      </Animatable.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    height: responsiveHeight(15),
    width: responsiveWidth(40),
    marginTop: responsiveHeight(2),
  },
  phoneinput: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'red',
    height: 200,
  },
  redColor: {
    backgroundColor: '#F57777',
  },
  message: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submain: {
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    width: responsiveWidth(90),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: responsiveHeight(3),
  },
  login: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    backgroundColor: '#FBFCF8',
    padding: 8,
    borderColor: '#2e4c60',
    color: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(2),
  },
  password: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    padding: 8,
    color: '#2e4c60',
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
  },
  picker: {
    backgroundColor: 'white',
    width: responsiveWidth(80),
    borderColor: '#2e4c60',
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
    borderWidth: 1.5,
    borderRadius: 10,
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(3),
  },
  default: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    padding: 8,
    color: '#2e4c60',
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2),
    textAlignVertical: 'center',
  },
  defaultCourse: {
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    paddingHorizontal: 6,
    paddingBottom: 4,
    color: '#2e4c60',
    borderColor: '#2e4c60',
    borderWidth: 1.5,
    marginTop: responsiveHeight(3),
    backgroundColor: '#FBFCF8',
    fontSize: responsiveFontSize(2.8),
    textAlignVertical: 'center',
    fontFamily: 'mushaf',
  },
  button: {
    backgroundColor: '#2e4c60',
    color: 'white',
    padding: 6,
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
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
});

export default AddCourse;
