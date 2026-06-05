import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Linking,
    Image,
    BackHandler,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import Container from '../components/Container';
import Loader from '../components/Loader';
import BottomSheet from '../components/Bottomsheet';
import AppModal from '../components/Appmodal';
import { api } from '../utlis/api';
const BRAND = '#2e4c60';

// ─── Info Pill ────────────────────────────────────────────────────────────────
const Pill = ({ icon, label }) => (
    <View style={styles.pill}>
        <Icon name={icon} size={moderateScale(11)} color="#64748b" />
        <Text allowFontScaling={false} style={styles.pillText}>{label}</Text>
    </View>
);

// ─── Single Course Card ───────────────────────────────────────────────────────
const CourseCard = ({ course, index, onEnroll }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, delay: index * 80, tension: 70, friction: 9, useNativeDriver: true }),
        ]).start();
    }, []);

    const startDate = course.startingDate
        ? new Date(course.startingDate).toLocaleDateString('en-PK', {
            day: 'numeric', month: 'short', year: 'numeric',
        })
        : '—';

    return (
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

            {/* Top row */}
            <View style={styles.cardTop}>
                <View style={styles.cardTitleWrap}>
                    <View style={styles.cardIconCircle}>
                        <Icon name="book-open" size={moderateScale(16)} color={BRAND} />
                    </View>
                    <Text allowFontScaling={false} style={styles.cardTitle}>{course.name}</Text>
                </View>
                <View style={styles.feesBadge}>
                    <Text allowFontScaling={false} style={styles.feesText}>
                        Rs {course.fees?.toLocaleString()}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.pillsRow}>
                <Pill icon="clock" label={course.duration} />
                <Pill icon="watch" label={course.timings} />
                <Pill icon="users" label={course.gender} />
                <Pill icon="calendar" label={`Starts ${startDate}`} />
                <Pill
                    icon="repeat"
                    label={course.days?.length > 0
                        ? course.days.map(day => day.substring(0, 3)).join(', ')
                        : 'No Days'
                    }
                />
            </View>

            <View style={styles.divider} />

            {/* Enroll button */}
            <TouchableOpacity
                style={styles.enrollBtn}
                onPress={() => onEnroll(course)}
                activeOpacity={0.85}
            >
                <Text allowFontScaling={false} style={styles.enrollBtnText}>Enroll Now</Text>
                <Icon name="arrow-right" size={moderateScale(14)} color="#fff" />
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
        <Text allowFontScaling={false} style={styles.emptyTitle}>No Upcoming Courses</Text>
        <Text allowFontScaling={false} style={styles.emptySubtitle}>
            Abhi koi upcoming course nahi hai.{'\n'}Baad mein dobara check karein.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
            <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
            <Text allowFontScaling={false} style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const UpcomingCourses = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sheetVisible, setSheetVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [screenshot, setScreenshot] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [modal, setModal] = useState({
        visible: false, type: 'success', title: '', message: '', onPrimary: null,
    });

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    // Block back while submitting
    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => submitting || false);
        return () => sub.remove();
    }, [submitting]);

    useEffect(() => { loadCourses(); }, []);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const res = await api.get('/upcoming-courses/all');
            const list = Array.isArray(res) ? res : (res.data || []);
            setData(list);
        } catch {
            setModal({
                visible: true, type: 'error',
                title: 'Error', message: 'Failed to load courses. Please try again.',
                onPrimary: closeModal,
            });
        } finally {
            setLoading(false);
        }
    };

    // ─── Enroll press ─────────────────────────────────────────────────────────
    const handleEnroll = (course) => {
        setSelectedCourse(course);
        setScreenshot(null);
        setSheetVisible(true);
    };

    const closeSheet = () => {
        if (submitting) return;
        setSheetVisible(false);
        setSelectedCourse(null);
        setScreenshot(null);
    };

    // ─── Pick screenshot ──────────────────────────────────────────────────────
    const pickScreenshot = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.85, maxWidth: 1200, maxHeight: 1200, selectionLimit: 1 },
            (response) => {
                if (response.didCancel || response.errorCode) return;
                const asset = response.assets?.[0];
                if (asset) {
                    setScreenshot({
                        uri: asset.uri,
                        name: asset.fileName || `payment_${Date.now()}.jpg`,
                        type: asset.type || 'image/jpeg',
                    });
                }
            }
        );
    };

    // ─── Submit enrollment ────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!screenshot) {
            setModal({
                visible: true, type: 'warning',
                title: 'Required', message: 'Please attach payment screenshot.',
                onPrimary: closeModal,
            });
            return;
        }
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('item', selectedCourse._id);
            formData.append('itemModel', 'UpcomingCourse');
            formData.append('enrollmentType', 'upcoming-course');
            formData.append('paymentScreenshot', {
                uri: screenshot.uri,
                name: screenshot.name,
                type: screenshot.type,
            });

            const res = await api.postFormData('/enrollments/enroll', formData);

            if (res.isSuccess) {
                closeSheet();
                setModal({
                    visible: true, type: 'success',
                    title: 'Enrolled!',
                    message: res.message,
                    onPrimary: closeModal,
                });
            } else {
                setModal({
                    visible: true, type: 'error',
                    title: 'Failed', message: res.message || 'Enrollment failed.',
                    onPrimary: closeModal,
                });
            }
        } catch (err) {
            setModal({
                visible: true, type: 'error',
                title: 'Error', message: err.message || 'Something went wrong',
                onPrimary: closeModal,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const startDate = selectedCourse?.startingDate
        ? new Date(selectedCourse.startingDate).toLocaleDateString('en-PK', {
            day: 'numeric', month: 'short', year: 'numeric',
        })
        : '—';

    return (
        <Container
            showHeader={true}
            headerTitle="Upcoming Courses"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading courses..." />}

            {!loading && data.length === 0 && <EmptyState onRetry={loadCourses} />}

            {!loading && data.length > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                >
                    {data.map((course, index) => (
                        <CourseCard
                            key={course._id}
                            course={course}
                            index={index}
                            onEnroll={handleEnroll}
                        />
                    ))}
                </ScrollView>
            )}

            {/* ── Enrollment Bottom Sheet ───────────────────────────────── */}
            <BottomSheet
                visible={sheetVisible}
                onClose={closeSheet}
                title="Enroll in Course"
                heightPercent={0.82}
                scrollable={true}
                primaryBtn={{
                    label: 'Submit',
                    onPress: handleSubmit,
                    loading: submitting,
                    icon: submitting ? undefined : 'send',
                    disabled: !screenshot || submitting,
                }}
                secondaryBtn={{
                    label: 'Cancel',
                    onPress: closeSheet,
                    disabled: submitting,
                }}
            >
                {selectedCourse && (
                    <View style={styles.sheetContent}>

                        {/* ── Course info card ──────────────────────── */}
                        <View style={styles.courseInfoCard}>
                            <View style={styles.courseInfoTop}>
                                <View style={styles.courseInfoIcon}>
                                    <Icon name="book-open" size={moderateScale(18)} color={BRAND} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text allowFontScaling={false} style={styles.courseInfoName}>
                                        {selectedCourse.name}
                                    </Text>
                                    <Text allowFontScaling={false} style={styles.courseInfoSub}>
                                        {selectedCourse.duration}  •  Starts {startDate}
                                    </Text>
                                </View>
                                <View>
                                    <Text allowFontScaling={false} style={styles.courseInfoFees}>
                                        Rs {selectedCourse.fees?.toLocaleString()}
                                    </Text>
                                </View>
                            </View>

                            {/* extra details */}
                            <View style={styles.sheetPillsRow}>
                                <Pill icon="watch" label={selectedCourse.timings} />
                                <Pill icon="users" label={selectedCourse.gender} />
                                <Pill
                                    icon="repeat"
                                    label={selectedCourse.days?.length > 0
                                        ? selectedCourse.days.map(day => day.substring(0, 3)).join(', ')
                                        : 'No Days'
                                    }
                                />
                            </View>
                        </View>

                        {/* ── Payment instructions ───────────────────── */}
                        <View style={styles.instructionCard}>
                            <View style={styles.instructionHeader}>
                                <Icon name="info" size={moderateScale(14)} color={BRAND} />
                                <Text allowFontScaling={false} style={styles.instructionTitle}>
                                    Payment Instructions
                                </Text>
                            </View>
                            <Text allowFontScaling={false} style={styles.instructionText}>
                                1. Send{' '}
                                <Text style={styles.bold}>
                                    Rs {selectedCourse.fees?.toLocaleString()}
                                </Text>{' '}
                                to our account
                            </Text>
                            <Text allowFontScaling={false} style={styles.instructionText}>
                                2. Take a screenshot of the payment
                            </Text>
                            <Text allowFontScaling={false} style={styles.instructionText}>
                                3. Upload screenshot below and submit
                            </Text>
                        </View>

                        {/* ── Screenshot picker ─────────────────────── */}
                        <Text allowFontScaling={false} style={styles.pickerLabel}>
                            Payment Screenshot <Text style={styles.required}>*</Text>
                        </Text>

                        <TouchableOpacity
                            style={[styles.pickerBox, screenshot && styles.pickerBoxFilled]}
                            onPress={pickScreenshot}
                            activeOpacity={0.8}
                            disabled={submitting}
                        >
                            {screenshot ? (
                                <View style={styles.previewWrap}>
                                    <Image
                                        source={{ uri: screenshot.uri }}
                                        style={styles.previewImg}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.previewOverlay}>
                                        <Icon name="edit-2" size={moderateScale(16)} color="#fff" />
                                        <Text allowFontScaling={false} style={styles.previewChangeText}>
                                            Change
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.pickerPlaceholder}>
                                    <View style={styles.pickerIconCircle}>
                                        <Icon name="upload" size={moderateScale(24)} color={BRAND} />
                                    </View>
                                    <Text allowFontScaling={false} style={styles.pickerTitle}>
                                        Tap to upload screenshot
                                    </Text>
                                    <Text allowFontScaling={false} style={styles.pickerSub}>
                                        JPG, PNG accepted
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {screenshot && (
                            <View style={styles.attachedRow}>
                                <Icon name="check-circle" size={moderateScale(14)} color="#10b981" />
                                <Text allowFontScaling={false} style={styles.attachedText}>
                                    Screenshot attached
                                </Text>
                            </View>
                        )}

                        {submitting && (
                            <View style={styles.submittingRow}>
                                <Loader message="Submitting enrollment..." />
                            </View>
                        )}

                    </View>
                )}
            </BottomSheet>

            {/* ── AppModal ─────────────────────────────────────────────── */}
            <AppModal
                visible={modal.visible}
                onClose={modal.type === 'success' ? undefined : closeModal}
                closeOnBackdrop={modal.type !== 'success'}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryBtn={{
                    label: 'OK',
                    onPress: modal.onPrimary || closeModal,
                }}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    scroll: { padding: scale(16), paddingBottom: verticalScale(24) },

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
    cardTitleWrap: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: scale(10) },
    cardIconCircle: {
        width: scale(34), height: scale(34), borderRadius: scale(17),
        backgroundColor: '#e8f0f5', alignItems: 'center', justifyContent: 'center',
    },
    cardTitle: { fontSize: moderateScale(15), fontWeight: '700', color: '#0f172a', flex: 1 },
    feesBadge: {
        backgroundColor: '#e8f0f5', borderRadius: moderateScale(20),
        paddingHorizontal: scale(10), paddingVertical: verticalScale(4),
    },
    feesText: { fontSize: moderateScale(12), fontWeight: '700', color: BRAND },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: verticalScale(10) },

    // Pills
    pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(6) },
    pill: {
        flexDirection: 'row', alignItems: 'center', gap: scale(4),
        backgroundColor: '#f8fafc', borderRadius: moderateScale(20),
        paddingHorizontal: scale(8), paddingVertical: verticalScale(4),
        borderWidth: 1, borderColor: '#e8edf2',
    },
    pillText: { fontSize: moderateScale(11), color: '#64748b', fontWeight: '500' },

    // Enroll button
    enrollBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: verticalScale(11), borderRadius: moderateScale(12),
        backgroundColor: BRAND, gap: scale(6),
        shadowColor: BRAND, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
    },
    enrollBtnText: { fontSize: moderateScale(13), fontWeight: '700', color: '#ffffff' },

    // ── Empty ──
    emptyWrap: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: scale(32), gap: verticalScale(10),
    },
    emptyIconCircle: {
        width: scale(72), height: scale(72), borderRadius: scale(36),
        backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center',
        marginBottom: verticalScale(4),
    },
    emptyTitle: { fontSize: moderateScale(16), fontWeight: '800', color: '#334155' },
    emptySubtitle: { fontSize: moderateScale(12.5), color: '#94a3b8', textAlign: 'center', lineHeight: moderateScale(19) },
    retryBtn: {
        flexDirection: 'row', alignItems: 'center', gap: scale(6),
        marginTop: verticalScale(8), paddingVertical: verticalScale(9),
        paddingHorizontal: scale(20), borderRadius: moderateScale(20),
        borderWidth: 1.5, borderColor: BRAND,
    },
    retryText: { fontSize: moderateScale(13), fontWeight: '700', color: BRAND },

    // ── Sheet content ──
    sheetContent: { paddingBottom: verticalScale(8) },

    courseInfoCard: {
        backgroundColor: '#f0f6fa', borderRadius: moderateScale(14),
        padding: scale(14), marginBottom: verticalScale(14),
        borderWidth: 1, borderColor: '#d4e4ef',
    },
    courseInfoTop: { flexDirection: 'row', alignItems: 'center', gap: scale(12), marginBottom: verticalScale(10) },
    courseInfoIcon: {
        width: scale(40), height: scale(40), borderRadius: scale(20),
        backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    },
    courseInfoName: { fontSize: moderateScale(14), fontWeight: '700', color: '#0f172a' },
    courseInfoSub: { fontSize: moderateScale(11), color: '#64748b', marginTop: verticalScale(2) },
    courseInfoFees: { fontSize: moderateScale(15), fontWeight: '800', color: BRAND },
    sheetPillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(6), marginTop: verticalScale(4) },

    instructionCard: {
        backgroundColor: '#fff', borderRadius: moderateScale(12),
        padding: scale(14), marginBottom: verticalScale(18),
        borderWidth: 1, borderColor: '#e8edf2', gap: verticalScale(5),
    },
    instructionHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(6), marginBottom: verticalScale(4) },
    instructionTitle: { fontSize: moderateScale(13), fontWeight: '700', color: BRAND },
    instructionText: { fontSize: moderateScale(12), color: '#475569', lineHeight: moderateScale(18) },
    bold: { fontWeight: '700', color: '#0f172a' },

    pickerLabel: { fontSize: moderateScale(13), fontWeight: '600', color: '#334155', marginBottom: verticalScale(8) },
    required: { color: '#e05c5c' },
    pickerBox: {
        borderWidth: 2, borderColor: '#dde3ea', borderStyle: 'dashed',
        borderRadius: moderateScale(14), height: verticalScale(140),
        overflow: 'hidden', backgroundColor: '#fafbfc', marginBottom: verticalScale(8),
    },
    pickerBoxFilled: { borderStyle: 'solid', borderColor: '#10b981' },
    pickerPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: verticalScale(8) },
    pickerIconCircle: {
        width: scale(52), height: scale(52), borderRadius: scale(26),
        backgroundColor: '#e8f0f5', alignItems: 'center', justifyContent: 'center',
    },
    pickerTitle: { fontSize: moderateScale(13), fontWeight: '600', color: '#334155' },
    pickerSub: { fontSize: moderateScale(11), color: '#94a3b8' },
    previewWrap: { flex: 1 },
    previewImg: { width: '100%', height: '100%' },
    previewOverlay: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: 'row',
        justifyContent: 'center', alignItems: 'center',
        paddingVertical: verticalScale(8), gap: scale(6),
    },
    previewChangeText: { color: '#fff', fontSize: moderateScale(12), fontWeight: '600' },
    attachedRow: { flexDirection: 'row', alignItems: 'center', gap: scale(6), marginBottom: verticalScale(4) },
    attachedText: { fontSize: moderateScale(12), color: '#10b981', fontWeight: '600' },
    submittingRow: { marginTop: verticalScale(16), height: verticalScale(80) },
});

export default UpcomingCourses;