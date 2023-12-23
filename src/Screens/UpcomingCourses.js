import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ImageBackground,
  ScrollView,
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
      <View style={styles.main}>
        {courses.length > 0 ? (
          <View>
            <View style={styles.Description_View}>
              <FlatList
                data={courses}
                renderItem={({item}) => (
                  <ScrollView>
                    <>
                      <View style={styles.DataView}>
                        <View style={styles.D_F_CoursenameView}>
                          <Text
                            allowFontScaling={false}
                            style={styles.Coursename}>
                            {item.CourseName}
                          </Text>
                        </View>
                        <View style={styles.D_F_View}>
                          <Text
                            allowFontScaling={false}
                            style={styles.DescriptionText}>
                            • Duration : {item.Duration}
                          </Text>
                        </View>
                        <View style={styles.D_F_View}>
                          <Text
                            allowFontScaling={false}
                            style={styles.DescriptionText}>
                            • Fees : {item.Fees}
                          </Text>
                        </View>
                        <View style={styles.D_F_View}>
                          <Text
                            allowFontScaling={false}
                            style={styles.DescriptionText}>
                            • Starting Date : {item.StartDate}
                          </Text>
                        </View>
                        <View style={styles.D_F_View}>
                          <Text
                            allowFontScaling={false}
                            style={styles.DescriptionText}>
                            • Gender : {item.Gender}
                          </Text>
                        </View>
                        <View style={styles.D_F_View}>
                          <Text
                            allowFontScaling={false}
                            style={styles.DescriptionText}>
                            • Days : {item.Days}
                          </Text>
                        </View>
                        <View style={styles.D_F_View}>
                          <Text
                            allowFontScaling={false}
                            style={styles.DescriptionText}>
                            • Timings : {item.Time}
                          </Text>
                        </View>
                        <View style={styles.D_F_ButtonView}>
                          <TouchableOpacity style={styles.Button}>
                            <Text
                              allowFontScaling={false}
                              style={styles.ButtonText}>
                              Addmission
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  </ScrollView>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
        ) : (
          <Text allowFontScaling={false} style={styles.NoData}>
            No Courses!!
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
  main:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  FlatListVIew: {
    width: responsiveWidth(90),
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
  NoData: {
    fontSize: responsiveFontSize(3),
    color: 'red',
  },
  Description_View: {
    width: responsiveWidth(95),
  },
  DataView: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: responsiveHeight(0.5),
    marginVertical: responsiveHeight(1),
    textAlign: 'center',
    height: 'auto',
    fontSize: responsiveFontSize(2.25),
  },
  D_F_View: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: responsiveWidth(90),
    paddingHorizontal: responsiveWidth(1),
    borderRadius: 8,
  },
  D_F_CoursenameView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: responsiveWidth(95),
    marginTop: responsiveHeight(-0.5),
    backgroundColor: '#2e4c60',
    paddingHorizontal: responsiveWidth(1),
    borderColor: '#2e4c60',
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
  Coursename: {
    color: '#fff',
    fontSize: responsiveScreenFontSize(4),
    fontFamily: 'mushaf',
    textAlign: 'center',
    paddingBottom: responsiveHeight(1.25),
  },
  DescriptionText: {
    fontFamily: 'good',
    color: '#2e4c60',
    fontSize: responsiveScreenFontSize(2),
    marginHorizontal: responsiveWidth(4),
    letterSpacing: 0.5,
    marginTop: responsiveHeight(3),
  },
  D_F_ButtonView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: responsiveWidth(90),
    paddingHorizontal: responsiveWidth(1),
    borderRadius: 8,
  },
  Button: {
    marginTop: responsiveHeight(2),
    backgroundColor: '#2e4c60',
    paddingVertical: responsiveHeight(2),
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
    width: responsiveWidth(95),
  },
  ButtonText: {
    color: '#fff',
    fontSize: responsiveScreenFontSize(2.25),
    fontFamily: 'good',
    textAlign: 'center',
    letterSpacing: 1.75,
  },
});

export default UpcomingCourses;
