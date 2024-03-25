import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  TextInput,
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
import * as Animatable from 'react-native-animatable';
import {useRoute} from '@react-navigation/native';
const Courses = ({navigation}) => {
  const [courses, setcourses] = useState([]);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const CoursesForm = title => {
    navigation.navigate('Form', {TextHomeTuition: title});
  };

  async function Demo(Link) {
    try {
      if (Link !== '') {
        await Linking.openURL(Link);
      } else {
        Alert.alert('Error', 'No Class Available');
      }
    } catch (error) {
      if (error.message.includes('No Activity found to handle Intent')) {
        Alert.alert('Error', 'No app is available to handle the URL.');
      } else {
        console.error('Error opening URL:', error);
        Alert.alert('Error', 'Could not open the URL. Please try again later.');
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 1000);

    const unsubscribe = firestore()
      .collection('Old Courses')
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
    <View>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={require('../Images/background.jpg')}>
        <Modal visible={visible} animationType="fade" transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              // marginBottom:responsiveHeight(5),
              backgroundColor: 'rgba(0, 0, 0, 0.100)',
            }}>
            {loading ? (
              <ActivityIndicator size="larger" color="#2e4c60" />
            ) : (
              <Text allowFontScaling={false} style={{color: '#ffffff'}}>
                Loading...
              </Text>
            )}
          </View>
        </Modal>
        {courses.length > 0 ? (
          <Animatable.View animation={'fadeInUp'} delay={1000} duration={2000}>
            <View style={styles.FlatListVIew}>
              <FlatList
                data={courses}
                renderItem={({item}) => (
                  <TouchableOpacity style={styles.DataView}>
                    <View style={styles.DataView}>
                      <Text allowFontScaling={false} style={styles.CourseName}>
                        {item.CourseName}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Videos: {item.Videos}
                      </Text>
                      <Text allowFontScaling={false} style={styles.Name}>
                        Price : {item.Price}
                      </Text>
                      <View style={styles.ButtonView}>
                        <TouchableOpacity
                          style={styles.Button}
                          onPress={() => Demo(item.Link)}>
                          <Text
                            allowFontScaling={false}
                            style={styles.ButtonText}>
                            Demo Class
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.Button}
                          onPress={() => CoursesForm(item.CourseName)}>
                          <Text
                            allowFontScaling={false}
                            style={styles.ButtonText}>
                            Admission
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          </Animatable.View>
        ) : (
          // <>
          //   {loading == true ? (
          //     <Text allowFontScaling={false} style={styles.NoData}></Text>
          //   ) : (
          //     <Text allowFontScaling={false} style={styles.NoData}>
          //       No Data!!
          //     </Text>
          //   )}
          // </>
          <>
            {loading != true ? (
              <Text allowFontScaling={false} style={styles.NoData}>
                No Data!!
              </Text>
            ) : null}
          </>
        )}
      </ImageBackground>
    </View>
  );
};

export default Courses;

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
    paddingVertical: responsiveHeight(0.75),
    borderRadius: 12,
  },

  Name: {
    paddingHorizontal: responsiveWidth(8),
    fontSize: responsiveScreenFontSize(2.25),
    color: '#fff',
    paddingVertical: responsiveHeight(1),
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
  },

  CourseName: {
    fontSize: responsiveScreenFontSize(3.25),
    color: '#2e4c60',
    backgroundColor: 'white',
    marginTop: responsiveHeight(-1),
    marginBottom: responsiveHeight(1),
    textAlign: 'center',
    fontFamily: 'good',
    borderRadius: 12,
    width: responsiveWidth(90),
    fontFamily: 'mushaf',
    alignItems: 'center',
    paddingBottom: responsiveHeight(0.75),
  },
  NoData: {
    fontSize: responsiveScreenFontSize(4),
    color: 'red',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  ModalView: {
    display: 'flex',
    position: 'relative',
    backgroundColor: 'white',
    width: responsiveWidth(90),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    marginBottom: responsiveHeight(1),
  },
  ModalHeading: {
    fontSize: responsiveScreenFontSize(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    color: '#fff',
    width: responsiveWidth(90),
    backgroundColor: '#2e4c60',
    paddingVertical: responsiveHeight(1.5),
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
    marginBottom: responsiveHeight(1),
  },
  Phone: {
    fontSize: responsiveScreenFontSize(2.25),
    backgroundColor: '#2e4c60',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'good',
    letterSpacing: 2,
    marginVertical: responsiveHeight(1.5),
  },

  password: {
    borderRadius: 10,
    paddingVertical: responsiveHeight(0.5),
    marginVertical: responsiveHeight(1),
    marginHorizontal: responsiveWidth(3),
    color: '#2e4c60',
    width: responsiveWidth(80),
    textAlign: 'center',
    fontSize: responsiveFontSize(2.25),
    borderWidth: 1.5,
    borderColor: '#2e4c60',
    color: 'black',
    height: responsiveHeight(5),
  },
  ButtonView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: responsiveWidth(100),
  },
  Button: {
    marginTop: responsiveHeight(1),
    backgroundColor: '#fff',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 8,
  },
  ButtonText: {
    color: '#2e4c60',
    fontSize: responsiveScreenFontSize(2.25),
    fontFamily: 'nunito',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
