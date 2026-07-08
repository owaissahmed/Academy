import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Animated, Alert, Linking
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Entypto from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../../components/Container';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';


// ─── Single menu box ──────────────────────────────────────────────────────────
const MenuBox = ({ item, onPress, delay }) => {
  const translateX = useRef(new Animated.Value(-30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
      Animated.spring(translateX, { toValue: 0, delay, tension: 70, friction: 9, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, tension: 200 }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200 }).start();

  return (
    <Animated.View style={[
      styles.boxWrapper,
      { opacity: opacityAnim, transform: [{ translateX }, { scale: scaleAnim }] },
    ]}>
      <TouchableOpacity
        onPress={() => onPress(item.key)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.box}
      >
        <View style={styles.iconCircle}>
          {item.image ? (
            <Image source={item.image} style={styles.boxImage} resizeMode="contain" />
          ) : (
            <Entypto name={item.icon} size={moderateScale(22)} color={BRAND} />
          )}
        </View>

        <Text allowFontScaling={false} style={styles.boxLabel}>
          {item.label.replace('\n', ' ')}
        </Text>

        <Icon name="chevron-right" size={moderateScale(16)} color="#cbd5e1" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Home = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const MENU_ITEMS = [
    { key: 'MarkAttendance', label: 'Mark Attendance', icon: 'book' },
    { key: 'ViewAttendance', label: 'View Attendance', icon: 'book' },
    { key: 'DarseNizami', label: 'Darse Nizami Course', icon: 'book' },
    { key: 'Courses', label: 'Short Courses', icon: 'folder-video' },
    { key: 'MyTests', label: 'My Tests', icon: 'clipboard' },
    { key: 'ExamResults', label: 'My Results', icon: 'bar-graph' },
    { key: 'MyCertificates', label: 'My Certificates', icon: 'trophy' },
    { key: 'HelpDesk', label: 'Darse Nizami Help Desk', icon: 'youtube' },
    { key: 'TeacherApplication', label: 'Join As Teacher', icon: 'graduation-cap' },
    ...(role === 'teacher'
      ? [{ key: 'TeacherSalary', label: 'Teacher Salary', icon: 'wallet' }]
      : []),
    { key: 'UpcomingCourses', label: 'Upcoming Courses', icon: 'megaphone' },
    { key: 'Complaint', label: 'Report An Issue', icon: 'flag' },
    { key: 'About', label: 'About Us', icon: 'info' },
  ];


  const loadProfile = async () => {
    try {

      const res = await api.get('/students/profile');
      setProfile(res.data);
      setUserName(res.data.userId.name);
      setRole(res.data.userId.role);
      const data = await AsyncStorage.getItem('userId');
      console.log('data', data);
      if (!res.data.profilePic || !res.data.fatherName || !res.data.cnic || !res.data.gender || !res.data.phone) {
        navigation.replace('CompleteProfile');
      }
    } catch (error) {
      console.log('Profile load nahi ho saki.');
    }
  };

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleMenuPress = (key) => {
    if (key === 'About') {
      Linking.openURL('https://www.azhaarulislam.com');
      return;
    }

    navigation.navigate(key);
  };

  return (
    <Container
      showHeader={false}
      showFooter={true}
      activeTab="Home"
      onTabPress={(key) => navigation.navigate(key)}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── TOP BAR ─────────────────────────────────────────── */}
        <Animated.View style={[styles.topBar, { opacity: headerOpacity, transform: [{ translateY: headerSlide }] }]}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {profile?.profilePic ? (
                <Image source={{ uri: profile.profilePic }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text allowFontScaling={false} style={styles.avatarInitial}>
                    {userName?.[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
              )}
              <View style={{ marginLeft: scale(8) }}>
                <Text allowFontScaling={false} style={styles.welcomeText}>Welcome back</Text>
                <Text allowFontScaling={false} style={styles.userName}>{userName}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.topRight}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Notification')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="bell" size={moderateScale(18)} color={BRAND} />
              {/* <View style={styles.notifDot} /> */}
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── LOGO + TITLE ─────────────────────────────────────── */}
        <Animated.View style={[styles.logoArea, { opacity: headerOpacity, transform: [{ translateY: headerSlide }] }]}>
          <Image
            source={require('../../Images/landscape-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text allowFontScaling={false} style={styles.tagline}>
            آن لائن دینی تعلیم کا مستند ادارہ
          </Text>
        </Animated.View>

        {/* ── MENU LIST ─────────────────────────────────────────── */}
        <View style={styles.grid}>
          {MENU_ITEMS.map((item, index) => (
            <MenuBox
              key={item.key}
              item={item}
              onPress={handleMenuPress}
              delay={index * 55}
            />
          ))}
        </View>

      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: verticalScale(16),
  },

  // ── Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(12),
  },
  welcomeText: {
    fontSize: moderateScale(11),
    color: '#94a3b8',
    fontWeight: '500',
  },
  userName: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#0f172a',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  iconBtn: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notifDot: {
    position: 'absolute',
    top: scale(7),
    right: scale(7),
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#e05c5c',
    borderWidth: 1.5,
    borderColor: '#f0f4f8',
  },

  // ── Logo area
  logoArea: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: verticalScale(7),
    marginBottom: verticalScale(10),
  },
  logo: {
    width: scale(280),
    height: verticalScale(60),
    marginBottom: verticalScale(-12),
    marginTop: verticalScale(-10),
  },
  tagline: {
    fontFamily: 'mushaf',
    fontSize: moderateScale(30),
    color: '#64748b',
    textAlign: 'center',
  },

  // ── Menu list
  grid: {
    paddingHorizontal: scale(12),
    gap: verticalScale(6),
  },
  boxWrapper: {
    width: '100%',
  },
  box: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(14),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8edf2',
    gap: scale(14),
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  boxImage: {
    width: scale(26),
    height: scale(26),
  },
  boxLabel: {
    fontFamily: 'good',
    fontSize: moderateScale(14),
    letterSpacing: scale(0.5),
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
    lineHeight: moderateScale(18),
  },

  // ── Avatar
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(45),
    borderWidth: 3,
    borderColor: '#e8f0f5',
  },
  avatarFallback: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(45),
    backgroundColor: '#e8f0f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: BRAND,
  },
});

export default Home;