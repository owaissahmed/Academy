import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Image,
    Linking,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import { api } from '../../utlis/api';
import AppModal from '../../components/Appmodal';
const BRAND = '#2e4c60';

// ─── Filter tabs config ───────────────────────────────────────────────────────
const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
];

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
    pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7', icon: 'clock' },
    approved: { label: 'Approved', color: '#10b981', bg: '#d1fae5', icon: 'check-circle' },
    rejected: { label: 'Rejected', color: '#e05c5c', bg: '#fee2e2', icon: 'x-circle' },
};

// ─── Filter Tab ───────────────────────────────────────────────────────────────
const FilterTab = ({ tab, active, count, onPress }) => (
    <TouchableOpacity
        onPress={() => onPress(tab.key)}
        activeOpacity={0.75}
        style={[styles.filterTab, active && styles.filterTabActive]}
    >
        <Text allowFontScaling={false} style={[styles.filterLabel, active && styles.filterLabelActive]}>
            {tab.label}
        </Text>
    </TouchableOpacity>
);

// ─── Enrollment Card ──────────────────────────────────────────────────────────
const EnrollmentCard = ({ item, index, onScreenshotPress }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 320, delay: index * 70, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, delay: index * 70, tension: 70, friction: 9, useNativeDriver: true }),
        ]).start();
    }, []);

    const s = STATUS[item.status] || STATUS.pending;
    const course = item.item;
    const isApproved = item.status === 'approved';
    const isRejected = item.status === 'rejected';
    const Type = item.enrollmentType;

    return (
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

            {/* ── Top: course name + status badge ── */}
            <View style={styles.cardTop}>
                <View style={styles.cardTitleWrap}>
                    <View style={styles.cardIconCircle}>
                        <Icon name="book-open" size={moderateScale(15)} color={BRAND} />
                    </View>
                    <Text allowFontScaling={false} style={styles.cardTitle} numberOfLines={1}>
                        {course?.name}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                    <Icon name={s.icon} size={moderateScale(11)} color={s.color} />
                    <Text allowFontScaling={false} style={[styles.statusText, { color: s.color }]}>
                        {s.label}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* ── Course info row ── */}
            <View style={styles.infoRow}>
                {course?.videos &&
                    <View style={styles.infoItem}>
                        <Icon name="video" size={moderateScale(12)} color="#94a3b8" />
                        <Text allowFontScaling={false} style={styles.infoText}>{course?.videos} Videos</Text>
                    </View>
                }
                {/* <View style={styles.infoItem}>
                    <Icon name="type" size={moderateScale(12)} color="#94a3b8" />
                    <Text allowFontScaling={false} style={styles.infoText}>{Type} Videos</Text>
                </View> */}
                <View style={styles.infoItem}>
                    <Icon name="tag" size={moderateScale(12)} color="#94a3b8" />
                    <Text allowFontScaling={false} style={styles.infoText}>
                        Rs {course?.fees?.toLocaleString()}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Icon name="calendar" size={moderateScale(12)} color="#94a3b8" />
                    <Text allowFontScaling={false} style={styles.infoText}>
                        {new Date(item.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Text>
                </View>
            </View>

            {/* ── Rejection reason ── */}
            {isRejected && item.rejectionReason && (
                <View style={styles.rejectionBox}>
                    <Icon name="alert-circle" size={moderateScale(13)} color="#e05c5c" />
                    <Text allowFontScaling={false} style={styles.rejectionText}>
                        {item.rejectionReason}
                    </Text>
                </View>
            )}

            {/* ── Approved: access link + approved date ── */}
            {isApproved && (
                <View style={styles.approvedBox}>
                    <Icon name="check-circle" size={moderateScale(13)} color="#10b981" />
                    <Text allowFontScaling={false} style={styles.approvedText}>
                        Approved on {new Date(item.approvedAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Text>
                </View>
            )}

            {/* ── Payment screenshot thumbnail — click pe modal ── */}
            {item.paymentScreenshot && (
                <TouchableOpacity
                    style={styles.screenshotRow}
                    onPress={() => onScreenshotPress(item.paymentScreenshot)}
                    activeOpacity={0.8}
                >
                    <Image
                        source={{ uri: item.paymentScreenshot }}
                        style={styles.screenshotThumb}
                        resizeMode="cover"
                    />
                    <View style={styles.screenshotInfo}>
                        <Text allowFontScaling={false} style={styles.screenshotLabel}>Payment Screenshot</Text>
                        <Text allowFontScaling={false} style={styles.screenshotSub}>Tap to view full image</Text>
                    </View>
                    <Icon name="eye" size={moderateScale(15)} color="#94a3b8" />
                </TouchableOpacity>
            )}

            {/* ── Action buttons — sirf approved walo ko Start Course ── */}
            {isApproved && course?.accessLink && (
                <Button
                    label="Start Course"
                    icon="play"
                    iconPosition="left"
                    variant="filled"
                    size="sm"
                    color="#10b981"
                    fullWidth
                    onPress={() => Linking.openURL(course.accessLink)}
                />
            )}

        </Animated.View>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ filter }) => {
    const messages = {
        all: { icon: 'inbox', title: 'No Enrollments Yet', sub: 'Browse courses and apply to get started.' },
        pending: { icon: 'clock', title: 'No Pending Enrollments', sub: 'All caught up!' },
        approved: { icon: 'award', title: 'No Approved Courses', sub: 'Your approvals will appear here.' },
        rejected: { icon: 'x-circle', title: 'No Rejections', sub: "You're all good!" },
    };
    const m = messages[filter] || messages.all;
    return (
        <View style={styles.emptyWrap}>
            <View style={styles.emptyIconCircle}>
                <Icon name={m.icon} size={moderateScale(30)} color="#cbd5e1" />
            </View>
            <Text allowFontScaling={false} style={styles.emptyTitle}>{m.title}</Text>
            <Text allowFontScaling={false} style={styles.emptySub}>{m.sub}</Text>
        </View>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Enrollments = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [screenshotModal, setScreenshotModal] = useState({ visible: false, uri: null });

    useEffect(() => { loadEnrollments(); }, []);

    const loadEnrollments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/enrollments/my-enrollments');
            console.log(response)
            const finalData = response?.data || [];
            setData(finalData);
            console.log(finalData)
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // ─── Filter logic ─────────────────────────────────────────────────────────
    const filtered = activeFilter === 'all'
        ? data
        : data.filter(e => e.status === activeFilter);

    // Count per filter
    const counts = FILTERS.reduce((acc, f) => {
        acc[f.key] = f.key === 'all' ? data.length : data.filter(e => e.status === f.key).length;
        return acc;
    }, {});

    return (
        <Container
            showHeader={true}
            headerTitle="My Enrollments"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {/* ── Filter Tabs ──────────────────────────────────────────── */}
            {!loading && (
                <View style={styles.filterWrap}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}
                    >
                        {FILTERS.map(tab => (
                            <FilterTab
                                key={tab.key}
                                tab={tab}
                                active={activeFilter === tab.key}
                                count={counts[tab.key]}
                                onPress={setActiveFilter}
                            />
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* ── Loader ───────────────────────────────────────────────── */}
            {loading && <Loader message="Loading enrollments..." />}

            {/* ── Empty ────────────────────────────────────────────────── */}
            {!loading && filtered.length === 0 && <EmptyState filter={activeFilter} />}

            {/* ── List ─────────────────────────────────────────────────── */}
            {!loading && filtered.length > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                >
                    <Text allowFontScaling={false} style={styles.resultCount}>
                        {filtered.length} enrollment{filtered.length !== 1 ? 's' : ''}
                    </Text>
                    {filtered.map((item, index) => (
                        <EnrollmentCard
                            key={item._id}
                            item={item}
                            index={index}
                            onScreenshotPress={(uri) => setScreenshotModal({ visible: true, uri })}
                        />
                    ))}
                </ScrollView>
            )}
            {/* ── Screenshot Modal ── */}
            <AppModal
                visible={screenshotModal.visible}
                onClose={() => setScreenshotModal({ visible: false, uri: null })}
                title="Payment Screenshot"
                closeOnBackdrop={true}
                primaryBtn={{
                    label: 'Close',
                    onPress: () => setScreenshotModal({ visible: false, uri: null }),
                    variant: 'outline',
                }}
            >
                {screenshotModal.uri && (
                    <Image
                        source={{ uri: screenshotModal.uri }}
                        style={screenshotStyles.fullImg}
                        resizeMode="contain"
                    />
                )}
            </AppModal>

        </Container>
    );
};

const screenshotStyles = StyleSheet.create({
    fullImg: {
        width: '100%',
        height: 280,
        borderRadius: moderateScale(12),
        backgroundColor: '#f1f5f9',
    },
});

const styles = StyleSheet.create({
    // ── Filter bar ──
    filterWrap: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    filterScroll: {
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(10),
        gap: scale(8),
        flexDirection: 'row',
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(7),
        borderRadius: moderateScale(20),
        backgroundColor: '#f1f5f9',
    },
    filterTabActive: {
        backgroundColor: BRAND,
    },
    filterLabel: {
        fontSize: moderateScale(12.5),
        fontWeight: '600',
        color: '#64748b',
    },
    filterLabelActive: {
        color: '#ffffff',
    },
    filterBadge: {
        backgroundColor: '#e2e8f0',
        borderRadius: scale(10),
        paddingHorizontal: scale(6),
        paddingVertical: verticalScale(1),
    },
    filterBadgeActive: {
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    filterBadgeText: {
        fontSize: moderateScale(10),
        fontWeight: '700',
        color: '#64748b',
    },
    filterBadgeTextActive: {
        color: '#ffffff',
    },

    // ── List ──
    scroll: {
        padding: scale(16),
        paddingBottom: verticalScale(28),
    },
    resultCount: {
        fontSize: moderateScale(12),
        color: '#94a3b8',
        fontWeight: '600',
        marginBottom: verticalScale(10),
    },

    // ── Card ──
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    cardTitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: scale(9),
        marginRight: scale(8),
    },
    cardIconCircle: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: '#0f172a',
        flex: 1,
    },

    // Status badge
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        paddingHorizontal: scale(9),
        paddingVertical: verticalScale(4),
        borderRadius: moderateScale(20),
    },
    statusText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
    },

    divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: verticalScale(10) },

    // Info row
    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(12),
        marginBottom: verticalScale(10),
    },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: scale(4) },
    infoText: { fontSize: moderateScale(11.5), color: '#64748b', fontWeight: '500' },

    // Rejection box
    rejectionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        backgroundColor: '#fee2e2',
        borderRadius: moderateScale(10),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        marginBottom: verticalScale(10),
    },
    rejectionText: {
        fontSize: moderateScale(12),
        color: '#e05c5c',
        fontWeight: '600',
        flex: 1,
    },

    // Approved box
    approvedBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        backgroundColor: '#d1fae5',
        borderRadius: moderateScale(10),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        marginBottom: verticalScale(10),
    },
    approvedText: {
        fontSize: moderateScale(12),
        color: '#10b981',
        fontWeight: '600',
    },

    // Screenshot
    screenshotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        backgroundColor: '#f8fafc',
        borderRadius: moderateScale(10),
        padding: scale(10),
        marginBottom: verticalScale(10),
        borderWidth: 1,
        borderColor: '#e8edf2',
    },
    screenshotThumb: {
        width: scale(46),
        height: scale(46),
        borderRadius: moderateScale(8),
        backgroundColor: '#e2e8f0',
    },
    screenshotLabel: { fontSize: moderateScale(12), fontWeight: '600', color: '#334155' },
    screenshotSub: { fontSize: moderateScale(11), color: '#94a3b8', marginTop: verticalScale(2) },

    // Card buttons
    cardBtnRow: {
        flexDirection: 'row',
        gap: scale(8),
        alignItems: 'center',
    },
    accessBtnFlex: {
        flex: 1,
    },

    // ── Empty ──
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: verticalScale(10),
        paddingHorizontal: scale(32),
    },
    emptyIconCircle: {
        width: scale(68),
        height: scale(68),
        borderRadius: scale(34),
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(4),
    },
    emptyTitle: { fontSize: moderateScale(15), fontWeight: '800', color: '#334155' },
    emptySub: { fontSize: moderateScale(12.5), color: '#94a3b8', textAlign: 'center', lineHeight: moderateScale(19) },
});

export default Enrollments;