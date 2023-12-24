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
import * as Animatable from 'react-native-animatable';

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
  }, []);

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        <Animatable.View animation={'zoomIn'} delay={1000} duration={2000} style={styles.rectangle}>
          <Text allowFontScaling={false} style={styles.rectangletext}>
            Total Students
          </Text>
          <Text allowFontScaling={false} style={styles.rectangletext}>
            {total}
          </Text>
        </Animatable.View>
        <Animatable.View animation={'zoomIn'} delay={1000} duration={2000} style={styles.squarediv}>
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
              <Text allowFontScaling={false} style={styles.squaretext}>
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
        </Animatable.View>
      </ImageBackground>
    </View>
  );
};

export default StudentsData;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squarediv: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  rectangle: {
    backgroundColor: '#2e4c60',
    borderWidth: 1.5,
    height: responsiveHeight(15),
    width: responsiveWidth(95),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 12,
  },
  rectangletext: {
    fontSize: responsiveScreenFontSize(3),
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
    textTransform:'uppercase',
  },
  squaretext: {
    fontSize: responsiveScreenFontSize(2.5),
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'good',
    textTransform:'uppercase',
    letterSpacing: 2,
  },
  square: {
    marginTop: responsiveHeight(2),
    borderColor: '#2e4c60',
    backgroundColor: '#2e4c60',
    borderWidth: 1.5,
    height: responsiveHeight(12),
    width: responsiveWidth(85),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: responsiveWidth(3),
  },
});
