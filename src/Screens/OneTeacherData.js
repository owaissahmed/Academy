import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useRoute} from '@react-navigation/native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const OneTeacherData = ({navigation}) => {
  const [teacher, setteacher] = useState([]);
  const route = useRoute();
  const TeacherName = route.params.TeacherName;
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('Teacher', '==', TeacherName)
      .onSnapshot(querySnapshot => {
        const teacherData = [];
        querySnapshot.forEach(documentSnapshot => {
          teacherData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setteacher(teacherData);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        {teacher.length > 0 ? (
          <View style={styles.square}>
            <Text allowFontScaling={false} style={styles.squaretext}>
              Total Students
            </Text>
            <Text allowFontScaling={false} style={styles.squaretext}>
              {TeacherName}
            </Text>
            <Text allowFontScaling={false} style={styles.squaretext}>
              {teacher.length}
            </Text>
          </View>
        ) : (
          <View>
            <Text allowFontScaling={false} style={styles.squaretext}></Text>
          </View>
        )}
        {teacher.length > 0 ? (
          <View>
            <View style={styles.FlatListVIew}>
              <FlatList
                data={teacher}
                renderItem={({item}) => (
                  <TouchableOpacity style={styles.DataView}>
                    <View style={styles.DataView}>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Name : {item.Name}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Course Name : {item.CourseName}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Phone : {item.Phone}
                      </Text>
                      {item.Subject ? (
                        <Text allowFontScaling={false} style={styles.Name}>
                          Subject : {item.Subject}
                        </Text>
                      ) : null}
                      <Text allowFontScaling={false} style={styles.Name}>
                        Fees : {item.Fees}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        FeesPaid : {item.FeesPaid}
                      </Text>
                    </View>
                  </TouchableOpacity>
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
      </ImageBackground>
    </View>
  );
};

export default OneTeacherData;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  FlatListVIew: {
    width: responsiveWidth(95),
    marginBottom: responsiveHeight(16),
  },
  DataView: {
    backgroundColor: '#2e4c60',
    height: 'auto',
    width: responsiveWidth(95),
    marginVertical: responsiveHeight(1),
    alignItems: 'center',
    paddingVertical: responsiveHeight(1),
    borderRadius: 12,
  },
  squaretext: {
    fontSize: responsiveScreenFontSize(3),
    color: '#2e4c60',
    backgroundColor: '#fff',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
    lineHeight: 30,
  },
  square: {
    marginTop: responsiveHeight(16),
    borderWidth: 1.5,
    height: 'auto',
    width: responsiveWidth(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingVertical: responsiveHeight(1),
  },
  Name: {
    fontSize: responsiveScreenFontSize(2.25),
    color: '#fff',
    paddingVertical: responsiveHeight(1),
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
  },
  NoData: {
    fontSize: responsiveScreenFontSize(4),
    color: 'red',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
