import React from 'react';
import First from './Screens/First';
import Form from './Screens/Form';
import Home from './Screens/Home';
import OnlineTuition from './Screens/OnlineTuition';
import HomeTuition from './Screens/HomeTuition';
import DarseNizamiForm from './Screens/DarseNizami';
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
import CoursesData from './Screens/CoursesData';
import HelpDesk from './Screens/HelpDesk';
import TeachersData from './Screens/TeachersData';
import DarseNizamiData from './Screens/DarseNizamiData';
import OneTeacherData from './Screens/OneTeacherData';
import AddOldCourse from './Screens/AddOldCourse';
import Questions from './Screens/Questions';
import Playlist from './Screens/Playlist';
import AdminQues from './Screens/AdminQues';
import AddPlaylist from './Screens/AddPlaylist';
import Auth from './Screens/Auth';
import TeacherTypes from './Screens/TeacherTypes';
import PendingTeachers from './Screens/PendingTeachers';
import UserSignup from './Screens/UserSignup';
import { AppProvider } from './Screens/AppContext';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './Screens/auth/Login';
import Signup from './Screens/auth/Signup';
import Profile from './Screens/auth/Profile';
import CompleteProfile from './Screens/auth/CompleteProfile';
import MainScreen from './Screens/home/MainScreen';
import TeacherApplication from './Screens/home/TeacherApplication';
import Enrollments from './Screens/enrollments/Enrollments';
import DarseNizamiFees from './Screens/enrollments/DarseNizamiFees';
import QuesAns from './Screens/home/QuesAns';
import Complaint from './Screens/home/Complaint';
import Announcements from './Screens/home/Announcements';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppProvider>
        <Stack.Navigator initialRouteName="First">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="CompleteProfile" component={CompleteProfile} options={{ headerShown: false }} />
          <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TeacherApplication" component={TeacherApplication} options={{ headerShown: false }} />
          <Stack.Screen name="Enrollments" component={Enrollments} options={{ headerShown: false }} />
          <Stack.Screen name="DarseNizamiFees" component={DarseNizamiFees} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name="QuesAns" component={QuesAns} options={{ headerShown: false }} />
          <Stack.Screen name="Complaint" component={Complaint} options={{ headerShown: false }} />
          <Stack.Screen name="Announcements" component={Announcements} options={{ headerShown: false }} />
          <Stack.Screen
            name="First"
            component={First}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Form"
            component={Form}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OnlineTuition"
            component={OnlineTuition}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeTuition"
            component={HomeTuition}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DarseNizamiForm"
            component={DarseNizamiForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Courses"
            component={Courses}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="About"
            component={About}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CompletedProject"
            component={CompletedProject}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PendingProjects"
            component={PendingProjects}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserAccount"
            component={UserAccount}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Admin"
            component={Admin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TeacherForm"
            component={TeacherForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpcomingCourses"
            component={UpcomingCourses}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ComingCourseForm"
            component={ComingCourseForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddCourse"
            component={AddCourse}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StudentsData"
            component={StudentsData}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OnlineData"
            component={OnlineData}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LeftStudents"
            component={LeftStudents}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeData"
            component={HomeData}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DarseNizamiData"
            component={DarseNizamiData}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CoursesData"
            component={CoursesData}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TeachersData"
            component={TeachersData}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OneTeacherData"
            component={OneTeacherData}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddOldCourse"
            component={AddOldCourse}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Auth"
            component={Auth}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="UserSignup"
            component={UserSignup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HelpDesk"
            component={HelpDesk}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Questions"
            component={Questions}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Playlist"
            component={Playlist}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminQues"
            component={AdminQues}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddPlaylist"
            component={AddPlaylist}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TeacherTypes"
            component={TeacherTypes}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PendingTeachers"
            component={PendingTeachers}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}
