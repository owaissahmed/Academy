import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getInitialNotification } from '@react-native-firebase/messaging';
import { requestNotificationPermission, getFcmToken } from '../../utlis/notifications';
import { getScreenFromNotificationData } from '../../utlis/Notificationnavigation';
import { api } from '../../utlis/api'; // apna actual path check kar lena

const BRAND = '#2e4c60';

const First = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo in
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Then fade in app name
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Then tagline
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      // Then loading dots
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    checkAuth();
  }, []);

  // FCM token generate karke backend ko bhejo (silent — fail ho to bhi app na ruke)
  const setupNotifications = async () => {
    console.log('=== FCM Setup Started ===');
    try {
      const hasPermission = await requestNotificationPermission();
      console.log('Has permission:', hasPermission);
      if (!hasPermission) return;

      const fcmToken = await getFcmToken();
      console.log('Token in setup:', fcmToken);
      if (fcmToken) {
        const response = await api.post('/auth/save-fcm-token', { fcmToken });
        console.log('Save token response:', response);
      }
    } catch (error) {
      console.log('FCM setup error:', error.message);
    }
  };

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        // Login hai to FCM setup bhi kar lo (background mein, await zaroori nahi navigation ke liye)
        setupNotifications();
      }

      // App killed state se notification tap karke khuli thi? Check karo
      const messagingInstance = getMessaging(getApp());
      const initialNotification = await getInitialNotification(messagingInstance);

      setTimeout(() => {
        if (!token) {
          navigation.replace('Login');
          return;
        }

        if (initialNotification?.data) {
          const screen = getScreenFromNotificationData(initialNotification.data);
          // Pehle Home pe replace karo (taake back button ke liye proper stack bane),
          // phir related screen ko upar push karo
          navigation.replace('Home');
          navigation.navigate(screen, { id: initialNotification.data.relatedId });
        } else {
          navigation.replace('Home');
        }
      }, 3000);
    } catch (error) {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.centerContent}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoCircle,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          {/* Replace with your actual logo image: */}
          <Image source={require('../../Images/landscape-logo.png')} style={styles.logoImage} resizeMode="contain" />
        </Animated.View>

      </View>

      {/* Bottom Loading Dots */}
      <Animated.View style={[styles.bottomWrap, { opacity: dotsOpacity }]}>
        <LoadingDots />
        <Text allowFontScaling={false} style={styles.loadingText}>Loading...</Text>
      </Animated.View>
    </View>
  );
};

// Simple animated dots
const LoadingDots = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      ).start();

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={styles.dotsRow}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'BRAND',
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerContent: {
    alignItems: 'center',
    gap: scale(12),
  },

  logoCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: scale(400),
    height: scale(150),
  },

  bottomWrap: {
    position: 'absolute',
    bottom: scale(48),
    alignItems: 'center',
    gap: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: scale(7),
  },
  dot: {
    width: scale(7),
    height: scale(7),
    borderRadius: 4,
    backgroundColor: BRAND,
  },
  loadingText: {
    fontSize: moderateScale(12),
    color: BRAND,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default First;