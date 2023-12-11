import React from 'react';
import First from './Screens/First';
import Form from './Screens/Form';
import Home from './Screens/Home';
import OnlineTuition from './Screens/OnlineTuition';
import HomeTuition from './Screens/HomeTuition';
import DarseNizamiForm from './Screens/DarseNizamiForm';
import Courses from './Screens/Courses';
import About from './Screens/About';
import {AppProvider} from './Screens/AppContext';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

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
            name="OnlineTuition"
            component={OnlineTuition}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HomeTuition"
            component={HomeTuition}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DarseNizamiForm"
            component={DarseNizamiForm}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Courses"
            component={Courses}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="About"
            component={About}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}
