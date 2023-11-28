import React from 'react';
import First from './Screens/First';
import Form from './Screens/Form';
import Home from './Screens/Home';
import CourseForm from './Screens/CourseForm';
import OnlineTuition from './Screens/OnlineTuition';
import { AppProvider } from './Screens/AppContext';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
// import CourseForm from './Screens/CourseForm';
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppProvider>
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
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CourseForm"
          component={CourseForm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OnlineTuition"
          component={OnlineTuition}
          options={{headerShown: false}}
        />
        </Stack.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}
