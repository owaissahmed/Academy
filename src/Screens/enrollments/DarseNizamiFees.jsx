import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Image,
    BackHandler,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import BottomSheet from '../../components/Bottomsheet';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';
const CURRENT_YEAR = '2026';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Status Mapping matching the main theme
const STATUS_CONFIG = {
    verified: { bg: '#e8f5e9', text: '#10b981', icon: 'check-circle' },
    approved: { bg: '#e8f5e9', text: '#10b981', icon: 'check-circle' },
    pending: { bg: '#fff3e0', text: '#f59e0b', icon: 'clock' },
    rejected: { bg: '#fdf2f2', text: '#e05c5c', icon: 'alert-circle' },
};

const DarseNizamiFees = ({ route, navigation }) => {
    // ─── Route Params ────────────────────────────────────────────────────────
    const { enrollmentId, classId } = route.params || {};

    // ─── States ──────────────────────────────────────────────────────────────
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // ─── Form & Bottom Sheet States ──────────────────────────────────────────
    const [paySheetVisible, setPaySheetVisible] = useState(false);
    const [monthSheetVisible, setMonthSheetVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [screenshot, setScreenshot] = useState(null);

    // ─── Custom Modal & Image View States ────────────────────────────────────
    const [previewImage, setPreviewImage] = useState(null);
    const [modal, setModal] = useState({
        visible: false,
        type: 'info',
        title: '',
        message: '',
    });

    // ─── Animation Refs ──────────────────────────────────────────────────────
    const listFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadPaymentHistory();
    }, []);

    // ─── Hardware Back Press Control ─────────────────────────────────────────
    useEffect(() => {
        const onBackPress = () => {
            if (submitting) return true;
            return false;
        };
        const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => sub.remove();
    }, [submitting]);

    // ─── API: Fetch History ──────────────────────────────────────────────────
    const loadPaymentHistory = async () => {
        if (!enrollmentId) return;
        setLoading(true);
        try {
            const response = await api.get(`/fee-payment/my?enrollmentId=${enrollmentId}`);
            const finalData = Array.isArray(response) ? response : (response.data || []);
            setHistory(finalData);

            Animated.timing(listFadeAnim, {
                toValue: 1,
                duration: 320,
                useNativeDriver: true,
            }).start();
        } catch (err) {
            setHistory([]);
        } finaly: {
            setLoading(false);
        }
    };

    // ─── API: Submit Fee ─────────────────────────────────────────────────────
    const handleSubmitPayment = async () => {
        if (!selectedMonth) {
            showModal('warning', 'Required', 'Please select a month');
            return;
        }
        if (!screenshot) {
            showModal('warning', 'Required', 'Please attach payment screenshot');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('enrollmentId', enrollmentId);
            formData.append('month', `${selectedMonth} ${CURRENT_YEAR}`);
            formData.append('paymentScreenshot', {
                uri: screenshot.uri,
                name: screenshot.name,
                type: screenshot.type,
            });

            const response = await api.postFormData('/fee-payment/submit', formData);

            if (response.isSuccess) {
                setPaySheetVisible(false);
                resetForm();
                showModal('success', 'Submitted', response.message || 'Fee payment submitted successfully!');
                loadPaymentHistory();
            } else {
                showModal('error', 'Failed', response.message || 'Submission failed');
            }
        } catch (err) {
            showModal('error', 'Error', err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Helper Functions ────────────────────────────────────────────────────
    const showModal = (type, title, message) => {
        setModal({ visible: true, type, title, message });
    };

    const resetForm = () => {
        setSelectedMonth('');
        setScreenshot(null);
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
                        name: asset.fileName || `fee_${Date.now()}.jpg`,
                        type: asset.type || 'image/jpeg',
                    });
                }
            }
        );
    };

    const getStatusStyle = (status) => {
        const lowerStatus = status?.toLowerCase() || 'pending';
        return STATUS_CONFIG[lowerStatus] || STATUS_CONFIG.pending;
    };

    return (
        <Container
            showHeader={true}
            headerTitle="Dars-e-Nizami Fees"
            onBack={() => !submitting && navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading payment records..." />}

            {!loading && (
                <Animated.View style={[{ flex: 1, opacity: listFadeAnim }]}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                        
                        {/* ── Enrollment Info Top Banner ── */}
                        <View style={styles.headerCard}>
                            <View style={styles.headerTitleWrap}>
                                <View style={styles.cardIconCircle}>
                                    <Icon name="book-open" size={moderateScale(15)} color={BRAND} />
                                </View>
                                <View>
                                    <Text allowFontScaling={false} style={styles.headerLabel}>Enrollment Ref ID</Text>
                                    <Text allowFontScaling={false} style={styles.headerValue}>{enrollmentId}</Text>
                                </View>
                            </View>
                        </View>

                        {/* ── Payment History Section ── */}
                        <Text allowFontScaling={false} style={styles.sectionTitle}>Payment History</Text>
                        
                        {history.length === 0 ? (
                            <View style={styles.emptyHistory}>
                                <Icon name="credit-card" size={moderateScale(28)} color="#cbd5e1" />
                                <Text allowFontScaling={false} style={styles.emptyText}>No previous payments found</Text>
                            </View>
                        ) : (
                            history.map((item, index) => {
                                const s = getStatusStyle(item.status);
                                return (
                                    <View key={item._id || index} style={styles.card}>
                                        
                                        {/* ── Top: Month Name + Status Badge ── */}
                                        <View style={styles.cardTop}>
                                            <View style={styles.cardTitleWrap}>
                                                <View style={styles.cardIconCircle}>
                                                    <Icon name="calendar" size={moderateScale(14)} color={BRAND} />
                                                </View>
                                                <Text allowFontScaling={false} style={styles.cardTitle} numberOfLines={1}>
                                                    {item.month}
                                                </Text>
                                            </View>
                                            <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                                                <Icon name={s.icon} size={moderateScale(11)} color={s.text} />
                                                <Text allowFontScaling={false} style={[styles.statusText, { color: s.text }]}>
                                                    {item.status || 'Pending'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.divider} />

                                        {/* ── Info Data Row (Amount & Created Date) ── */}
                                        <View style={styles.infoRow}>
                                            <View style={styles.infoItem}>
                                                <Icon name="tag" size={moderateScale(12)} color="#94a3b8" />
                                                <Text allowFontScaling={false} style={styles.infoText}>
                                                    Rs {item.amountPaid ? item.amountPaid.toLocaleString() : '0'}
                                                </Text>
                                            </View>
                                            <View style={styles.infoItem}>
                                                <Icon name="clock" size={moderateScale(12)} color="#94a3b8" />
                                                <Text allowFontScaling={false} style={styles.infoText}>
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* ── Admin Note Area (If available) ── */}
                                        {item.adminNote && (
                                            <View style={[styles.noteBox, { backgroundColor: s.bg + '50' }]}>
                                                <Icon name="message-square" size={moderateScale(13)} color={s.text} />
                                                <Text allowFontScaling={false} style={[styles.noteText, { color: s.text }]}>
                                                    Remark: {item.adminNote}
                                                </Text>
                                            </View>
                                        )}

                                        {/* ── Payment Screenshot Row Clickable Thumbnail ── */}
                                        {item.paymentScreenshot && (
                                            <TouchableOpacity
                                                style={styles.screenshotRow}
                                                onPress={() => setPreviewImage(item.paymentScreenshot)}
                                                activeOpacity={0.8}
                                            >
                                                <Image
                                                    source={{ uri: item.paymentScreenshot }}
                                                    style={styles.screenshotThumb}
                                                    resizeMode="cover"
                                                />
                                                <View style={styles.screenshotInfo}>
                                                    <Text allowFontScaling={false} style={styles.screenshotLabel}>Payment Screenshot</Text>
                                                    <Text allowFontScaling={false} style={styles.screenshotSub}>Tap to view full receipt</Text>
                                                </View>
                                                <Icon name="eye" size={moderateScale(15)} color="#94a3b8" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            })
                        )}
                    </ScrollView>

                    {/* ── Fixed Bottom Button Bar ── */}
                    <View style={styles.fixedBottom}>
                        <TouchableOpacity 
                            style={styles.submitPayBtn} 
                            activeOpacity={0.85}
                            onPress={() => { resetForm(); setPaySheetVisible(true); }}
                        >
                            <Icon name="plus-circle" size={moderateScale(16)} color="#fff" />
                            <Text allowFontScaling={false} style={styles.submitPayBtnText}>Submit New Payment</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            {/* ── Payment Submission Sheet ── */}
            <BottomSheet
                visible={paySheetVisible}
                onClose={() => !submitting && setPaySheetVisible(false)}
                title="Submit Fee Payment"
                heightPercent={0.65}
                scrollable={true}
                primaryBtn={{
                    label: submitting ? '' : 'Submit Payment',
                    onPress: handleSubmitPayment,
                    loading: submitting,
                    icon: submitting ? undefined : 'check',
                    disabled: !screenshot || !selectedMonth || submitting,
                }}
                secondaryBtn={{
                    label: 'Cancel',
                    onPress: () => setPaySheetVisible(false),
                    disabled: submitting,
                }}
            >
                <View style={styles.sheetContent}>
                    <Text allowFontScaling={false} style={styles.pickerLabel}>
                        Select Month <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity 
                        style={styles.dropdownTrigger}
                        activeOpacity={0.7}
                        onPress={() => setMonthSheetVisible(true)}
                        disabled={submitting}
                    >
                        <Text allowFontScaling={false} style={[styles.dropdownValue, !selectedMonth && styles.placeholderText]}>
                            {selectedMonth ? `${selectedMonth} ${CURRENT_YEAR}` : 'Choose Month'}
                        </Text>
                        <Icon name="chevron-down" size={moderateScale(16)} color="#64748b" />
                    </TouchableOpacity>

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
                                <Image source={{ uri: screenshot.uri }} style={styles.previewImg} resizeMode="cover" />
                                <View style={styles.previewOverlay}>
                                    <Icon name="edit-2" size={moderateScale(16)} color="#fff" />
                                    <Text allowFontScaling={false} style={styles.previewChangeText}>Change Screenshot</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.pickerPlaceholder}>
                                <View style={styles.pickerIconCircle}>
                                    <Icon name="upload" size={moderateScale(22)} color={BRAND} />
                                </View>
                                <Text allowFontScaling={false} style={styles.pickerTitle}>Upload Receipt / Screenshot</Text>
                                <Text allowFontScaling={false} style={styles.pickerSub}>JPG, PNG files accepted</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* {submitting && (
                        <View style={styles.submittingRow}>
                            <Loader message="Uploading transaction record..." />
                        </View>
                    )} */}
                </View>
            </BottomSheet>

            {/* ── Month Selection Sheet ── */}
            <BottomSheet
                visible={monthSheetVisible}
                onClose={() => setMonthSheetVisible(false)}
                title="Select Fee Month"
                heightPercent={0.55}
                scrollable={true}
            >
                <View style={styles.monthListWrap}>
                    {MONTHS.map((m) => (
                        <TouchableOpacity
                            key={m}
                            style={[styles.monthItem, selectedMonth === m && styles.monthItemActive]}
                            activeOpacity={0.6}
                            onPress={() => {
                                setSelectedMonth(m);
                                setMonthSheetVisible(false);
                            }}
                        >
                            <Text allowFontScaling={false} style={[styles.monthItemText, selectedMonth === m && styles.monthItemTextActive]}>
                                {m} {CURRENT_YEAR}
                            </Text>
                            {selectedMonth === m && <Icon name="check" size={moderateScale(16)} color={BRAND} />}
                        </TouchableOpacity>
                    ))}
                </View>
            </BottomSheet>

            {/* ── Full Image Viewer Modal ── */}
            <AppModal
                visible={!!previewImage}
                type="info"
                title="Payment Receipt"
                onClose={() => setPreviewImage(null)}
                closeOnBackdrop={true}
                primaryBtn={{
                    label: 'Close',
                    onPress: () => setPreviewImage(null),
                }}
            >
                {previewImage && (
                    <Image 
                        source={{ uri: previewImage }} 
                        style={styles.fullViewImage} 
                        resizeMode="contain" 
                    />
                )}
            </AppModal>

            {/* ── System Response Messages Modal ── */}
            <AppModal
                visible={modal.visible}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal(prev => ({ ...prev, visible: false }))}
                closeOnBackdrop={true}
                primaryBtn={{
                    label: 'OK',
                    onPress: () => setModal(prev => ({ ...prev, visible: false })),
                }}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    scroll: { padding: scale(16), paddingBottom: verticalScale(95) },
    
    // Top Enrollment Banner Look
    headerCard: { backgroundColor: '#f8fafc', borderRadius: moderateScale(12), padding: scale(12), borderWidth: 1, borderColor: '#e2e8f0', marginBottom: verticalScale(16) },
    headerTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: scale(10) },
    headerLabel: { fontSize: moderateScale(11), color: '#64748b', fontWeight: '600', textTransform: 'uppercase' },
    headerValue: { fontSize: moderateScale(13), color: '#0f172a', fontWeight: '700', marginTop: verticalScale(2) },
    
    sectionTitle: { fontSize: moderateScale(14), fontWeight: '700', color: '#1e293b', marginBottom: verticalScale(12) },
    
    // Upgraded Reference Styling (From Parent Cards Layout)
    card: { backgroundColor: '#ffffff', borderRadius: moderateScale(14), padding: scale(14), marginBottom: verticalScale(12), borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: scale(8), flex: 1, paddingRight: scale(10) },
    cardIconCircle: { width: scale(28), height: scale(28), borderRadius: scale(14), backgroundColor: '#f0f4f8', alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontSize: moderateScale(13.5), fontWeight: '700', color: '#1e293b' },
    
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: scale(4), paddingHorizontal: scale(10), paddingVertical: verticalScale(4), borderRadius: moderateScale(12) },
    statusText: { fontSize: moderateScale(11), fontWeight: '700', textTransform: 'capitalize' },
    
    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: verticalScale(12) },
    
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: scale(16), marginBottom: verticalScale(10) },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: scale(4) },
    infoText: { fontSize: moderateScale(12), fontWeight: '600', color: '#475569' },
    
    noteBox: { flexDirection: 'row', gap: scale(6), padding: scale(10), borderRadius: moderateScale(8), marginTop: verticalScale(2), marginBottom: verticalScale(10), alignItems: 'center' },
    noteText: { fontSize: moderateScale(11.5), fontWeight: '500', flex: 1 },
    
    // Thumbnail Preview Box Matching Layout
    screenshotRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: scale(8), borderRadius: moderateScale(10), borderWidth: 1, borderColor: '#e2e8f0', marginTop: verticalScale(4) },
    screenshotThumb: { width: scale(38), height: scale(38), borderRadius: moderateScale(6), backgroundColor: '#e2e8f0' },
    screenshotInfo: { flex: 1, marginLeft: scale(10) },
    screenshotLabel: { fontSize: moderateScale(12), fontWeight: '700', color: '#1e293b' },
    screenshotSub: { fontSize: moderateScale(10.5), color: '#64748b', marginTop: verticalScale(1) },
    
    emptyHistory: { alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(50), gap: verticalScale(8) },
    emptyText: { fontSize: moderateScale(12.5), color: '#94a3b8', fontWeight: '500' },
    
    // Bottom Sticky Button Box
    fixedBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: scale(14), backgroundColor: '#ffffff', borderTopWidth: 1, borderColor: '#f1f5f9' },
    submitPayBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(11), borderRadius: moderateScale(12), backgroundColor: BRAND, gap: scale(6), elevation: 2 },
    submitPayBtnText: { fontSize: moderateScale(13), fontWeight: '700', color: '#ffffff' },
    
    // Bottom Sheet Forms Components
    sheetContent: { paddingBottom: verticalScale(10) },
    pickerLabel: { fontSize: moderateScale(12.5), fontWeight: '600', color: '#334155', marginBottom: verticalScale(8), marginTop: verticalScale(10) },
    required: { color: '#e05c5c' },
    dropdownTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: '#dde3ea', borderRadius: moderateScale(10), paddingHorizontal: scale(12), paddingVertical: verticalScale(11), backgroundColor: '#fafbfc', marginBottom: verticalScale(14) },
    dropdownValue: { fontSize: moderateScale(13), fontWeight: '600', color: '#0f172a' },
    placeholderText: { color: '#94a3b8' },
    
    pickerBox: { borderWidth: 2, borderColor: '#dde3ea', borderStyle: 'dashed', borderRadius: moderateScale(12), height: verticalScale(130), overflow: 'hidden', backgroundColor: '#fafbfc' },
    pickerBoxFilled: { borderStyle: 'solid', borderColor: '#10b981' },
    pickerPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: verticalScale(6) },
    pickerIconCircle: { width: scale(44), height: scale(44), borderRadius: scale(22), backgroundColor: '#e8f0f5', alignItems: 'center', justifyContent: 'center' },
    pickerTitle: { fontSize: moderateScale(12.5), fontWeight: '600', color: '#334155' },
    pickerSub: { fontSize: moderateScale(11), color: '#94a3b8' },
    previewWrap: { flex: 1 },
    previewImg: { width: '100%', height: '100%' },
    previewOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.45)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: verticalScale(8), gap: scale(6) },
    previewChangeText: { color: '#fff', fontSize: moderateScale(11), fontWeight: '600' },
    submittingRow: { marginTop: verticalScale(12), height: verticalScale(60) },

    monthListWrap: { paddingBottom: verticalScale(16) },
    monthItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: verticalScale(12), paddingHorizontal: scale(14), borderRadius: moderateScale(10), marginBottom: verticalScale(4) },
    monthItemActive: { backgroundColor: '#e8f0f5' },
    monthItemText: { fontSize: moderateScale(13), color: '#334155', fontWeight: '500' },
    monthItemTextActive: { color: BRAND, fontWeight: '700' },
    
    fullViewImage: { width: '100%', height: verticalScale(320), borderRadius: moderateScale(8), marginTop: verticalScale(10) }
});

export default DarseNizamiFees;