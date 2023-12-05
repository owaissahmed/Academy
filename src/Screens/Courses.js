import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const Accordion = ({id, title, Videos, Price, openAccordion, onToggle}) => {
  const isOpen = openAccordion === id;

  const toggleAccordion = () => {
    onToggle(id);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleAccordion}>
        <View style={styles.TitleCollapse}>
          <Text style={styles.TitleText}>{title}</Text>
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={{padding: 10, backgroundColor: '#2e4c60'}}>
          <View style={styles.V_P_View}>
            <Text>{Videos}</Text>
            <Text>{Price}</Text>
          </View>
          <View style={styles.ButtonView}>
            <TouchableOpacity style={styles.Button}>
              <Text style={styles.ButtonText}>Demo Class</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button}>
              <Text style={styles.ButtonText}>Addmission</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const Courses = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const handleToggle = accordionId => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId);
  };

  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
      <View>
        <Text style={styles.HeadingText}>AVAILIBLE COURSES</Text>
      </View>
      <ScrollView>
        <Accordion
          id={1}
          title="آسان  اصول  فقہ  کورس  "
          Videos="Videos : 92"
          Price="Price : 7500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={2}
          title="آسان اصول فقہ کورس 2 "
          Videos="Videos : 92"
          Price="Price : 7500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    // alignItems: 'center',
    // justifyContent: 'space-evenly',
  },
  TitleCollapse: {
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.5),
    marginHorizontal: responsiveWidth(4),
    backgroundColor: '#2e4c60',
  },
  HeadingText: {
    fontFamily: 'good',
    color: '#2e4c60',
    // backgroundColor: 'seagreen',
    fontSize: responsiveFontSize(4),
    textAlign: 'center',
    marginTop: responsiveHeight(4),
    marginBottom: responsiveHeight(3),
    textTransform:'capitalize',
    letterSpacing:1
  },
  TitleCollapse: {
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.5),
    marginHorizontal: responsiveWidth(4),
    backgroundColor: '#2e4c60',
    marginVertical:responsiveHeight(2)
  },
  TitleText: {
    color: '#fff',
    fontSize: responsiveScreenFontSize(2.75),
    fontFamily: 'mushaf',
  },
  V_P_View: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ButtonView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Button: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
  },
  ButtonText: {
    color: '#2e4c60',
  },
});

export default Courses;
