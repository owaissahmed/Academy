import React from 'react';
import First from './Screens/First';
import Form from './Screens/Form';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="First">
      <Stack.Screen
        name="First"
        component={First}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Form"
        component={Form}
        options={{headerShown: false}}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
