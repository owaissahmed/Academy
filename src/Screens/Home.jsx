import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  TextInput,
  Alert,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../components/Container';
import { api } from '../utlis/api';
const BRAND = '#2e4c60';

// ─── 8 Menu items — purane code se liye ──────────────────────────────────────
const MENU_ITEMS = [
  { key: 'HelpDesk', label: 'DARS-e-NIZAMI HELP DESK', image: require('../Images/youtube.png') },
  { key: 'Courses', label: 'SHORT COURSES', image: require('../Images/books.png') },
  // { key: 'OnlineTuition', label: 'ONLINE TUITION', image: require('../Images/online.png') },
  // { key: 'HomeTuition', label: 'HOME TUITION', image: require('../Images/home.png') },
  { key: 'DarseNizamiForm', label: 'DARS-e-NIZAMI COURSE', image: require('../Images/quran.png') },
  { key: 'UpcomingCourses', label: 'UPCOMING COURSES', image: require('../Images/coming.png') },
  { key: 'TeacherApplication', label: 'BECOME A TEACHER', image: require('../Images/teacher.png') },
  { key: 'Complaint', label: ' Add Complaint', image: require('../Images/info.png') },
  { key: 'About', label: 'ABOUT US', image: require('../Images/info.png') },
];

// ─── Single menu box — List Style ─────────────────────────────────────────────
const ICON_COLORS = [
  '#5b6ef5', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#64748b',
];

