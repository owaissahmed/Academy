import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Collapsible from 'react-native-collapsible';

const AccordionItem = ({title, Videos, Price, isExpanded, onPress}) => {
  const handleButtonPress = () => {
    // Implement the action you want to perform when the button is pressed
    console.log(`Button pressed for ${title}`);
  };
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:'center',
            padding: 10,
            backgroundColor: '#e0e0e0',
          }}>
          <Text>{title}</Text>
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={!isExpanded}>
        <View style={{padding: 10, backgroundColor: '#f0f0f0'}}>
        <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
          <Text>{Videos}</Text>
          <Text>{Price}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={handleButtonPress}
              style={{
                marginTop: 10,
                backgroundColor: 'lightblue',
                padding: 10,
              }}>
              <Text>Demo Class</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleButtonPress}
              style={{
                marginTop: 10,
                backgroundColor: 'lightblue',
                padding: 10,
              }}>
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
    {title: 'Item 2', Videos: 'Videos for Item 2', Price: 'Price : 7500'},
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

export default Courses;
