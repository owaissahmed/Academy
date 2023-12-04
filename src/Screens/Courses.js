import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Collapsible from 'react-native-collapsible';

const AccordionItem = ({title, Videos, Price, isExpanded, onPress}) => {
  const handleButtonPress = () => {
    // Implement the action you want to perform when the button is pressed
    console.log(`Button pressed for ${title}`);
  };
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.TitleCollapse}>
          <Text style={styles.TitleText}>{title}</Text>
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={!isExpanded}>
        <View style={{padding: 10, backgroundColor: '#f0f0f0'}}>
          <View style={styles.V_P_View}>
            <Text>{Videos}</Text>
            <Text>{Price}</Text>
          </View>
          <View style={styles.ButtonView}>
            <TouchableOpacity onPress={handleButtonPress} style={styles.Button}>
              <Text>Demo Class</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleButtonPress} style={styles.Button}>
              <Text>Addmission</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

const Courses = ({navigation}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleAccordionPress = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const accordionItems = [
    {
      title: 'آسان اصول فقہ کورس مکمل ',
      Videos: 'Videos : 92',
      Price: 'Price : 7500',
    },
    {
      title: 'آسان اصول فقہ کورس مکمل ',
      Videos: 'Videos : 92',
      Price: 'Price : 7500',
    },

    // Add more items as needed
  ];

  return (
    <View>
      {accordionItems.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          Videos={item.Videos}
          Price={item.Price}
          isExpanded={expandedIndex === index}
          onPress={() => handleAccordionPress(index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  TitleCollapse: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#2e4c60',
  },
  TitleText: {
    color: '#fff',
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
    backgroundColor: 'lightblue',
    padding: 10,
  },
});

export default Courses;
