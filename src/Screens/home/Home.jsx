import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Animated, Alert, Linking, RefreshControl
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Entypto from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../../components/Container';
import { api } from '../../utlis/api';
import { notificationEvents } from '../../utlis/notificationEvents';

const BRAND = '#2e4c60';

// ─── Small menu item (bottom grid, bank-app style) ────────────────────────────
const MenuBox = ({ item, onPress, delay }) => {
  const translateY = useRef(new Animated.Value(14)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, tension: 70, friction: 9, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, tension: 200 }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200 }).start();

  return (
    <Animated.View style={[
      styles.menuItemWrapper,
      { opacity: opacityAnim, transform: [{ translateY }, { scale: scaleAnim }] },
    ]}>
      <TouchableOpacity
        onPress={() => onPress(item.key)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.menuItem}
      >
        <View style={styles.menuIconCircle}>
          {item.image ? (
            <Image source={item.image} style={styles.menuImage} resizeMode="contain" />
          ) : (
            <Entypto name={item.icon} size={moderateScale(22)} color={BRAND} />
          )}
        </View>

        <Text allowFontScaling={false} numberOfLines={2} style={styles.menuLabel}>
          {item.label.replace('\n', ' ')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Featured video card (horizontal scroll) ─────────────────────────────────
const VideoCard = ({ video, onPress }) => {
  const thumbUrl = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;

  return (
    <TouchableOpacity
      onPress={() => onPress(video)}
      activeOpacity={0.85}
      style={styles.videoCard}
    >
      <View style={styles.videoThumbWrapper}>
        <Image source={{ uri: thumbUrl }} style={styles.videoThumb} resizeMode="cover" />
        <View style={styles.playOverlay}>
          {/* <Entypto name="controller-play" size={moderateScale(20)} color="#ffffff" /> */}
        </View>
      </View>
      {/* <Text allowFontScaling={false} numberOfLines={2} style={styles.videoTitle}>
        {video.title}
      </Text> */}
    </TouchableOpacity>
  );
};

// ─── Video skeleton placeholder ───────────────────────────────────────────────
const VideoSkeleton = () => {
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={styles.videoCard}>
      <Animated.View style={[styles.videoThumbWrapper, styles.skeletonBox, { opacity: pulse }]} />
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Home = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [iconsReady, setIconsReady] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Foreground notification aaye to badge turant refresh ho
    const unsubscribe = notificationEvents.subscribe(() => {
      loadUnreadCount();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
      loadFeaturedVideos();
      loadUnreadCount();
    });

    return unsubscribe;
  }, [navigation]);

  const MENU_ITEMS = [
    { key: 'UserAttendance', label: 'My Attendance', icon: 'check', roles: ['student'] },
    { key: 'MyTests', label: 'My Tests', icon: 'clipboard', roles: ['student'] },
    { key: 'ExamResults', label: 'My Results', icon: 'bar-graph', roles: ['student',] },
    { key: 'MyCertificates', label: 'My Certificates', icon: 'trophy', roles: ['student'] },

    { key: 'HelpDesk', label: 'Darse Nizami Help Desk', icon: 'youtube', roles: ['user', 'student', 'teacher'] },
    { key: 'Enroll', label: 'Enroll Now', icon: 'book', roles: ['user', 'student'] },
    { key: 'UpcomingCourses', label: 'Upcoming Courses', icon: 'megaphone', roles: ['user', 'student', 'teacher'] },
    { key: 'TeacherApplication', label: 'Join As Teacher', icon: 'graduation-cap', roles: ['user', 'student'] },
    { key: 'TeacherSalary', label: 'Teacher Salary', icon: 'wallet', roles: ['teacher'] },
    { key: 'MarkAttendance', label: 'Mark Attendance', icon: 'check', roles: ['teacher'] },
    { key: 'ViewAttendance', label: 'View Attendance', icon: 'eye', roles: ['teacher'] },
    { key: 'Courses', label: 'Short Courses', icon: 'folder-video', roles: ['teacher'] },
    { key: 'Complaint', label: 'Report An Issue', icon: 'flag', roles: ['user', 'student', 'teacher'] },
    { key: 'About', label: 'About Us', icon: 'info', roles: ['user', 'student', 'teacher'] },

    // { key: 'SpecialClass', label: 'Special Class', icon: 'book', roles: ['teacher'] },
    // { key: 'PrivateClass', label: 'Private Class', icon: 'book', roles: ['teacher'] },


    // { key: 'DarseNizami', label: 'Darse Nizami Course', icon: 'book', roles: ['teacher'] },

  ];
  const visibleMenuItems = MENU_ITEMS.filter(item =>
    item.roles.includes(role)
  );

  // Icons ki last animation delay + duration ke baad "ready" mark karo
  useEffect(() => {
    if (visibleMenuItems.length === 0) return;
    const lastDelay = (visibleMenuItems.length - 1) * 45;
    const totalTime = lastDelay + 350; // + animation duration buffer
    const timer = setTimeout(() => setIconsReady(true), totalTime);
    return () => clearTimeout(timer);
  }, [visibleMenuItems.length]);

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

  const loadUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data?.count || 0);
    } catch (error) {
      console.log('Unread count load nahi ho saka.');
    }
  };

  const loadFeaturedVideos = async () => {
    try {
      const res = await api.get('/youtube-videos/featured');
      if (res.isSuccess) {
        setFeaturedVideos(res.data || []);
      }
    } catch (error) {
      console.log('Featured videos load nahi ho sake.');
    } finally {
      setVideosLoading(false);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadProfile(), loadFeaturedVideos(), loadUnreadCount()]);
    setRefreshing(false);
  };

  const handleMenuPress = (key) => {
    if (key === 'About') {
      Linking.openURL('https://www.azhaarulislam.com');
      return;
    }

    navigation.navigate(key);
  };

  const handleVideoPress = (video) => {
    Linking.openURL(video.youtubeUrl);
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((event) => {
      const { translationX, translationY, velocityX } = event;
      // Sirf clear left-swipe (horizontal) detect karo, vertical scroll ke sath clash na ho
      const isHorizontalSwipe = Math.abs(translationX) > Math.abs(translationY) * 2;
      if (isHorizontalSwipe && translationX < -60 && velocityX < -300) {
        navigation.navigate('ChatList');
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View collapsable={false} style={{ flex: 1 }}>
        <Container
          showHeader={false}
          showFooter={true}
          activeTab="Home"
          onTabPress={(key) => navigation.navigate(key)}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[BRAND]} tintColor={BRAND} />
            }
          >

            {/* ── TOP BAR (teal header, bank-app style) ─────────────────── */}
            <Animated.View style={[styles.topBarSection, { opacity: headerOpacity, transform: [{ translateY: headerSlide }] }]}>
              <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ flex: 1 }}>
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
                    <View style={{ marginLeft: scale(10) }}>
                      <Text allowFontScaling={false} style={styles.welcomeText}>Welcome back</Text>
                      <Text allowFontScaling={false} style={styles.userName}>{userName}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>


                  <TouchableOpacity
                    style={styles.booksBtn}
                    onPress={() => navigation.navigate('Notification')}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Icon name="bell" size={moderateScale(18)} color="#ffffff" />
                    {unreadCount > 0 && (
                      <View style={styles.badgeDot} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.booksBtn}
                    onPress={() => navigation.navigate('Books')}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Entypto name="open-book" size={moderateScale(18)} color="#ffffff" />
                    {/* <Text allowFontScaling={false} style={styles.booksBtnText}>Books</Text> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.booksBtn}
                    onPress={() => navigation.navigate('ChatList')}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Icon name="send" size={moderateScale(18)} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* ── LOGO CARD (white card overlapping teal header, bank-balance-card style) ── */}
            <Animated.View style={[styles.logoCard, { opacity: headerOpacity, transform: [{ translateY: headerSlide }] }]}>
              <Image
                source={require('../../Images/landscape-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text allowFontScaling={false} style={styles.tagline}>
                آن لائن دینی تعلیم کا مستند ادارہ
              </Text>
            </Animated.View>

            {/* ── QUICK ACTIONS GRID (small square boxes, bank-app style) ── */}
            <View style={styles.gridWrapper}>
              <View style={styles.grid}>
                {visibleMenuItems.map((item, index) => (
                  <MenuBox
                    key={item.key}
                    item={item}
                    onPress={handleMenuPress}
                    delay={index * 45}
                  />
                ))}
              </View>
            </View>

            {/* ── FEATURED VIDEOS (Discover-style horizontal scroll) ─────── */}
            {/* Jab tak icons ki animation complete nahi hoti ya API loading hai, skeleton dikhao.
            Agar loading khatam ho gayi aur koi video nahi mila, section hi gaib. */}
            {(videosLoading || !iconsReady) ? (
              <View style={styles.videosSection}>
                <Text allowFontScaling={false} style={styles.sectionTitle}>Featured Videos</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.videosScroll}
                  scrollEnabled={false}
                >
                  <VideoSkeleton />
                  <VideoSkeleton />
                </ScrollView>
              </View>
            ) : (
              featuredVideos.length > 0 && (
                <View style={styles.videosSection}>
                  <Text allowFontScaling={false} style={styles.sectionTitle}>Featured Videos</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.videosScroll}
                  >
                    {featuredVideos.map((video) => (
                      <VideoCard key={video._id} video={video} onPress={handleVideoPress} />
                    ))}
                  </ScrollView>
                </View>
              )
            )}

          </ScrollView>
        </Container>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: verticalScale(16),
    backgroundColor: '#f5f7f9',
  },

  // ── Top bar (teal background section)
  topBarSection: {
    backgroundColor: BRAND,
    paddingBottom: verticalScale(60),
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(18),
  },
  welcomeText: {
    fontSize: moderateScale(11),
    color: '#cfe0e8',
    fontWeight: '500',
  },
  userName: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#ffffff',
  },
  booksBtn: {
    height: scale(38),
    paddingHorizontal: scale(12),
    borderRadius: scale(19),
    backgroundColor: 'rgba(255,255,255,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: scale(6),
    right: scale(8),
    width: scale(9),
    height: scale(9),
    borderRadius: scale(5),
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: BRAND,
  },
  booksBtnText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#ffffff',
  },

  // ── Logo card (overlaps header like balance card)
  logoCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: scale(16),
    marginTop: verticalScale(-36),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(10),
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  logo: {
    width: scale(300),
    height: verticalScale(60),
    marginBottom: verticalScale(-10),
    marginTop: verticalScale(-6),
  },
  tagline: {
    fontFamily: 'mushaf',
    fontSize: moderateScale(30),
    color: '#64748b',
    textAlign: 'center',
  },

  // ── Quick actions grid
  gridWrapper: {
    marginTop: verticalScale(22),
    paddingHorizontal: scale(14),
  },
  sectionTitle: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: verticalScale(10),
    paddingHorizontal: scale(16),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  menuItemWrapper: {
    width: '25%',
    paddingHorizontal: scale(4),
    marginVertical: verticalScale(8),
  },
  menuItem: {
    alignItems: 'center',
  },
  menuIconCircle: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginBottom: verticalScale(6),
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  menuImage: {
    width: scale(26),
    height: scale(26),
  },
  menuLabel: {
    fontFamily: 'good',
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    lineHeight: moderateScale(14),
  },

  // ── Featured videos section
  videosSection: {
    marginTop: verticalScale(14),
  },
  videosScroll: {
    paddingHorizontal: scale(16),
    gap: scale(12),
  },
  videoCard: {
    width: scale(260),
  },
  videoThumbWrapper: {
    width: '100%',
    height: verticalScale(140),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    marginBottom: verticalScale(6),
  },
  videoThumb: {
    width: '100%',
    height: '100%',
  },
  skeletonBox: {
    backgroundColor: '#dbe3ea',
  },
  playOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.25)',
  },
  videoTitle: {
    fontSize: moderateScale(12.5),
    fontWeight: '600',
    color: '#0f172a',
    lineHeight: moderateScale(16),
  },

  // ── Avatar
  avatar: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(45),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarFallback: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(45),
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: '#ffffff',
  },
});

export default Home;