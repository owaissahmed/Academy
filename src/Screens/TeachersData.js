import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';

const TeachersData = ({route, navigation}) => {
  const [teacher, setteacher] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('teachers')
      .where('Response', '!=', '')
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

  function GoToOneTeacherData(TeacherName) {
    navigation.navigate('OneTeacherData', {TeacherName: TeacherName});
  }

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        {teacher.length > 0 ? (
          <View>
            <Animatable.View
              animation={'zoomIn'}
              delay={1000}
              duration={2000}
              style={styles.FlatListVIew}>
              <FlatList
                data={teacher}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.DataView}
                    onPress={() => GoToOneTeacherData(item.Name)}>
                    <View style={styles.DataView}>
                      <Text allowFontScaling={false} style={styles.Name}>
                        {item.Name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </Animatable.View>
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

export default TeachersData;

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  FlatListVIew: {
    width: responsiveWidth(95),
  },
  DataView: {
    backgroundColor: '#2e4c60',
    height: 'auto',
    width: responsiveWidth(95),
    marginVertical: responsiveHeight(1),
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.5),
    borderRadius: 12,
  },

  Name: {
    fontSize: responsiveScreenFontSize(2),
    color: '#fff',
    paddingVertical: responsiveHeight(1),
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 1,
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
