import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Linking,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import AppModal from '../../components/Appmodal';

const BRAND = '#2e4c60';

// ─── Static Contact Data ──────────────────────────────────────────────────────
const CONTACT_CHANNELS = [
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        subtitle: 'Chat with us instantly',
        icon: 'whatsapp',
        iconColor: '#25d366',
        iconBg: '#e6f9ed',
        link: 'https://wa.me/+923154411997', // <-- Apni details yahan daal lena
    },
    {
        id: 'facebook',
        name: 'Facebook',
        subtitle: 'Follow our community updates',
        icon: 'facebook',
        iconColor: '#1877f2',
        iconBg: '#e8f2fe',
        link: 'https://facebook.com/allamaazharalimadani',
    },
    {
        id: 'telegram',
        name: 'Telegram',
        subtitle: 'Join our official broadcast channel',
        icon: 'send',
        iconColor: '#0088cc',
        iconBg: '#e5f3fa',
        link: 'https://t.me/Azharulislamacademy',
    },
    {
        id: 'instagram',
        name: 'Instagram',
        subtitle: 'See what we are up to',
        icon: 'instagram',
        iconColor: '#e1306c',
        iconBg: '#fdf0f4',
        link: 'https://instagram.com/allama_azhar_ali_madani',
    },
];

// ─── Contact Row Card Component ───────────────────────────────────────────────
const ContactCard = ({ item, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 350,
                delay: index * 80,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                delay: index * 80,
                tension: 70,
                friction: 9,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleOpen = () => {
        if (item.link) {
            Linking.openURL(item.link).catch(() => {
                // Fail-safe falls back smoothly
                alert('Could not open the link.');
            });
        }
    };

    return (
        <Animated.View style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}>
            <View style={styles.cardLeft}>
                {/* Dynamically Styled Custom Vector Wrapper */}
                <View style={[styles.cardIconCircle, { backgroundColor: item.iconBg }]}>
                    <Icon name={item.icon} size={moderateScale(18)} color={item.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text allowFontScaling={false} style={styles.cardName}>
                        {item.name}
                    </Text>
                    {/* <Text allowFontScaling={false} style={styles.cardLink} numberOfLines={1}>
                        {item.subtitle}
                    </Text> */}
                </View>
            </View>

            <TouchableOpacity
                style={styles.openBtn}
                onPress={handleOpen}
                activeOpacity={0.8}
            >
                <Feather name="external-link" size={moderateScale(14)} color={BRAND} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Main Screen Component ────────────────────────────────────────────────────
const Contact = ({ navigation }) => {
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });
    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    return (
        <Container
            showHeader={true}
            headerTitle="Contact Us"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >

                {/* Grid Render Sequence Mapping */}
                {CONTACT_CHANNELS.map((item, index) => (
                    <ContactCard key={item.id} item={item} index={index} />
                ))}
            </ScrollView>

            {/* Error Framework Custom AppModal Shell */}
            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type="error"
                title={modal.title}
                message={modal.message}
                primaryBtn={{ text: 'OK', onPress: closeModal }} // Adjusted prop structure to match your custom AppModal configuration
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    scroll: {
        padding: scale(16),
        paddingBottom: verticalScale(24),
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#e8f0f5',
        borderRadius: moderateScale(12),
        padding: scale(14),
        marginBottom: verticalScale(20),
        alignItems: 'flex-start',
        gap: scale(10),
        borderWidth: 1,
        borderColor: '#d4e4ef',
    },
    infoText: {
        flex: 1,
        fontSize: moderateScale(12.5),
        color: BRAND,
        lineHeight: moderateScale(18),
        fontWeight: '500',
    },

    // ── Card ──
    card: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        padding: scale(16),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: '#e8edf2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
        flex: 1,
        marginRight: scale(10),
    },
    cardIconCircle: {
        width: scale(42),
        height: scale(42),
        borderRadius: scale(21),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardName: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: verticalScale(3),
    },
    cardLink: {
        fontSize: moderateScale(11.5),
        color: '#64748b',
    },
    openBtn: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
});

export default Contact;