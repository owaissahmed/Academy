import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

import FlashMessage,{showMessage} from 'react-native-flash-message';

const CourseForm = ({navigation}) => {

function showMessageOnPage() {
    showMessage({
      message: 'This is a message',
      type: 'info',
    });
  }

  // render() {
  //   return (
  //     <View>
  //       {/* Your component content */}

  return (
    <View>
    <>
    <FlashMessage />
    </>
      <TouchableOpacity onPress={showMessageOnPage}>
        <Text>Show Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CourseForm;

const styles = StyleSheet.create({});
