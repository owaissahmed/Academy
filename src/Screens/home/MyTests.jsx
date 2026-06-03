import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

// ─── Single Test Card ─────────────────────────────────────────────────────────
const TestCard = ({ item, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, delay: index * 80, tension: 70, friction: 9, useNativeDriver: true }),
        ]).start();
    }, []);

    const percentage = Math.round((item.obtainedMarks / item.totalMarks) * 100);
    const passed = percentage >= 20;
    const formattedDate = new Date(item.testDate).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

    return (
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

            {/* Top row */}
            <View style={styles.cardTop}>
                <View style={styles.iconCircle}>
                    <Icon name="file-text" size={moderateScale(18)} color={BRAND} />
                </View>

                <View style={styles.cardTopText}>
                    <Text allowFontScaling={false} style={styles.subjectName} numberOfLines={1}>
                        {item.subject?.name}
                    </Text>
                    <Text allowFontScaling={false} style={styles.className} numberOfLines={1}>
                        {item.class?.name}
                    </Text>
                </View>

                <View style={[styles.badge, passed ? styles.badgePass : styles.badgeFail]}>
                    <Text allowFontScaling={false} style={[styles.badgeText, { color: passed ? '#059669' : '#dc2626' }]}>
                        {passed ? 'Pass' : 'Fail'}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Bottom row */}
            <View style={styles.cardBottom}>
                <View style={styles.metaItem}>
                    <Icon name="calendar" size={moderateScale(13)} color="#94a3b8" />
                    <Text allowFontScaling={false} style={styles.metaText}>{formattedDate}</Text>
                </View>

                <View style={styles.marksRow}>
                    <Text allowFontScaling={false} style={styles.obtainedMarks}>{item.obtainedMarks}</Text>
                    <Text allowFontScaling={false} style={styles.totalMarks}>/ {item.totalMarks}</Text>
                    <Text allowFontScaling={false} style={[styles.percentText, { color: passed ? '#059669' : '#dc2626' }]}>
                        ({percentage}%)
                    </Text>
                </View>
            </View>

        </Animated.View>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onRetry }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="clipboard" size={moderateScale(32)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>
            No Tests Available
        </Text>
        <Text allowFontScaling={false} style={styles.emptySubtitle}>
            No tests are available at the moment.{'\n'}Please check again later.
        </Text>
        <TouchableOpacity
            style={styles.retryBtn}
            onPress={onRetry}
            activeOpacity={0.8}
        >
            <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
            <Text allowFontScaling={false} style={styles.retryText}>
                Retry
            </Text>
        </TouchableOpacity>
    </View>
);
// ─── Main Screen ──────────────────────────────────────────────────────────────
const MyTests = ({ navigation }) => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => { fetchTests(); }, []);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const res = await api.get('/class-test/my');
            const list = Array.isArray(res) ? res : (res.data?.data || res.data || []);
            setTests(list);
        } catch {
            setModal({
                visible: true,
                title: 'Error',
                message: 'Failed to load tests. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            showHeader={true}
            headerTitle="My Tests"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading tests..." />}

            {!loading && tests.length === 0 && (
                <EmptyState onRetry={fetchTests} />
            )}

            {!loading && tests.length > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                >
                    {tests.map((item, index) => (
                        <TestCard key={item._id} item={item} index={index} />
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

    // ── Card
    card: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        padding: scale(16),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: '#e8edf2',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    iconCircle: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTopText: {
        flex: 1,
    },
    subjectName: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: verticalScale(3),
    },
    className: {
        fontSize: moderateScale(11.5),
        color: '#94a3b8',
        fontWeight: '500',
    },
    badge: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: moderateScale(20),
    },
    badgePass: { backgroundColor: '#dcfce7' },
    badgeFail: { backgroundColor: '#fee2e2' },
    badgeText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: verticalScale(10),
    },
    cardBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
    },
    metaText: {
        fontSize: moderateScale(11.5),
        color: '#94a3b8',
        fontWeight: '500',
    },
    marksRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: scale(3),
    },
    obtainedMarks: {
        fontSize: moderateScale(16),
        fontWeight: '800',
        color: BRAND,
    },
    totalMarks: {
        fontSize: moderateScale(12),
        color: '#94a3b8',
        fontWeight: '600',
    },
    percentText: {
        fontSize: moderateScale(11.5),
        fontWeight: '700',
        marginLeft: scale(2),
    },

    // ── Empty
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

export default MyTests;