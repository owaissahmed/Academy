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

// ─── Single Exam Result Card Component ────────────────────────────────────────
const ExamResultCard = ({ item, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(25)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, delay: index * 80, tension: 70, friction: 9, useNativeDriver: true }),
        ]).start();
    }, []);

    // Accumulating totals dynamically from nested arrays
    let examTotalMarks = 0;
    let examObtainedMarks = 0;

    if (Array.isArray(item.marks)) {
        item.marks.forEach(m => {
            examTotalMarks += m.totalMarks || 0;
            examObtainedMarks += m.obtainedMarks || 0;
        });
    }

    // Dynamic Calculations
    const percentage = examTotalMarks > 0 ? Math.round((examObtainedMarks / examTotalMarks) * 100) : 0;
    const isPassed = percentage >= 40; // Business Rule: Fail if under 40%

    const formattedDate = item.exam?.startDate 
        ? new Date(item.exam.startDate).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
          })
        : '—';

    return (
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            
            {/* Header Block: Exam Meta Title & Badge Status */}
            <View style={styles.cardTop}>
                <View style={styles.iconCircle}>
                    <Icon name="award" size={moderateScale(18)} color={BRAND} />
                </View>

                <View style={styles.cardTopText}>
                    <Text allowFontScaling={false} style={styles.examName} numberOfLines={1}>
                        {item.exam?.name || 'Examination'}
                    </Text>
                    <Text allowFontScaling={false} style={styles.className} numberOfLines={1}>
                        {item.classId?.name || '—'}
                    </Text>
                </View>

                <View style={[styles.badge, isPassed ? styles.badgePass : styles.badgeFail]}>
                    <Text allowFontScaling={false} style={[styles.badgeText, { color: isPassed ? '#059669' : '#dc2626' }]}>
                        {isPassed ? 'Passed' : 'Failed'}
                    </Text>
                </View>
            </View>

            {/* Middle Section: Subject Wise Breakdown Row Listing */}
            <View style={styles.subjectContainer}>
                {Array.isArray(item.marks) && item.marks.map((sub, sIdx) => (
                    <View key={sub._id || sIdx} style={styles.subjectRow}>
                        <View style={styles.subLeft}>
                            <View style={styles.bulletPoint} />
                            <Text allowFontScaling={false} style={styles.subjectName}>
                                {sub.subjectId?.name || 'Subject'}
                            </Text>
                        </View>
                        <Text allowFontScaling={false} style={styles.subMarks}>
                            {sub.obtainedMarks} <Text style={styles.subTotalMarks}>/ {sub.totalMarks}</Text>
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.divider} />

            {/* Bottom Row Totals Aggregator Summary */}
            <View style={styles.cardBottom}>
                <View style={styles.metaItem}>
                    <Icon name="calendar" size={moderateScale(13)} color="#94a3b8" />
                    <Text allowFontScaling={false} style={styles.metaText}>{formattedDate}</Text>
                </View>

                <View style={styles.marksRow}>
                    <Text allowFontScaling={false} style={styles.totalLabel}>Total: </Text>
                    <Text allowFontScaling={false} style={styles.obtainedMarks}>{examObtainedMarks}</Text>
                    <Text allowFontScaling={false} style={styles.totalMarks}>/ {examTotalMarks}</Text>
                    <Text allowFontScaling={false} style={[styles.percentText, { color: isPassed ? '#059669' : '#dc2626' }]}>
                        ({percentage}%)
                    </Text>
                </View>
            </View>

        </Animated.View>
    );
};

// ─── Empty State Placeholder Component ────────────────────────────────────────
const EmptyState = ({ onRetry }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="clipboard" size={moderateScale(32)} color="#cbd5e1" />
        </View>

        <Text allowFontScaling={false} style={styles.emptyTitle}>
            No Results Available
        </Text>

        <Text allowFontScaling={false} style={styles.emptySubtitle}>
            No examination results have been found.{'\n'}
            Please check back later.
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

// ─── Main Screen Framework ───────────────────────────────────────────────────
const ExamResults = ({ navigation }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => { fetchResults(); }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await api.get('/exam/my-results');
            // Matching the safe unboxing format pattern for standard API models
            const list = res.isSuccess ? (res.data || []) : (Array.isArray(res) ? res : []);
            setResults(list);
        } catch {
            setModal({
                visible: true,
                title: 'Error',
                message: 'Failed to load exam results. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            showHeader={true}
            headerTitle="My Exam Results"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading results..." />}

            {!loading && results.length === 0 && (
                <EmptyState onRetry={fetchResults} />
            )}

            {!loading && results.length > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                >
                    {results.map((item, index) => (
                        <ExamResultCard key={item._id} item={item} index={index} />
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

// ─── Style sheets Specs ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
    scroll: {
        padding: scale(16),
        paddingBottom: verticalScale(24),
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        padding: scale(16),
        marginBottom: verticalScale(14),
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
        marginBottom: verticalScale(12),
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
    examName: {
        fontSize: moderateScale(14.5),
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: verticalScale(2),
    },
    className: {
        fontSize: moderateScale(11.5),
        color: '#64748b',
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
    
    // Subject Marks Grid Inside Box
    subjectContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: moderateScale(10),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(4),
        marginTop: verticalScale(4),
    },
    subjectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(8),
        borderBottomWidth: 0.5,
        borderBottomColor: '#e2e8f0',
    },
    subLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    bulletPoint: {
        width: scale(5),
        height: scale(5),
        borderRadius: scale(2.5),
        backgroundColor: BRAND,
    },
    subjectName: {
        fontSize: moderateScale(12.5),
        fontWeight: '600',
        color: '#334155',
    },
    subMarks: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: '#0f172a',
    },
    subTotalMarks: {
        fontSize: moderateScale(11),
        color: '#94a3b8',
        fontWeight: '500',
    },

    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: verticalScale(12),
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
        gap: scale(2),
    },
    totalLabel: {
        fontSize: moderateScale(12),
        color: '#64748b',
        fontWeight: '600',
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
        fontSize: moderateScale(12),
        fontWeight: '800',
        marginLeft: scale(4),
    },

    // Empty Wrapper Placeholders
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

export default ExamResults;