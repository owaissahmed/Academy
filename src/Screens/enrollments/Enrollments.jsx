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
import RoundLogo from '../../Images/new-logo-blue.png'

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

const RegistrationCard = ({ data, user }) => {
    const student = data?.studentId;
    const course = data?.item;
    console.log(data)
    console.log(user.data.userId)
    const admissionDate = new Date(data?.createdAt).toLocaleDateString('en-PK', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
        <View style={rc.card}>
            {/* Header */}
            <View style={rc.header}>
                <Text allowFontScaling={false} style={rc.headerSub}>Student Registration Card</Text>
                <Text allowFontScaling={false} style={rc.headerTitle}>Dars-e-Nizami</Text>

                <Image source={{ uri: user.data.profilePic }} style={rc.avatar} />


                <Text allowFontScaling={false} style={rc.name}>{user.data?.userId.name || 'Student'}</Text>
                <Text allowFontScaling={false} style={rc.fatherName}>
                    son/daughter of {user.data?.fatherName || '—'}
                </Text>
            </View>

            {/* Body */}
            <View style={rc.body}>
                <View style={rc.row2}>
                    <View style={rc.infoBox}>
                        <Text allowFontScaling={false} style={rc.infoLabel}>CLASS</Text>
                        <Text allowFontScaling={false} style={rc.infoValue}>{course?.name || '—'}</Text>
                    </View>
                    <View style={rc.infoBox}>
                        <Text allowFontScaling={false} style={rc.infoLabel}>REG ID</Text>
                        <Text allowFontScaling={false} style={rc.infoValue}>{data?.regId || '—'}</Text>
                    </View>
                </View>


                <View style={rc.phoneBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}>
                        <Text allowFontScaling={false} style={rc.phoneLabel}>PHONE</Text>
                    </View>
                    <Text allowFontScaling={false} style={rc.phoneValue}> {user.data?.phone || '—'}</Text>
                </View>


            </View>
            <View style={rc.admissionBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}>
                    <Icon name="check" size={moderateScale(13)} color="#10b981" />
                    <Text allowFontScaling={false} style={rc.admissionLabel}>ADMISSION DATE</Text>
                </View>
                <Text allowFontScaling={false} style={rc.admissionValue}>{admissionDate}</Text>
            </View>
            <Image
                source={RoundLogo}
                style={rc.monogram}
                resizeMode="contain"
            />
        </View>
    );
};

