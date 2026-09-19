import React, { useEffect } from 'react';
import { AppProvider } from './Screens/AppContext';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, onNotificationOpenedApp } from '@react-native-firebase/messaging';
import { listenForegroundMessages } from './utlis/notifications';
import { navigationRef, navigate } from './utlis/navigationRef';
import { getScreenFromNotificationData } from './utlis/Notificationnavigation';
import { ToastProvider, useToast } from './components/ToastNotification';
import { notificationEvents } from './utlis/notificationEvents';
import First from './Screens/home/First';
import Home from './Screens/home/Home';
import Courses from './Screens//home/Courses';
import UpcomingCourses from './Screens/home/UpcomingCourses';
import HelpDesk from './Screens/home/HelpDesk';
import Login from './Screens/auth/Login';
import Signup from './Screens/auth/Signup';
import UpdatePassword from './Screens/auth/UpdatePassword';
import ForgotPassword from './Screens/auth/ForgotPassword';
import Profile from './Screens/auth/Profile';
import CompleteProfile from './Screens/auth/CompleteProfile';
import MainScreen from './Screens/home/MainScreen';
import TeacherApplication from './Screens/home/TeacherApplication';
import Enrollments from './Screens/enrollments/Enrollments';
import DarseNizamiFees from './Screens/enrollments/DarseNizamiFees';
import QuesAns from './Screens/home/QuesAns';
import Complaint from './Screens/home/Complaint';
import Announcements from './Screens/home/Announcements';
import MyTests from './Screens/home/MyTests';
import ExamResults from './Screens/home/ExamResults';
import MyCertificates from './Screens/home/MyCertificates';
import Notification from './Screens/home/Notification';
import TeacherSalary from './Screens/home/TeacherSalary';
import Contact from './Screens/home/Contact';
import DarseNizami from './Screens/home/DarseNizami';
import MarkAttendance from './Screens/home/MarkAttendance';
import ViewAttendance from './Screens/home/ViewAttendance';
import UserAttendance from './Screens/home/UserAttendance';
import Books from './Screens/home/Books';
import PdfViewer from './Screens/home/PdfViewer';
import PrivateClass from './Screens/home/PrivateClass';
import SpecialClass from './Screens/home/SpecialClass';
import Enroll from './Screens/home/Enroll';
const Stack = createStackNavigator();

function AppNavigatorInner() {
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribeForeground = listenForegroundMessages((remoteMessage) => {
      const title = remoteMessage.notification?.title || 'New Notification';
      const body = remoteMessage.notification?.body || '';

      showToast(title, body, () => {
        if (remoteMessage.data) {
          const screen = getScreenFromNotificationData(remoteMessage.data);
          navigate(screen, { id: remoteMessage.data.relatedId });
        }
      });

      // Home ke badge ko turant refresh karne ka signal
      notificationEvents.emit();
    });

    const messagingInstance = getMessaging(getApp());

    // App background mein thi, notification tap karke khola
    const unsubscribeOpenedApp = onNotificationOpenedApp(messagingInstance, (remoteMessage) => {
      if (remoteMessage?.data) {
        const screen = getScreenFromNotificationData(remoteMessage.data);
        navigate(screen, { id: remoteMessage.data.relatedId });
      }
    });

    // Note: killed-state (getInitialNotification) First.jsx mein handle hota hai,
    // taake checkAuth ka setTimeout(Home) isse override na kare

    return () => {
      unsubscribeForeground();
      unsubscribeOpenedApp();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
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
          <Stack.Screen name="MyTests" component={MyTests} options={{ headerShown: false }} />
          <Stack.Screen name="ExamResults" component={ExamResults} options={{ headerShown: false }} />
          <Stack.Screen name="MyCertificates" component={MyCertificates} options={{ headerShown: false }} />
          <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
          <Stack.Screen name="TeacherSalary" component={TeacherSalary} options={{ headerShown: false }} />
          <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
          <Stack.Screen name="Contact" component={Contact} options={{ headerShown: false }} />
          <Stack.Screen name="First" component={First} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Courses" component={Courses} options={{ headerShown: false }} />
          <Stack.Screen name="UpcomingCourses" component={UpcomingCourses} options={{ headerShown: false }} />
          <Stack.Screen name="HelpDesk" component={HelpDesk} options={{ headerShown: false }} />
          <Stack.Screen name="DarseNizami" component={DarseNizami} options={{ headerShown: false }} />
          <Stack.Screen name="MarkAttendance" component={MarkAttendance} options={{ headerShown: false }} />
          <Stack.Screen name="ViewAttendance" component={ViewAttendance} options={{ headerShown: false }} />
          <Stack.Screen name="UserAttendance" component={UserAttendance} options={{ headerShown: false }} />
          <Stack.Screen name="Books" component={Books} options={{ headerShown: false }} />
          <Stack.Screen name="PdfViewer" component={PdfViewer} options={{ headerShown: false }} />
          <Stack.Screen name="PrivateClass" component={PrivateClass} options={{ headerShown: false }} />
          <Stack.Screen name="SpecialClass" component={SpecialClass} options={{ headerShown: false }} />
          <Stack.Screen name="Enroll" component={Enroll} options={{ headerShown: false }} />

        </Stack.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <ToastProvider>
      <AppNavigatorInner />
    </ToastProvider>
  );
}