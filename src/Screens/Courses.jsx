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
    Clipboard,
    BackHandler,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import Container from '../components/Container';
import Loader from '../components/Loader';
import BottomSheet from '../components/Bottomsheet';
import Button from '../components/Button';
import AppModal from '../components/Appmodal';
import { api } from '../utlis/api';

const BRAND = '#2e4c60';
const ACCOUNT_NUMBER = '0312-3456789';

// ─── Single Course Card ───────────────────────────────────────────────────────
const CourseCard = ({ course, index, onApply }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, delay: index * 80, tension: 70, friction: 9, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
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

            <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                    <Icon name="video" size={moderateScale(13)} color="#64748b" />
                    <Text allowFontScaling={false} style={styles.infoText}>{course.videos} Videos</Text>
                </View>
                <View style={styles.infoItem}>
                    <Icon name="check-circle" size={moderateScale(13)} color="#10b981" />
                    <Text allowFontScaling={false} style={[styles.infoText, { color: '#10b981' }]}>Available</Text>
                </View>
            </View>

            <View style={styles.btnRow}>
                <TouchableOpacity
                    style={styles.demoBtn}
                    onPress={() => course.demoLink && Linking.openURL(course.demoLink)}
                    activeOpacity={0.8}
                >
                    <Icon name="play-circle" size={moderateScale(14)} color={BRAND} />
                    <Text allowFontScaling={false} style={styles.demoBtnText}>Demo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => onApply(course)}
                    activeOpacity={0.85}
                >
                    <Text allowFontScaling={false} style={styles.applyBtnText}>Apply Now</Text>
                    <Icon name="arrow-right" size={moderateScale(14)} color="#fff" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onRetry }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="inbox" size={moderateScale(32)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>No Courses Found</Text>
        <Text allowFontScaling={false} style={styles.emptySubtitle}>
            No courses available right now.{'\n'}Please check back later.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
            <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
            <Text allowFontScaling={false} style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Courses = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [sheetVisible, setSheetVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [screenshot, setScreenshot] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);

    // ─── Modal state ──────────────────────────────────────────────────────────
    const [modal, setModal] = useState({
        visible: false,
        type: 'info',
        title: '',
        message: '',
    });

    const showModal = (type, title, message) => {
        setModal({ visible: true, type, title, message });
    };

    const closeModal = () => {
        setModal(prev => ({ ...prev, visible: false }));
    };

    // ─── Block back press while submitting ───────────────────────────────────
    useEffect(() => {
        const onBackPress = () => {
            if (submitting) return true;
            return false;
        };
        const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => sub.remove();
    }, [submitting]);

    useEffect(() => { loadCourses(); }, []);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/courses/all-courses');
            const finalData = Array.isArray(response) ? response : (response.data || []);
            setData(finalData);
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = (course) => {
        setSelectedCourse(course);
        setScreenshot(null);
        setCopied(false);
        setSheetVisible(true);
    };

    const closeSheet = () => {
        if (submitting) return;
        setSheetVisible(false);
        setSelectedCourse(null);
        setScreenshot(null);
        setCopied(false);
    };

    const handleCopy = () => {
        Clipboard.setString(ACCOUNT_NUMBER);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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

    const handleSubmit = async () => {
        if (!screenshot) {
            showModal('warning', 'Required', 'Please attach payment screenshot');
            return;
        }
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('item', selectedCourse._id);
            formData.append('itemModel', 'Course');
            formData.append('enrollmentType', 'course');
            formData.append('paymentScreenshot', {
                uri: screenshot.uri,
                name: screenshot.name,
                type: screenshot.type,
            });
            console.log(formData)
            const response = await api.postFormData('/enrollments/enroll', formData);
            console.log(response)
            if (response.isSuccess) {
                setSheetVisible(false);
                setSelectedCourse(null);
                setScreenshot(null);
                setCopied(false);
                showModal(
                    'success',
                    'Enrolled!',
                    response.message,
                );
            } else {
                console.log(response.message)

                showModal('error', 'Failed', response.message || 'Enrollment failed');
            }
        } catch (err) {
            console.log(err)
            showModal(
                'error',
                'Error',
                err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container
            showHeader={true}
            headerTitle="Short Courses"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading courses..." />}
            {!loading && data.length === 0 && <EmptyState onRetry={loadCourses} />}

            {!loading && data.length > 0 && (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                    <View style={styles.countRow} />
                    {data.map((course, index) => (
                        <CourseCard key={course._id} course={course} index={index} onApply={handleApply} />
                    ))}
                </ScrollView>
            )}

            {/* ── Enrollment Bottom Sheet ───────────────────────────────── */}
            <BottomSheet
                visible={sheetVisible}
                onClose={closeSheet}
                title="Enroll in Course"
                heightPercent={0.78}
                scrollable={true}
                primaryBtn={{
                    label: submitting ? '' : 'Submit',
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
                                        {selectedCourse.videos} Videos
                                    </Text>
                                </View>
                                <View style={styles.courseInfoFees}>
                                    <Text allowFontScaling={false} style={styles.courseInfoFeesText}>
                                        Rs {selectedCourse.fees?.toLocaleString()}
                                    </Text>
                                </View>
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
                                to our Jazzcash/Easypaisa account
                            </Text>

                            <View style={styles.accountRow}>
                                <Icon name="credit-card" size={moderateScale(13)} color={BRAND} />
                                <Text allowFontScaling={false} style={styles.accountNumber}>
                                    {ACCOUNT_NUMBER}
                                </Text>
                                <TouchableOpacity
                                    onPress={handleCopy}
                                    style={styles.copyBtn}
                                    activeOpacity={0.7}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Icon
                                        name={copied ? 'check' : 'copy'}
                                        size={moderateScale(13)}
                                        color={copied ? '#10b981' : BRAND}
                                    />
                                    <Text
                                        allowFontScaling={false}
                                        style={[styles.copyText, copied && styles.copyTextDone]}
                                    >
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

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

            {/* ── AppModal (Alert replacement) ─────────────────────────── */}
            <AppModal
                visible={modal.visible}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={closeModal}
                closeOnBackdrop={true}
                primaryBtn={{
                    label: 'OK',
                    onPress: closeModal,
                }}
            />

        </Container>
    );
};

const styles = StyleSheet.create({
    scroll: { padding: scale(16), paddingBottom: verticalScale(24) },
    countRow: { marginBottom: verticalScale(12) },

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
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(10) },
    cardTitleWrap: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: scale(10) },
    cardIconCircle: { width: scale(34), height: scale(34), borderRadius: scale(17), backgroundColor: '#e8f0f5', alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontSize: moderateScale(15), fontWeight: '700', color: '#0f172a', flex: 1 },
    feesBadge: { backgroundColor: '#e8f0f5', borderRadius: moderateScale(20), paddingHorizontal: scale(10), paddingVertical: verticalScale(4) },
    feesText: { fontSize: moderateScale(12), fontWeight: '700', color: BRAND },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: verticalScale(10) },
    infoRow: { flexDirection: 'row', gap: scale(16), marginBottom: verticalScale(14) },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: scale(5) },
    infoText: { fontSize: moderateScale(12), color: '#64748b', fontWeight: '500' },
    btnRow: { flexDirection: 'row', gap: scale(10) },
    demoBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(10), borderRadius: moderateScale(12), borderWidth: 1.5, borderColor: BRAND, gap: scale(6) },
    demoBtnText: { fontSize: moderateScale(13), fontWeight: '700', color: BRAND },
    applyBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(10), borderRadius: moderateScale(12), backgroundColor: BRAND, gap: scale(6), shadowColor: BRAND, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
    applyBtnText: { fontSize: moderateScale(13), fontWeight: '700', color: '#ffffff' },

    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: scale(32), gap: verticalScale(10) },
    emptyIconCircle: { width: scale(72), height: scale(72), borderRadius: scale(36), backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginBottom: verticalScale(4) },
    emptyTitle: { fontSize: moderateScale(16), fontWeight: '800', color: '#334155' },
    emptySubtitle: { fontSize: moderateScale(12.5), color: '#94a3b8', textAlign: 'center', lineHeight: moderateScale(19) },
    retryBtn: { flexDirection: 'row', alignItems: 'center', gap: scale(6), marginTop: verticalScale(8), paddingVertical: verticalScale(9), paddingHorizontal: scale(20), borderRadius: moderateScale(20), borderWidth: 1.5, borderColor: BRAND },
    retryText: { fontSize: moderateScale(13), fontWeight: '700', color: BRAND },

    sheetContent: { paddingBottom: verticalScale(8) },
    courseInfoCard: { backgroundColor: '#f0f6fa', borderRadius: moderateScale(14), padding: scale(14), marginBottom: verticalScale(14), borderWidth: 1, borderColor: '#d4e4ef' },
    courseInfoTop: { flexDirection: 'row', alignItems: 'center', gap: scale(12) },
    courseInfoIcon: { width: scale(40), height: scale(40), borderRadius: scale(20), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    courseInfoName: { fontSize: moderateScale(14), fontWeight: '700', color: '#0f172a' },
    courseInfoSub: { fontSize: moderateScale(11), color: '#64748b', marginTop: verticalScale(2) },
    courseInfoFees: { alignItems: 'flex-end' },
    courseInfoFeesText: { fontSize: moderateScale(15), fontWeight: '800', color: BRAND },

    instructionCard: { backgroundColor: '#fff', borderRadius: moderateScale(12), padding: scale(14), marginBottom: verticalScale(18), borderWidth: 1, borderColor: '#e8edf2', gap: verticalScale(5) },
    instructionHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(6), marginBottom: verticalScale(4) },
    instructionTitle: { fontSize: moderateScale(13), fontWeight: '700', color: BRAND },
    instructionText: { fontSize: moderateScale(12), color: '#475569', lineHeight: moderateScale(18) },
    bold: { fontWeight: '700', color: '#0f172a' },

    accountRow: { flexDirection: 'row', alignItems: 'center', gap: scale(8), backgroundColor: '#f0f6fa', borderRadius: moderateScale(10), paddingHorizontal: scale(10), paddingVertical: verticalScale(8), borderWidth: 1, borderColor: '#d4e4ef', marginVertical: verticalScale(4) },
    accountNumber: { flex: 1, fontSize: moderateScale(13), fontWeight: '700', color: '#0f172a', letterSpacing: 0.5 },
    copyBtn: { flexDirection: 'row', alignItems: 'center', gap: scale(4), paddingHorizontal: scale(8), paddingVertical: verticalScale(4), borderRadius: moderateScale(8), backgroundColor: '#e8f0f5' },
    copyText: { fontSize: moderateScale(11), fontWeight: '700', color: BRAND },
    copyTextDone: { color: '#10b981' },

    pickerLabel: { fontSize: moderateScale(13), fontWeight: '600', color: '#334155', marginBottom: verticalScale(8) },
    required: { color: '#e05c5c' },
    pickerBox: { borderWidth: 2, borderColor: '#dde3ea', borderStyle: 'dashed', borderRadius: moderateScale(14), height: verticalScale(140), overflow: 'hidden', backgroundColor: '#fafbfc', marginBottom: verticalScale(8) },
    pickerBoxFilled: { borderStyle: 'solid', borderColor: '#10b981' },
    pickerPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: verticalScale(8) },
    pickerIconCircle: { width: scale(52), height: scale(52), borderRadius: scale(26), backgroundColor: '#e8f0f5', alignItems: 'center', justifyContent: 'center' },
    pickerTitle: { fontSize: moderateScale(13), fontWeight: '600', color: '#334155' },
    pickerSub: { fontSize: moderateScale(11), color: '#94a3b8' },
    previewWrap: { flex: 1 },
    previewImg: { width: '100%', height: '100%' },
    previewOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: verticalScale(8), gap: scale(6) },
    previewChangeText: { color: '#fff', fontSize: moderateScale(12), fontWeight: '600' },

    attachedRow: { flexDirection: 'row', alignItems: 'center', gap: scale(6), marginBottom: verticalScale(4) },
    attachedText: { fontSize: moderateScale(12), color: '#10b981', fontWeight: '600' },

    submittingRow: { marginTop: verticalScale(16), height: verticalScale(80) },
});

export default Courses;