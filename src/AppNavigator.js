import React from 'react';
import First from './Screens/First';
import Form from './Screens/Form';
import Home from './Screens/Home';
// import {AppProvider} from './AppContext';
import { AppProvider } from './Screens/AppContext';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppProvider>
        <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
          <Stack.Screen
            name="Form"
            component={Form}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="First"
            component={First}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}
