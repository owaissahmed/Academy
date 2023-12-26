import React from 'react';
import First from './Screens/First';
import Form from './Screens/Form';
import Home from './Screens/Home';
import OnlineTuition from './Screens/OnlineTuition';
import HomeTuition from './Screens/HomeTuition';
import DarseNizamiForm from './Screens/DarseNizamiForm';
import Courses from './Screens/Courses';
import About from './Screens/About';
import CompletedProject from './Screens/CompletedProject';
import PendingProjects from './Screens/PendingProjects';
import UserAccount from './Screens/UserAccount';
import UpcomingCourses from './Screens/UpcomingCourses';
import ComingCourseForm from './Screens/ComingCourseForm';
import Admin from './Screens/Admin';
import AddCourse from './Screens/AddCourse';
import TeacherForm from './Screens/TeacherForm';
import StudentsData from './Screens/StudentsData';
import LeftStudents from './Screens/LeftStudents';
import OnlineData from './Screens/OnlineData';
import HomeData from './Screens/HomeData';
import DarseNizamiData from './Screens/DarseNizamiData';
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
          <Stack.Screen
            name="CompletedProject"
            component={CompletedProject}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PendingProjects"
            component={PendingProjects}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserAccount"
            component={UserAccount}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Admin"
            component={Admin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TeacherForm"
            component={TeacherForm}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UpcomingCourses"
            component={UpcomingCourses}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ComingCourseForm"
            component={ComingCourseForm}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddCourse"
            component={AddCourse}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StudentsData"
            component={StudentsData}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OnlineData"
            component={OnlineData}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LeftStudents"
            component={LeftStudents}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HomeData"
            component={HomeData}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DarseNizamiData"
            component={DarseNizamiData}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}
