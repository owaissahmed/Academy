import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Container from '../../components/Container';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

// ─── Menu Box (navigation item) ───────────────────────────────────────────────
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
                activeOpacity={0.9}
                style={styles.box}
            >
                <View style={styles.iconCircle}>
                    {item.image ? (
                        <Image source={item.image} style={styles.boxImage} resizeMode="contain" />
                    ) : (
                        <Entypo name={item.icon} size={moderateScale(20)} color={BRAND} />
                    )}
                </View>

                <Text allowFontScaling={false} style={styles.boxLabel} numberOfLines={2}>
                    {item.label}
                </Text>

                <View style={styles.chevronWrap}>
                    <Icon name="chevron-right" size={moderateScale(14)} color="#94a3b8" />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};


// ─── Main Screen ──────────────────────────────────────────────────────────────
const Enroll = ({ navigation }) => {
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });
    const [role, setRole] = useState(null);

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    const handlePress = (key) => {
        navigation.navigate(key);
    };

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

    // ─── Static Menu Data ─────────────────────────────────────────────────────────
    const MENU_ITEMS = [
        ...(role != 'student'
            ? [{ key: 'DarseNizami', label: 'Darse Nizami Course', icon: 'book' },]
            : []),
        { key: 'Courses', label: 'Short Courses', icon: 'folder-video' },
        { key: 'SpecialClass', label: 'Special Class', icon: 'star' },
        { key: 'PrivateClass', label: 'Private Class', icon: 'laptop' },
    ];


    return (
        <Container
            showHeader={true}
            headerTitle="Enroll Now"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                <View style={styles.headerBlock}>
                    <Text allowFontScaling={false} style={styles.headerTitle}>
                        Choose a Program
                    </Text>
                    <Text allowFontScaling={false} style={styles.headerSubtitle}>
                        Select where you'd like to enroll
                    </Text>
                </View>

                <View style={styles.grid}>
                    {MENU_ITEMS.map((item, index) => (
                        <MenuBox
                            key={item.key}
                            item={item}
                            onPress={handlePress}
                            delay={index * 70}
                        />
                    ))}
                </View>
            </ScrollView>

            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type="error"
                title={modal.title}
                message={modal.message}
                primaryBtn={{ label: 'OK', onPress: closeModal }}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    scroll: {
        padding: scale(16),
        paddingBottom: verticalScale(24),
    },

    // ── Header ──
    headerBlock: {
        marginBottom: verticalScale(18),
        paddingHorizontal: scale(2),
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: verticalScale(4),
    },
    headerSubtitle: {
        fontSize: moderateScale(12.5),
        color: '#64748b',
        fontWeight: '500',
    },

    // ── Menu grid ──
    grid: {
        gap: verticalScale(12),
    },
    boxWrapper: {
        width: '100%',
    },
    box: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e8edf2',
        gap: scale(14),
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconCircle: {
        width: scale(46),
        height: scale(46),
        borderRadius: scale(23),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e8f0f5',
    },
    boxImage: {
        width: scale(26),
        height: scale(26),
    },
    boxLabel: {
        fontSize: moderateScale(14.5),
        fontWeight: '700',
        color: '#0f172a',
        flex: 1,
        lineHeight: moderateScale(19),
    },
    chevronWrap: {
        width: scale(28),
        height: scale(28),
        borderRadius: scale(14),
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Enroll;