const rc = StyleSheet.create({
    monogram: {
        width: scale(160),
        height: scale(145),
        opacity: 0.05,
        position: 'absolute',
        top: '70%',
        left: '50%',
        marginTop: -scale(80),   // height/2
        marginLeft: -scale(80),  // width/2
    },
    card: { borderRadius: moderateScale(16), overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
    header: { backgroundColor: BRAND, padding: scale(16), alignItems: 'center' },
    headerSub: { fontSize: moderateScale(10), color: '#a8c4d4', letterSpacing: 1.2, marginBottom: verticalScale(2) },
    headerTitle: { fontSize: moderateScale(13), color: '#fff', marginBottom: verticalScale(14) },
    avatar: { width: scale(68), height: scale(68), borderRadius: scale(34), borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.25)', marginBottom: verticalScale(10) },
    avatarPlaceholder: { backgroundColor: '#4a7a96', alignItems: 'center', justifyContent: 'center' },
    name: { fontSize: moderateScale(17), fontWeight: '700', color: '#fff', marginBottom: verticalScale(2) },
    fatherName: { fontSize: moderateScale(12), color: '#a8c4d4' },
    body: { backgroundColor: '#fff', padding: scale(14), gap: verticalScale(10) },
    row2: { flexDirection: 'row', gap: scale(10) },
    infoBox: { flex: 1, backgroundColor: '#f8fafc', borderRadius: moderateScale(8), padding: scale(10) },
    fullBox: { flex: 0 },
    infoLabel: { fontSize: moderateScale(9.5), color: '#94a3b8', letterSpacing: 0.8, marginBottom: verticalScale(3) },
    infoValue: { fontSize: moderateScale(13), fontWeight: '600', color: '#0f172a' },
    phoneBox: {
        backgroundColor: '#f8fafc', borderRadius: moderateScale(8), padding: scale(10),
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    phoneLabel: { fontSize: moderateScale(10), color: '#94a3b8', letterSpacing: 0.8, fontWeight: '600' },
    phoneValue: { fontSize: moderateScale(13), fontWeight: '700', },
    admissionBox: {
        backgroundColor: BRAND, borderRadius: moderateScale(8), padding: scale(10),
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    admissionLabel: { fontSize: moderateScale(10), color: '#a8c4d4', letterSpacing: 0.8, fontWeight: '600' },
    admissionValue: { fontSize: moderateScale(13), fontWeight: '700', color: '#ffffff' },
});

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
const EnrollmentCard = ({ item, index, onScreenshotPress, navigation, onCardPress, isHighlighted, onLayout }) => {
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
    const Discount = item.discountAmount;
    return (
        <Animated.View
            onLayout={onLayout}
            style={[
                styles.card,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                isHighlighted && styles.cardHighlighted,
            ]}
        >

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
                {course?.fees &&
                    <View style={styles.infoItem}>
                        <Icon name="tag" size={moderateScale(12)} color="#94a3b8" />
                        <Text allowFontScaling={false} style={styles.infoText}>
                            Rs {(course?.fees - Discount).toLocaleString()}
                        </Text>
                    </View>
                }
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
                        Approved on {new Date(item.updatedAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Text>
                </View>
            )}
            {item.isActive == false && (
                <View style={styles.removedBox}>
                    <Icon name="x-circle" size={moderateScale(13)} color="#e05c5c" />
                    <Text allowFontScaling={false} style={styles.removedText}>
                        Removed By Admin
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
            {/* Normal Courses */}
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

            {/* Dars-e-Nizami Classes */}
            {isApproved && item?.itemModel === "DarseNizamiClass" && (
                <View style={{ flexDirection: 'row', gap: 10 }}>

                    <View style={{ flex: 1 }}>
                        <Button
                            label="Manage Fees"
                            icon="tag"
                            iconPosition="left"
                            variant="filled"
                            size="sm"
                            color="#10b981"
                            fullWidth
                            onPress={() =>
                                navigation.navigate("DarseNizamiFees", { data: item })
                            }
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Button
                            label="View Card"
                            icon="eye"
                            iconPosition="left"
                            variant="outline"
                            size="sm"
                            fullWidth
                            onPress={() => onCardPress(item)}
                        />
                    </View>

                </View>
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
const Enrollments = ({ navigation, route }) => {
    const [data, setData] = useState([]);
    const [userData, setuserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [screenshotModal, setScreenshotModal] = useState({ visible: false, uri: null });
    const [cardModal, setCardModal] = useState({ visible: false, data: null });
    const highlightId = route?.params?.id || null;
    const scrollRef = useRef(null);
    const itemPositions = useRef({});
    useEffect(() => { loadEnrollments(), loadProfile(); }, []);

    // Highlighted item load hone ke baad us tak scroll karo
    useEffect(() => {
        if (!highlightId || data.length === 0) return;
        const y = itemPositions.current[highlightId];
        if (y !== undefined && scrollRef.current) {
            setTimeout(() => {
                scrollRef.current.scrollTo({ y: Math.max(y - verticalScale(16), 0), animated: true });
            }, 300);
        }
    }, [highlightId, data]);

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

    const loadProfile = async () => {
        try {
            const res = await api.get('/students/profile');
            setuserData(res)
        } catch {
            console.log('failed to load profile')
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
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                >
                    <Text allowFontScaling={false} style={styles.resultCount}>
                        {filtered.length} enrollment{filtered.length !== 1 ? 's' : ''}
                    </Text>
                    {filtered.map((item, index) => (
                        <EnrollmentCard
                            navigation={navigation}
                            key={item._id}
                            item={item}
                            index={index}
                            isHighlighted={highlightId && item._id === highlightId}
                            onLayout={(e) => {
                                itemPositions.current[item._id] = e.nativeEvent.layout.y;
                            }}
                            onScreenshotPress={(uri) => setScreenshotModal({ visible: true, uri })}
                            onCardPress={(item) => setCardModal({ visible: true, data: item })}
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
            <AppModal
                visible={cardModal.visible}
                onClose={() => setCardModal({ visible: false, data: null })}
                title="Student Registration Card"
                closeOnBackdrop={true}
                modalStyle={{ width: '90%', paddingHorizontal: moderateScale(10), }}
                primaryBtn={{
                    label: 'Close',
                    onPress: () => setCardModal({ visible: false, data: null }),
                    variant: 'outline',
                }}
            >
                {cardModal.data && <RegistrationCard data={cardModal.data} user={userData} />}
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
    cardHighlighted: {
        borderColor: BRAND,
        borderWidth: 2,
        backgroundColor: '#f0f6fa',
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
    removedBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        backgroundColor: '#fee2e2',
        borderRadius: moderateScale(10),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        marginBottom: verticalScale(10),
    },
    removedText: {
        fontSize: moderateScale(12),
        color: '#e05c5c',
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