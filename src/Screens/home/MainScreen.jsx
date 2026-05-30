import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Animated,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BRAND = '#2e4c60';

const MENU_ITEMS = [
    { key: 'Home', label: 'Dars-e-Nizami\nHelp Desk', icon: 'play-circle' },
    { key: 'ShortCourses', label: 'Short\nCourses', icon: 'book-open' },
    { key: 'OnlineTuition', label: 'Online\nTuition', icon: 'monitor' },
    { key: 'HomeTuition', label: 'Home\nTuition', icon: 'home' },
    { key: 'NizamiCourse', label: 'Dars-e-Nizami\nCourse', icon: 'book' },
    { key: 'Upcoming', label: 'Upcoming\nCourses', icon: 'calendar' },
];

// ─── Single menu box ──────────────────────────────────────────────────────────
const MenuBox = ({ item, onPress, delay }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, delay, tension: 70, friction: 8, useNativeDriver: true }),
        ]).start();
    }, []);

    const handlePressIn = () =>
        Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: true, tension: 200 }).start();

    const handlePressOut = () =>
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200 }).start();

    return (
        <Animated.View style={[styles.boxWrapper, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                onPress={() => onPress(item.key)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={styles.box}
            >
                <View style={styles.iconCircle}>
                    <Icon name={item.icon} size={moderateScale(22)} color={BRAND} />
                </View>
                <Text style={styles.boxLabel}>{item.label}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const MainScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    useEffect(() => {
        getName();
    }, []);

    const getName = async () => {
        const name = await AsyncStorage.getItem('name');
        console.log(name)
        setUserName(name);
    };
    const headerAnim = useRef(new Animated.Value(-20)).current;
    const headerOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.spring(headerAnim, { toValue: 0, tension: 60, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Container
            showHeader={false}
            showFooter={true}
            activeTab="Home"
            onTabPress={(key) => navigation.navigate(key)}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* ── TOP BAR (Welcome + Notification) ─────────────────── */}
                <Animated.View
                    style={[styles.topBar, { opacity: headerOpacity, transform: [{ translateY: headerAnim }] }]}
                >
                    <View>
                        <Text style={styles.welcomeText}>Welcome back</Text>
                        <Text style={styles.userName}>{userName}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.notifBtn}
                        onPress={() => navigation.navigate('Notifications')}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Icon name="bell" size={moderateScale(18)} color={BRAND} />
                        <View style={styles.notifDot} />
                    </TouchableOpacity>
                </Animated.View>

                {/* ── LOGO AREA ─────────────────────────────────────────── */}
                <Animated.View
                    style={[styles.logoArea, { opacity: headerOpacity, transform: [{ translateY: headerAnim }] }]}
                >
                    <Image
                        source={require('../../Images/landscape-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.tagline}>آن لائن دینی تعلیم کا مستند ادارہ</Text>
                </Animated.View>

                {/* ── MENU GRID ─────────────────────────────────────────── */}
                <View style={styles.grid}>
                    {MENU_ITEMS.map((item, index) => (
                        <MenuBox
                            key={item.key}
                            item={item}
                            onPress={(key) => navigation.navigate(key)}
                            delay={index * 60}
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

    // Top bar
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(14),
        paddingBottom: verticalScale(12),
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
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
    notifBtn: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: '#f0f4f8',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    notifDot: {
        position: 'absolute',
        top: scale(8),
        right: scale(8),
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: '#e05c5c',
        borderWidth: 1.5,
        borderColor: '#f0f4f8',
    },

    // Logo
    logoArea: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(14),
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        marginBottom: verticalScale(12),
    },
    logo: {
        width: scale(240),
        height: verticalScale(55),
    },
    tagline: {
        marginTop: verticalScale(6),
        fontSize: moderateScale(12),
        color: '#94a3b8',
        fontWeight: '500',
        textAlign: 'center',
    },

    // Grid
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: scale(12),
        gap: scale(10),
    },
    boxWrapper: {
        width: '47%',
    },
    box: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        paddingVertical: verticalScale(18),
        paddingHorizontal: scale(10),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e8edf2',
    },
    iconCircle: {
        width: scale(52),
        height: scale(52),
        borderRadius: scale(26),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(10),
    },
    boxLabel: {
        fontSize: moderateScale(11.5),
        fontWeight: '600',
        color: '#334155',
        textAlign: 'center',
        lineHeight: moderateScale(17),
    },
});

export default MainScreen;