const MenuBox = ({ item, onPress, delay, colorIndex }) => {
  const translateX = useRef(new Animated.Value(-30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
      Animated.spring(translateX, { toValue: 0, delay, tension: 70, friction: 9, useNativeDriver: true }),
    ]).start();
  }, []);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, tension: 200 }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200 }).start();

  const color = ICON_COLORS[colorIndex % ICON_COLORS.length];

  return (
    <Animated.View style={[
      styles.boxWrapper,
      { opacity: opacityAnim, transform: [{ translateX }, { scale: scaleAnim }] }
    ]}>
      <TouchableOpacity
        onPress={() => onPress(item.key)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.box}
      >
        {/* Colored icon circle */}
        <View style={[styles.iconCircle, { backgroundColor: color + '18' }]}>
          <Image source={item.image} style={styles.boxImage} resizeMode="contain" />
        </View>

        {/* Label */}
        <Text allowFontScaling={false} style={styles.boxLabel}>
          {item.label.replace('\n', ' ')}
        </Text>

        {/* Arrow */}
        <Icon name="chevron-right" size={moderateScale(16)} color="#cbd5e1" />
      </TouchableOpacity>
    </Animated.View>
  );
};
// ─── Main Screen ──────────────────────────────────────────────────────────────
const Home = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getName();
      loadProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const getName = async () => {
    const name = await AsyncStorage.getItem('name');
    // console.log(name)
    setUserName(name);
  };
  const loadProfile = async () => {
    try {
      const res = await api.get('/students/profile');

      setProfile(res.data);

      console.log(res.data.profilePic);
      if (!res.data.profilePic || !res.data.fatherName || !res.data.cnic || !res.data.gender || !res.data.phone) {
        console.log('data shhat')
          navigation.replace('Profile')
      }
    } catch (error) {
      console.log('Profile load nahi ho saki.');
    }
  };
  // Modal states — purane code se

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleMenuPress = (key) => {
    if (key === 'BecomeTeacher') {
      setAdminModalVisible(true);  // Become a teacher → admin modal
      return;
    }
    navigation.navigate(key);
  };


  const checkAdminPassword = () => {
    if (adminPassword === 'your_admin_pass') {   // ← apna password yahan
      setAdminModalVisible(false);
      setAdminPassword('');
      navigation.navigate('AdminPanel');
    } else {
      Alert.alert('Error', 'Incorrect password');
    }
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
        <Animated.View
          style={[styles.topBar, { opacity: headerOpacity, transform: [{ translateY: headerSlide }] }]}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {profile?.profilePic ? (
                <Image
                  source={{ uri: profile.profilePic }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text
                    allowFontScaling={false}
                    style={styles.avatarInitial}
                  >
                    {userName?.[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
              )}
              <View style={{ marginLeft: scale(8) }}>
                <Text
                  allowFontScaling={false}
                  style={styles.welcomeText}
                >
                  Welcome back
                </Text>

                <Text
                  allowFontScaling={false}
                  style={styles.userName}
                >
                  {userName}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.topRight}>
            {/* Notification */}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Login')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="bell" size={moderateScale(18)} color={BRAND} />
              <View style={styles.notifDot} />
            </TouchableOpacity>


          </View>
        </Animated.View>

        {/* ── LOGO + TITLE ─────────────────────────────────────── */}
        <Animated.View
          style={[styles.logoArea, { opacity: headerOpacity, transform: [{ translateY: headerSlide }] }]}
        >
          <Image
            source={require('../Images/landscape-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text allowFontScaling={false} style={styles.tagline}>
            آن لائن دینی تعلیم کا مستند ادارہ
          </Text>
        </Animated.View>

        {/* ── MENU GRID ─────────────────────────────────────────── */}
        <View style={styles.grid}>
          {MENU_ITEMS.map((item, index) => (
            <MenuBox
              key={item.key}
              item={item}
              onPress={handleMenuPress}
              delay={index * 55}
              colorIndex={index}   // ← add karo
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
    // borderBottomWidth: 1,
    // borderBottomColor: '#f1f5f9',
  },
  welcomeText: {
    fontSize: moderateScale(11),
    color: '#94a3b8',
    fontWeight: '500',
  },
  userName: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#0f172a',
    marginTop: verticalScale(1),
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
    // borderBottomWidth: 1,
    // borderBottomColor: '#f1f5f9',
    marginBottom: verticalScale(10),
  },
  logo: {
    width: scale(280),
    height: verticalScale(60),
    // backgroundColor: 'red',
    marginBottom: verticalScale(-12),
    marginTop: verticalScale(-10),
  },
  tagline: {
    fontFamily: 'mushaf',
    fontSize: moderateScale(30),
    color: '#64748b',
    textAlign: 'center',

    // backgroundColor: 'yellow'

  },

  // ── Grid
  grid: {
    paddingHorizontal: scale(12),
    // paddingTop: verticalScale(4),
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
  },
  boxImage: {
    width: scale(30),
    height: scale(30),
  },
  boxLabel: {
    fontFamily: 'good',
    fontSize: moderateScale(12.5),
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
    lineHeight: moderateScale(18),
  },

  // ── Modals
  modalWrap: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(20),
    alignItems: 'center',
  },
  modalLogo: {
    width: scale(160),
    height: verticalScale(36),
    marginBottom: verticalScale(12),
  },
  modalIcon: {
    marginBottom: verticalScale(8),
  },
  modalTitle: {
    fontSize: moderateScale(17),
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: verticalScale(4),
  },
  modalSubtitle: {
    fontSize: moderateScale(12.5),
    color: '#64748b',
    textAlign: 'center',
    marginBottom: verticalScale(16),
    fontFamily: 'good',
  },
  modalInput: {
    width: '100%',
    height: verticalScale(46),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    borderColor: '#d4dde5',
    paddingHorizontal: scale(14),
    color: BRAND,
    fontFamily: 'good',
    fontSize: moderateScale(13),
    marginBottom: verticalScale(16),
    backgroundColor: '#f8fafc',
  },
  modalBtns: {
    flexDirection: 'row',
    width: '100%',
    gap: scale(10),
  },
  btnOutline: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    borderColor: BRAND,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: BRAND,
    fontWeight: '700',
    fontSize: moderateScale(13),
  },
  btnFill: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: BRAND,
    alignItems: 'center',
  },
  btnFillText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: moderateScale(13),
  },

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