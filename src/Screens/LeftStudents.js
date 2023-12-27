import {
    View,
    Text,
    Image,
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
  import {responsiveHeight} from 'react-native-responsive-dimensions';
  import {responsiveFontSize} from 'react-native-responsive-dimensions';
  import firestore from '@react-native-firebase/firestore';
  const devicewidth = Dimensions.get('window').width;
  const deviceheight = Dimensions.get('window').height;
  import * as Animatable from 'react-native-animatable';
  
  const LeftStudents = ({navigation}) => {
    const [online, setonline] = useState([]);
  
    useEffect(() => {
      const unsubscribe = firestore()
        .collection('users')
        .where('Status', '==', 'Left')
        .onSnapshot(querySnapshot => {
          const onlineData = [];
          querySnapshot.forEach(documentSnapshot => {
            onlineData.push({
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            });
          });
          setonline(onlineData);
        });
  
      return () => unsubscribe();
    }, []);
  
    return (
      <View>
        <ImageBackground
          resizeMode="cover"
          style={styles.background}
          source={require('../Images/background.jpg')}>
          {online.length > 0 ? (
            <View>
              <View style={styles.FlatListVIew}>
                <FlatList
                  data={online}
                  renderItem={({item}) => (
                    <TouchableOpacity style={styles.DataView}>
                      <View style={styles.DataView}>
                        <Text allowFontScaling={false} style={styles.Name}>
                          Name : {item.Name}
                        </Text>
                        <Text allowFontScaling={false} style={styles.Name}>
                          Father Name : {item.Fathername}
                        </Text>
                        <Text allowFontScaling={false} style={styles.Name}>
                          Country : {item.Country}
                        </Text>
                        <Text allowFontScaling={false} style={styles.Name}>
                          Phone : {item.Phone}
                        </Text>
                        <Text allowFontScaling={false} style={styles.Name}>
                          Course : {item.CourseName}
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
  
  export default LeftStudents;
  
  const styles = StyleSheet.create({
    background: {
      width: devicewidth,
      height: deviceheight,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    FlatListVIew: {
      width: responsiveWidth(90),
    },
    DataView: {
      backgroundColor: '#2e4c60',
      height: 'auto',
      width: responsiveWidth(90),
  marginVertical:responsiveHeight(1),
      alignItems: 'center',
      paddingVertical: responsiveHeight(1),
      borderRadius: 12,
    },
  
    Name: {
      fontSize: responsiveScreenFontSize(2),
      color: '#fff',
      paddingVertical: responsiveHeight(1),
      textAlign: 'center',
      fontFamily: 'good',
      letterSpacing: 2,
    },
    NoData: {
      fontSize: responsiveScreenFontSize(1.5),
      color: 'red',
      textAlign: 'center',
      fontFamily: 'good',
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
  });
  