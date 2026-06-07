import React, { useState, useEffect, useRef } from 'react';
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
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

// Status config based on bonus/deduction presence
const getPaymentTag = (item) => {
    if (item.bonus > 0 && item.deduction === 0) {
        return { bg: '#e8f5e9', text: '#10b981', icon: 'trending-up', label: 'Bonus' };
    }
    if (item.deduction > 0 && item.bonus === 0) {
        return { bg: '#fdf2f2', text: '#e05c5c', icon: 'trending-down', label: 'Deducted' };
    }
    if (item.bonus > 0 && item.deduction > 0) {
        return { bg: '#fff3e0', text: '#f59e0b', icon: 'alert-circle', label: 'Adjusted' };
    }
    return { bg: '#f0f4f8', text: '#64748b', icon: 'check-circle', label: 'Paid' };
};

const formatMonth = (monthStr) => {
    // monthStr format: "2026-08"
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const monthName = monthNames[parseInt(month, 10) - 1] || month;
    return `${monthName} ${year}`;
};

const TeacherSalary = ({ navigation }) => {
    // ─── States ──────────────────────────────────────────────────────────────
    const [history, setHistory] = useState([]);
    const [summary, setSummary] = useState({ totalPaid: 0, totalBonus: 0, totalDeduction: 0 });
    const [loading, setLoading] = useState(false);

    // ─── Image Preview & Modal States ────────────────────────────────────────
    const [previewImage, setPreviewImage] = useState(null);
    const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });

    // ─── Animation ───────────────────────────────────────────────────────────
    const listFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadSalaryHistory();
    }, []);

    // ─── API: Fetch Salary History ────────────────────────────────────────────
    const loadSalaryHistory = async () => {
        try {
            const id = await AsyncStorage.getItem('userId');
            console.log('id', id);
            if (!id) {
                showModal('error', 'Error', 'User not found. Please login again.');
                return;
            }

            setLoading(true);
            const response = await api.get(`/teacher-applications/salary/history/${id}`);
            const data = response?.data || response;

            const payments = Array.isArray(data?.payments) ? data.payments : [];
            setHistory(payments);
            setSummary({
                totalPaid: data?.totalPaid || 0,
                totalBonus: data?.totalBonus || 0,
                totalDeduction: data?.totalDeduction || 0,
            });

            Animated.timing(listFadeAnim, {
                toValue: 1,
                duration: 320,
                useNativeDriver: true,
            }).start();
        } catch (err) {
            setHistory([]);
            showModal('error', 'Error', err.message || 'Failed to load salary history.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Helper ───────────────────────────────────────────────────────────────
    const showModal = (type, title, message) => {
        setModal({ visible: true, type, title, message });
    };

    return (
        <Container
            showHeader={true}
            headerTitle="Salary History"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading salary records..." />}

            {!loading && (
                <Animated.View style={{ flex: 1, opacity: listFadeAnim }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scroll}
                    >
                        {/* ── Summary Banner ── */}
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryTitleWrap}>
                                <View style={styles.cardIconCircle}>
                                    <Icon name="bar-chart-2" size={moderateScale(15)} color={BRAND} />
                                </View>
                                <Text allowFontScaling={false} style={styles.summaryTitle}>
                                    Salary Summary
                                </Text>
                            </View>

                            <View style={styles.feeDetailsDivider} />

                            <View style={styles.feeBreakdownRow}>
                                <View style={styles.feeBreakdownItem}>
                                    <Text allowFontScaling={false} style={styles.feeSubLabel}>Total Paid</Text>
                                    <Text allowFontScaling={false} style={[styles.feeValueText, { color: '#10b981', fontWeight: '800' }]}>
                                        Rs {summary.totalPaid.toLocaleString()}
                                    </Text>
                                </View>

                                <View style={styles.feeBreakdownItem}>
                                    <Text allowFontScaling={false} style={styles.feeSubLabel}>Total Bonus</Text>
                                    <Text allowFontScaling={false} style={[styles.feeValueText, { color: BRAND }]}>
                                        Rs {summary.totalBonus.toLocaleString()}
                                    </Text>
                                </View>

                                <View style={styles.feeBreakdownItem}>
                                    <Text allowFontScaling={false} style={styles.feeSubLabel}>Deductions</Text>
                                    <Text allowFontScaling={false} style={[styles.feeValueText, { color: '#e05c5c' }]}>
                                        Rs {summary.totalDeduction.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* ── Payment History ── */}
                        <Text allowFontScaling={false} style={styles.sectionTitle}>Payment Records</Text>

                        {history.length === 0 ? (
                            <View style={styles.emptyHistory}>
                                <Icon name="credit-card" size={moderateScale(28)} color="#cbd5e1" />
                                <Text allowFontScaling={false} style={styles.emptyText}>
                                    No salary records found
                                </Text>
                            </View>
                        ) : (
                            history.map((item, index) => {
                                const tag = getPaymentTag(item);
                                return (
                                    <View key={item._id || index} style={styles.card}>

                                        {/* ── Top: Month + Tag Badge ── */}
                                        <View style={styles.cardTop}>
                                            <View style={styles.cardTitleWrap}>
                                                <View style={styles.cardIconCircle}>
                                                    <Icon name="calendar" size={moderateScale(14)} color={BRAND} />
                                                </View>
                                                <Text allowFontScaling={false} style={styles.cardTitle} numberOfLines={1}>
                                                    {formatMonth(item.month)}
                                                </Text>
                                            </View>
                                            <View style={styles.infoItem}>
                                                <Icon name="clock" size={moderateScale(12)} color="#94a3b8" />
                                                <Text allowFontScaling={false} style={styles.infoText}>
                                                    {item.paidAt
                                                        ? new Date(item.paidAt).toLocaleDateString('en-PK', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })
                                                        : ''}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.divider} />

                                        {/* ── Salary Breakdown Grid ── */}
                                        <View style={styles.salaryGrid}>
                                            <View style={styles.salaryGridItem}>
                                                <Text allowFontScaling={false} style={styles.salaryGridLabel}>Base Salary</Text>
                                                <Text allowFontScaling={false} style={styles.salaryGridValue}>
                                                    Rs {item.baseSalary?.toLocaleString() || '0'}
                                                </Text>
                                            </View>
                                            <View style={styles.salaryGridItem}>
                                                <Text allowFontScaling={false} style={styles.salaryGridLabel}>Paid Amount</Text>
                                                <Text allowFontScaling={false} style={[styles.salaryGridValue, { color: '#10b981', fontWeight: '800' }]}>
                                                    Rs {item.paidAmount?.toLocaleString() || '0'}
                                                </Text>
                                            </View>
                                            <View style={styles.salaryGridItem}>
                                                <Text allowFontScaling={false} style={styles.salaryGridLabel}>Bonus</Text>
                                                <Text allowFontScaling={false} style={[styles.salaryGridValue, { color: item.bonus > 0 ? BRAND : '#94a3b8' }]}>
                                                    Rs {item.bonus?.toLocaleString() || '0'}
                                                </Text>
                                            </View>
                                            <View style={styles.salaryGridItem}>
                                                <Text allowFontScaling={false} style={styles.salaryGridLabel}>Deduction</Text>
                                                <Text allowFontScaling={false} style={[styles.salaryGridValue, { color: item.deduction > 0 ? '#e05c5c' : '#94a3b8' }]}>
                                                    Rs {item.deduction?.toLocaleString() || '0'}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* ── Paid At Row ── */}
                                        {/* <View style={styles.infoRow}>
                                            <View style={styles.infoItem}>
                                                <Icon name="clock" size={moderateScale(12)} color="#94a3b8" />
                                                <Text allowFontScaling={false} style={styles.infoText}>
                                                    {item.paidAt
                                                        ? new Date(item.paidAt).toLocaleDateString('en-PK', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })
                                                        : ''}
                                                </Text>
                                            </View>
                                        </View> */}

                                        {/* ── Admin Note ── */}
                                        {item.note ? (
                                            <View style={[styles.noteBox, { backgroundColor: tag.bg + '60' }]}>
                                                <Icon name="message-square" size={moderateScale(13)} color={tag.text} />
                                                <Text allowFontScaling={false} style={[styles.noteText, { color: tag.text }]}>
                                                    {item.note}
                                                </Text>
                                            </View>
                                        ) : null}

                                        {/* ── Screenshot Thumbnail ── */}
                                        {item.screenshotUrl ? (
                                            <TouchableOpacity
                                                style={styles.screenshotRow}
                                                onPress={() => setPreviewImage(item.screenshotUrl)}
                                                activeOpacity={0.8}
                                            >
                                                <Image
                                                    source={{ uri: item.screenshotUrl }}
                                                    style={styles.screenshotThumb}
                                                    resizeMode="cover"
                                                />
                                                <View style={styles.screenshotInfo}>
                                                    <Text allowFontScaling={false} style={styles.screenshotLabel}>
                                                        Payment Screenshot
                                                    </Text>
                                                    <Text allowFontScaling={false} style={styles.screenshotSub}>
                                                        Tap to view full receipt
                                                    </Text>
                                                </View>
                                                <Icon name="eye" size={moderateScale(15)} color="#94a3b8" />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                );
                            })
                        )}
                    </ScrollView>
                </Animated.View>
            )}

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

            {/* ── System Modal ── */}
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
    scroll: { padding: scale(16), paddingBottom: verticalScale(30) },

    // Summary Card (same as headerCard in reference)
    summaryCard: {
        backgroundColor: '#f8fafc',
        borderRadius: moderateScale(14),
        padding: scale(14),
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: verticalScale(18),
    },
    summaryTitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
    },
    summaryTitle: {
        fontSize: moderateScale(14),
        color: '#0f172a',
        fontWeight: '700',
    },
    feeDetailsDivider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: verticalScale(12),
        borderStyle: 'dashed',
        borderRadius: 1,
    },
    feeBreakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    feeBreakdownItem: {
        flex: 1,
        alignItems: 'flex-start',
    },
    feeSubLabel: {
        fontSize: moderateScale(10.5),
        color: '#64748b',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: verticalScale(2),
    },
    feeValueText: {
        fontSize: moderateScale(13),
        color: '#1e293b',
        fontWeight: '700',
    },

    sectionTitle: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: verticalScale(12),
    },

    // Payment Cards
    card: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(14),
        padding: scale(14),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 1,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        flex: 1,
        paddingRight: scale(10),
    },
    cardIconCircle: {
        width: scale(28),
        height: scale(28),
        borderRadius: scale(14),
        backgroundColor: '#f0f4f8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: moderateScale(13.5),
        fontWeight: '700',
        color: '#1e293b',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: moderateScale(12),
    },
    statusText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: verticalScale(12),
    },

    // Salary 2x2 Grid
    salaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: verticalScale(10),
        gap: verticalScale(10),
    },
    salaryGridItem: {
        width: '47%',
    },
    salaryGridLabel: {
        fontSize: moderateScale(10.5),
        color: '#64748b',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: verticalScale(2),
    },
    salaryGridValue: {
        fontSize: moderateScale(13),
        color: '#1e293b',
        fontWeight: '700',
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(16),
        marginBottom: verticalScale(10),
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
    },
    infoText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: '#475569',
    },

    noteBox: {
        flexDirection: 'row',
        gap: scale(6),
        padding: scale(10),
        borderRadius: moderateScale(8),
        marginTop: verticalScale(2),
        marginBottom: verticalScale(10),
        alignItems: 'center',
    },
    noteText: {
        fontSize: moderateScale(11.5),
        fontWeight: '500',
        flex: 1,
    },

    screenshotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: scale(8),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: verticalScale(4),
    },
    screenshotThumb: {
        width: scale(38),
        height: scale(38),
        borderRadius: moderateScale(6),
        backgroundColor: '#e2e8f0',
    },
    screenshotInfo: {
        flex: 1,
        marginLeft: scale(10),
    },
    screenshotLabel: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: '#1e293b',
    },
    screenshotSub: {
        fontSize: moderateScale(10.5),
        color: '#64748b',
        marginTop: verticalScale(1),
    },

    emptyHistory: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(50),
        gap: verticalScale(8),
    },
    emptyText: {
        fontSize: moderateScale(12.5),
        color: '#94a3b8',
        fontWeight: '500',
    },

    fullViewImage: {
        width: '100%',
        height: verticalScale(320),
        borderRadius: moderateScale(8),
        marginTop: verticalScale(10),
    },
});

export default TeacherSalary;