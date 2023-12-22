import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ImageBackground,
  Alert,
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

const UpcomingCourses = () => {
  const [courses, setcourses] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('New Course')
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

    return () => unsubscribe();
  }, []);

  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
      <View>
        <Text allowFontScaling={false} style={styles.HeadingText}>
          COURSES
        </Text>
      </View>
      <View style={styles.main}>
        {courses.length > 0 ? (
          <View>
            <View style={styles.Description_View}>
              <FlatList
                data={courses}
                renderItem={({item}) => (
                  <>
                    <View style={styles.V_P_View}>
                      <Text allowFontScaling={false} style={styles.Coursename}>
                        {item.CourseName}
                      </Text>
                      <View style={styles.D_F_View}>
                        <Text
                          allowFontScaling={false}
                          style={styles.DescriptionText}>
                          Duration : {item.Duration}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={styles.DescriptionText}>
                          Fees : {item.Fees}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.ButtonView}>
                      <TouchableOpacity style={styles.Button}>
                        <Text
                          allowFontScaling={false}
                          style={styles.ButtonText}>
                          Demo Class
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.Button}>
                        <Text
                          allowFontScaling={false}
                          style={styles.ButtonText}>
                          Addmission
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
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
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  // main: {
  //   backgroundColor: 'white',
  //   width: devicewidth,
  //   height: deviceheight,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingVertical: responsiveHeight(10),
  // },
  FlatListVIew: {
    width: responsiveWidth(90),
  },
  DataView: {
    backgroundColor: '#135229',
    borderRadius: 10,
    paddingVertical: responsiveHeight(0.5),
    marginVertical: responsiveHeight(0.5),
    color: 'white',
    textAlign: 'center',
    fontSize: responsiveFontSize(2.25),
  },
  HeadingText: {
    fontFamily: 'good',
    color: '#2e4c60',
    // backgroundColor: 'seagreen',
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
    // marginVertical:responsiveHeight(),
    marginTop: responsiveHeight(3),
    // marginBottom: responsiveHeight(2),
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  Update: {
    backgroundColor: '#135229',
    borderRadius: 10,
    paddingVertical: responsiveHeight(0.5),
    marginVertical: responsiveHeight(0.5),
    color: 'white',
    textAlign: 'center',
    fontSize: responsiveFontSize(2.25),
    marginBottom: responsiveHeight(-0.5),
  },
  Name: {
    color: 'white',
    fontSize: responsiveFontSize(2.25),
    textAlign: 'center',
  },
  Phone: {
    color: 'white',
    fontSize: responsiveFontSize(2.25),
    textAlign: 'center',
  },
  NoData: {
    fontSize: responsiveFontSize(3),
    color: 'red',
  },
  password: {
    borderRadius: 10,
    paddingVertical: responsiveHeight(0.5),
    color: 'white',
    textAlign: 'center',
    fontSize: responsiveFontSize(2.25),
    borderWidth: 1.5,
    borderLeftWidth: 8,
    borderColor: '#135229',
    color: 'black',
    height: responsiveHeight(5),
  },
  Description_View: {
    padding: 10,
    marginHorizontal: responsiveWidth(4),
    width: responsiveWidth(90),
    backgroundColor: 'white',
    borderColor: '#2e4c60',
    borderWidth: 2,
    height: responsiveHeight(20),
    marginTop: responsiveHeight(-2.25),
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  V_P_View: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(1),
    borderRadius: 8,
  },
  D_F_View: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: responsiveWidth(90),
    // backgroundColor: 'red',
    paddingHorizontal: responsiveWidth(1),
    borderRadius: 8,
  },
  Coursename: {
    color: '#2e4c60',
    fontSize: responsiveScreenFontSize(4),
    fontFamily: 'mushaf',
    // fontWeight: 'bold',
    // letterSpacing: 0.25,
    marginVertical: responsiveHeight(-2),
  },
  DescriptionText: {
    color: '#2e4c60',
    fontSize: responsiveScreenFontSize(2.25),
    marginHorizontal: responsiveWidth(4),
    fontFamily: 'nunito',
    fontWeight: 'bold',
    // backgroundColor: 'lightgreen',
    letterSpacing: 0.25,
    marginTop: responsiveHeight(3),
    // paddingVertical: responsiveHeight(0.75),
    // paddingHorizontal: responsiveWidth(1.5),
    // borderBottomRightRadius: 10,
    // borderTopRightRadius: 10
  },
  ButtonView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Button: {
    marginTop: responsiveHeight(1),
    backgroundColor: '#2e4c60',
    paddingVertical: responsiveHeight(0.75),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: 8,
  },
  ButtonText: {
    color: '#fff',
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'nunito',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default UpcomingCourses;
