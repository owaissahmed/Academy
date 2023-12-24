import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const StudentsData = ({navigation}) => {
  const [online, setonline] = useState('');
  const [total, settotal] = useState('');
  const [home, sethome] = useState('');
  const [aalimcourse, setaalimcourse] = useState('');
  const [course, setcourse] = useState('');

  useEffect(() => {
    const totalStudents = firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        const Total = [];
        querySnapshot.forEach(documentSnapshot => {
          Total.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        settotal(Total.length);
      });
    const Online = firestore()
      .collection('users')
      .where('Course', '==', 'Online Tuition')
      .onSnapshot(querySnapshot => {
        const qafilaData = [];
        querySnapshot.forEach(documentSnapshot => {
          qafilaData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setonline(qafilaData.length);
      });
    const Home = firestore()
      .collection('users')
      .where('Course', '==', 'Home Tuition')
      .onSnapshot(querySnapshot => {
        const DarussunnahData = [];
        querySnapshot.forEach(documentSnapshot => {
          DarussunnahData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        sethome(DarussunnahData.length);
      });
    const DarseNizami = firestore()
      .collection('users')
      .where('Course', '==', 'Dars-e-Nizami')
      .onSnapshot(querySnapshot => {
        const infiradiData = [];
        querySnapshot.forEach(documentSnapshot => {
          infiradiData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setaalimcourse(infiradiData.length);
      });
    const Courses = firestore()
      .collection('users')
      .where('Category', '==', 'Courses')
      .onSnapshot(querySnapshot => {
        const courseData = [];
        querySnapshot.forEach(documentSnapshot => {
          courseData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setcourse(courseData.length);
      });
    // const mukamal = firestore()

    //   .onSnapshot(querySnapshot => {
    //     const mukammalData = [];
    //     querySnapshot.forEach(documentSnapshot => {
    //       mukammalData.push({
    //         id: documentSnapshot.id,
    //         ...documentSnapshot.data(),
    //       });
    //     });
    //     setkhi1mukammal(mukammalData.length);
    //   });
    // const moqoof = firestore()

    //   .onSnapshot(querySnapshot => {
    //     const moqoofData = [];
    //     querySnapshot.forEach(documentSnapshot => {
    //       moqoofData.push({
    //         id: documentSnapshot.id,
    //         ...documentSnapshot.data(),
    //       });
    //     });
    //     setkhi1moqoof(moqoofData.length);
    //   });
    // const chodgae = firestore()

    //   .onSnapshot(querySnapshot => {
    //     const chodgaeData = [];
    //     querySnapshot.forEach(documentSnapshot => {
    //       chodgaeData.push({
    //         id: documentSnapshot.id,
    //         ...documentSnapshot.data(),
    //       });
    //     });
    //     setkhi1chodgae(chodgaeData.length);
    //   });
  }, []);
  // var total = aalimcourse + total + home + online + course;

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        <View style={styles.rectangle}>
          <Text allowFontScaling={false} style={styles.rectangletext}>
            Total Students
          </Text>
          <Text allowFontScaling={false} style={styles.rectangletext}>
            {total}
          </Text>
        </View>
        <View style={styles.squarediv}>
          <TouchableOpacity>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.squaretext}>
                Online Tuition
              </Text>
              <Text allowFontScaling={false} style={styles.squaretext}>
                {online}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.squaretext}>
                Home Tuition
              </Text>
              <Text allowFontScaling={false} style={styles.squaretext}>
                {home}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.square3text}>
                Dars-e-Nizami
              </Text>
              <Text allowFontScaling={false} style={styles.squaretext}>
                {aalimcourse}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.square}>
              <Text allowFontScaling={false} style={styles.squaretext}>
                Courses
              </Text>
              <Text allowFontScaling={false} style={styles.squaretext}>
                {course}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default StudentsData;

const styles = StyleSheet.create({
  background: {
    // backgroundColor: 'white',
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squarediv: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  submain: {
    height: responsiveHeight(8),
    width: responsiveWidth(90),
    alignItems: 'center',
  },
  heading: {
    fontSize: responsiveFontSize(3.5),
    marginTop: responsiveHeight(1.5),
    color: '#135229',
  },
  rectangle: {
    // marginTop: responsiveHeight(5),
    borderColor: '#135229',
    borderWidth: 1.5,
    height: responsiveHeight(15),
    width: responsiveWidth(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  rectangletext: {
    fontSize: responsiveScreenFontSize(4.5),
    color: '#135229',
  },
  squaretext: {
    fontSize: responsiveScreenFontSize(3.5),
    color: '#135229',
  },
  square3text: {
    fontSize: responsiveScreenFontSize(3),
    color: '#135229',
    textAlign: 'center',
  },
  square: {
    marginTop: responsiveHeight(3),
    borderColor: '#135229',
    borderWidth: 1.5,
    height: responsiveHeight(15),
    width: responsiveWidth(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: responsiveWidth(3),
  },
});
