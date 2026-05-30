import React, { useState, useEffect, useRef } from 'react';
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
import Icon from 'react-native-vector-icons/Feather';
import Container from '../components/Container';
import Loader from '../components/Loader';
import BottomSheet from '../components/Bottomsheet';
import Button from '../components/Button';
import { api } from '../utlis/api';
import AppModal from '../components/Appmodal';
const BRAND = '#2e4c60';

// ─── Single Helpdesk Card ─────────────────────────────────────────────────────
const HelpdeskCard = ({ item, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1, duration: 350,
                delay: index * 80, useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0, delay: index * 80,
                tension: 70, friction: 9, useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleOpen = () => {
        if (item.link) Linking.openURL(item.link);
    };

    return (
        <Animated.View style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}>
            <View style={styles.cardLeft}>
                <View style={styles.cardIconCircle}>
                    <Icon name="headphones" size={moderateScale(16)} color={BRAND} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text allowFontScaling={false} style={styles.cardName}>
                        {item.name}
                    </Text>
                    <Text allowFontScaling={false} style={styles.cardLink} numberOfLines={1}>
                        {item.link}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.openBtn}
                onPress={handleOpen}
                activeOpacity={0.8}
            >
                <Icon name="external-link" size={moderateScale(14)} color={BRAND} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onRetry }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="inbox" size={moderateScale(32)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>No Helpdesk Found</Text>
        <Text allowFontScaling={false} style={styles.emptySubtitle}>
            Abhi koi helpdesk available nahi.{'\n'}Baad mein dobara check karein.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
            <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
            <Text allowFontScaling={false} style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Helpdesk = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/helpdesk/all');
            const list = Array.isArray(res) ? res : (res.data || []);
            setData(list);
        } catch {
            setModal({
                visible: true,
                title: 'Error',
                message: 'Helpdesk load nahi ho saka. Dobara try karein.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            showHeader={true}
            headerTitle="Helpdesk"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading helpdesk..." />}

            {!loading && data.length === 0 && (
                <EmptyState onRetry={loadData} />
            )}

            {!loading && data.length > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                >
                    {data.map((item, index) => (
                        <HelpdeskCard key={item._id} item={item} index={index} />
                    ))}
                </ScrollView>
            )}

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
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: '#e8f0f5',
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
        fontSize: moderateScale(11),
        color: '#94a3b8',
    },
    openBtn: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#d4e4ef',
    },

    // ── Empty ──
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(32),
        gap: verticalScale(10),
    },
    emptyIconCircle: {
        width: scale(72),
        height: scale(72),
        borderRadius: scale(36),
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(4),
    },
    emptyTitle: {
        fontSize: moderateScale(16),
        fontWeight: '800',
        color: '#334155',
    },
    emptySubtitle: {
        fontSize: moderateScale(12.5),
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: moderateScale(19),
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        marginTop: verticalScale(8),
        paddingVertical: verticalScale(9),
        paddingHorizontal: scale(20),
        borderRadius: moderateScale(20),
        borderWidth: 1.5,
        borderColor: BRAND,
    },
    retryText: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: BRAND,
    },
});

export default Helpdesk;