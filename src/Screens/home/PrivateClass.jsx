import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    BackHandler,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import BottomSheet from '../../components/Bottomsheet';
import Button from '../../components/Button';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

const STATUS_CONFIG = {
    pending: { color: '#f59e0b', bg: '#fef3e2', icon: 'clock' },
    approved: { color: '#10b981', bg: '#e6f7f0', icon: 'check-circle' },
    rejected: { color: '#e05c5c', bg: '#fdeaea', icon: 'x-circle' },
};

const FILTER_OPTIONS = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
];

// ─── Request Card ─────────────────────────────────────────────────────────────
const RequestCard = ({ item, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;

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

    return (
        <Animated.View style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}>
            <View style={styles.cardTop}>
                <View style={styles.cardTitleWrap}>
                    <View style={styles.cardIconCircle}>
                        <Icon name="book-open" size={moderateScale(15)} color={BRAND} />
                    </View>
                    <Text allowFontScaling={false} style={styles.cardTitle}>
                        {item.subject?.name || 'Subject'}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <Icon name={status.icon} size={moderateScale(11)} color={status.color} />
                    <Text allowFontScaling={false} style={[styles.statusText, { color: status.color }]}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsWrap}>
                {item.teacher && (
                    <View style={styles.detailRow}>
                        <Icon name="user" size={moderateScale(13)} color="#64748b" />
                        <Text allowFontScaling={false} style={styles.detailText}>
                            {item.teacher.user.name}
                        </Text>
                    </View>
                )}

                {item.fees != null && (
                    <View style={styles.detailRow}>
                        <Icon name="tag" size={moderateScale(13)} color="#64748b" />
                        <Text allowFontScaling={false} style={styles.detailText}>
                            Fees: Rs {item.fees.toLocaleString()}
                        </Text>
                    </View>
                )}

                {item.status === 'rejected' && item.rejectionReason && (
                    <View style={styles.detailRow}>
                        <Icon name="alert-circle" size={moderateScale(13)} color="#e05c5c" />
                        <Text allowFontScaling={false} style={[styles.detailText, { color: '#e05c5c' }]}>
                            Reason: {item.rejectionReason}
                        </Text>
                    </View>
                )}

                {item.status === 'pending' && (
                    <View style={styles.detailRow}>
                        <Icon name="info" size={moderateScale(13)} color="#94a3b8" />
                        <Text allowFontScaling={false} style={styles.detailText}>
                            Waiting for teacher assignment
                        </Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ message }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="inbox" size={moderateScale(32)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>No Requests Found</Text>
        <Text allowFontScaling={false} style={styles.emptySubtitle}>{message}</Text>
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const PrivateClass = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('request'); // 'request' | 'myRequests'

    // Request tab state
    const [subjects, setSubjects] = useState([]);
    const [subjectsLoading, setSubjectsLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [sheetVisible, setSheetVisible] = useState(false);

    // My Requests tab state
    const [requests, setRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });
    const showModal = (type, title, message) => setModal({ visible: true, type, title, message });
    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => { loadSubjects(); }, []);

    useEffect(() => {
        if (activeTab === 'myRequests') loadRequests();
    }, [activeTab]);

    // ─── Block back press while submitting ───────────────────────────────────
    useEffect(() => {
        const onBackPress = () => {
            if (submitting) return true;
            return false;
        };
        const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => sub.remove();
    }, [submitting]);

    const loadSubjects = async () => {
        setSubjectsLoading(true);
        try {
            const res = await api.get('/subjects/all');
            const list = Array.isArray(res) ? res : (res.data || []);
            setSubjects(list);
        } catch {
            showModal('error', 'Failed to Load', 'Could not load subjects. Please try again.');
        } finally {
            setSubjectsLoading(false);
        }
    };

    const loadRequests = async () => {
        setRequestsLoading(true);
        try {
            const res = await api.get('/private/my-requests');
            const list = Array.isArray(res) ? res : (res.data || []);
            setRequests(list);
        } catch {
            showModal('error', 'Failed to Load', 'Could not load your requests. Please try again.');
        } finally {
            setRequestsLoading(false);
        }
    };

    const handleSelectSubject = (subject) => {
        setSelectedSubject(subject);
        setSheetVisible(false);
    };

    const handleSubmit = async () => {
        if (!selectedSubject) {
            showModal('warning', 'Required', 'Please select a subject first.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post('/private/request', {
                subject: selectedSubject._id,
            });

            if (response.isSuccess) {
                setSelectedSubject(null);
                showModal('success', 'Request Sent', response.message || 'Your private class request has been submitted.');
            } else {
                showModal('error', 'Failed', response.message || 'Could not submit your request.');
            }
        } catch (err) {
            showModal('error', 'Error', err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredRequests = statusFilter === 'all'
        ? requests
        : requests.filter(r => r.status === statusFilter);

    return (
        <Container
            showHeader={true}
            headerTitle="Private Class"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {/* ─── Tabs ────────────────────────────────────────────────────────── */}
            <View style={styles.tabRow}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'request' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('request')}
                    activeOpacity={0.8}
                >
                    <Icon
                        name="plus-circle"
                        size={moderateScale(15)}
                        color={activeTab === 'request' ? '#ffffff' : BRAND}
                    />
                    <Text allowFontScaling={false} style={[
                        styles.tabBtnText,
                        activeTab === 'request' && styles.tabBtnTextActive,
                    ]}>
                        Request Class
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'myRequests' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('myRequests')}
                    activeOpacity={0.8}
                >
                    <Icon
                        name="list"
                        size={moderateScale(15)}
                        color={activeTab === 'myRequests' ? '#ffffff' : BRAND}
                    />
                    <Text allowFontScaling={false} style={[
                        styles.tabBtnText,
                        activeTab === 'myRequests' && styles.tabBtnTextActive,
                    ]}>
                        My Requests
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ─── Tab: Request Class ─────────────────────────────────────────── */}
            {activeTab === 'request' && (
                <>
                    {subjectsLoading && <Loader message="Loading subjects..." />}

                    {!subjectsLoading && (
                        <View style={styles.content}>
                            <View style={styles.introCard}>
                                <View style={styles.introIconCircle}>
                                    <Icon name="user-check" size={moderateScale(20)} color={BRAND} />
                                </View>
                                <Text allowFontScaling={false} style={styles.introTitle}>
                                    Request a Private Class
                                </Text>
                                <Text allowFontScaling={false} style={styles.introSubtitle}>
                                    Select a subject below and submit your request for one-on-one classes.
                                </Text>
                            </View>

                            <Text allowFontScaling={false} style={styles.label}>Subject</Text>
                            <TouchableOpacity
                                style={styles.selector}
                                onPress={() => setSheetVisible(true)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.selectorLeft}>
                                    <Icon name="book-open" size={moderateScale(16)} color={BRAND} />
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            styles.selectorText,
                                            !selectedSubject && styles.selectorPlaceholder,
                                        ]}
                                    >
                                        {selectedSubject ? selectedSubject.name : 'Select a subject'}
                                    </Text>
                                </View>
                                <Icon name="chevron-down" size={moderateScale(18)} color="#94a3b8" />
                            </TouchableOpacity>

                            <View style={styles.submitWrap}>
                                <Button
                                    label="Submit Request"
                                    iconPosition="left"
                                    onPress={handleSubmit}
                                    loading={submitting}
                                    disabled={submitting}
                                    fullWidth
                                    size="lg"
                                />
                            </View>
                        </View>
                    )}
                </>
            )}

            {/* ─── Tab: My Requests ───────────────────────────────────────────── */}
            {activeTab === 'myRequests' && (
                <>
                    <View style={styles.filterRow}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filterScroll}
                        >
                            {FILTER_OPTIONS.map(opt => {
                                const isActive = statusFilter === opt.key;
                                return (
                                    <TouchableOpacity
                                        key={opt.key}
                                        style={[styles.chip, isActive && styles.chipActive]}
                                        onPress={() => setStatusFilter(opt.key)}
                                        activeOpacity={0.8}
                                    >
                                        <Text allowFontScaling={false} style={[
                                            styles.chipText,
                                            isActive && styles.chipTextActive,
                                        ]}>
                                            {opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {requestsLoading && <Loader message="Loading requests..." />}

                    {!requestsLoading && filteredRequests.length === 0 && (
                        <EmptyState
                            message={
                                statusFilter === 'all'
                                    ? "You haven't made any private class requests yet."
                                    : `No ${statusFilter} requests found.`
                            }
                        />
                    )}

                    {!requestsLoading && filteredRequests.length > 0 && (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scroll}
                        >
                            {filteredRequests.map((item, index) => (
                                <RequestCard key={item._id} item={item} index={index} />
                            ))}
                        </ScrollView>
                    )}
                </>
            )}

            {/* ─── Subject Selection BottomSheet ─────────────────────────────── */}
            <BottomSheet
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                heightPercent={0.55}
                title="Select Subject"
            >
                {subjects.length === 0 ? (
                    <Text allowFontScaling={false} style={styles.sheetEmptyText}>
                        No subjects available.
                    </Text>
                ) : (
                    <View>
                        {subjects.map((subject) => {
                            const isSelected = selectedSubject?._id === subject._id;

                            return (
                                <TouchableOpacity
                                    key={subject._id}
                                    style={styles.subjectRow}
                                    onPress={() => handleSelectSubject(subject)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.subjectRowText}
                                    >
                                        {subject.name}
                                    </Text>

                                    <View
                                        style={[
                                            styles.checkCircle,
                                            isSelected && styles.checkCircleSel,
                                        ]}
                                    >
                                        {isSelected && (
                                            <Icon
                                                name="check"
                                                size={moderateScale(12)}
                                                color="#fff"
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </BottomSheet>

            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryBtn={{ label: 'OK', onPress: closeModal }}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    // ── Tabs ──
    tabRow: {
        flexDirection: 'row',
        gap: scale(10),
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(14),
        paddingBottom: verticalScale(10),
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(6),
        paddingVertical: verticalScale(11),
        borderRadius: moderateScale(12),
        borderWidth: 1.4,
        borderColor: BRAND,
        backgroundColor: '#ffffff',
    },
    tabBtnActive: {
        backgroundColor: BRAND,
    },
    tabBtnText: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: BRAND,
    },
    tabBtnTextActive: {
        color: '#ffffff',
    },

    content: {
        padding: scale(16),
        paddingTop: verticalScale(4),
    },

    // ── Intro card ──
    introCard: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        padding: scale(18),
        marginBottom: verticalScale(20),
        borderWidth: 1,
        borderColor: '#e8edf2',
        alignItems: 'center',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    introIconCircle: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(24),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(10),
    },
    introTitle: {
        fontSize: moderateScale(15.5),
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: verticalScale(6),
        textAlign: 'center',
    },
    introSubtitle: {
        fontSize: moderateScale(12.5),
        color: '#64748b',
        textAlign: 'center',
        lineHeight: moderateScale(19),
    },

    // ── Selector ──
    label: {
        fontSize: moderateScale(12.5),
        fontWeight: '700',
        color: '#334155',
        marginBottom: verticalScale(8),
        marginLeft: scale(2),
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderWidth: 1.4,
        borderColor: '#dde3ea',
        borderRadius: moderateScale(14),
        paddingHorizontal: scale(14),
        minHeight: verticalScale(50),
    },
    selectorLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        flex: 1,
    },
    selectorText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: '#0f172a',
    },
    selectorPlaceholder: {
        color: '#94a3b8',
        fontWeight: '500',
    },

    submitWrap: {
        marginTop: verticalScale(28),
    },

    // ── Filter chips ──
    filterRow: {
        paddingTop: verticalScale(2),
        paddingBottom: verticalScale(6),
    },
    filterScroll: {
        paddingHorizontal: scale(16),
        gap: scale(8),
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(7),
        borderRadius: moderateScale(20),
        backgroundColor: '#f1f5f9',
    },
    chipActive: {
        backgroundColor: BRAND,
        borderColor: BRAND,
    },
    chipText: {
        fontSize: moderateScale(12.5),
        fontWeight: '600',
        color: '#64748b',
    },
    chipTextActive: {
        color: '#ffffff',
        fontWeight: '700',
    },

    // ── Request list ──
    scroll: {
        padding: scale(16),
        paddingTop: verticalScale(4),
        paddingBottom: verticalScale(24),
    },
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
        gap: scale(10),
        flex: 1,
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
        fontSize: moderateScale(14.5),
        fontWeight: '700',
        color: '#0f172a',
        flex: 1,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        paddingVertical: verticalScale(4),
        paddingHorizontal: scale(10),
        borderRadius: moderateScale(20),
    },
    statusText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#eef2f6',
        marginBottom: verticalScale(10),
    },
    detailsWrap: {
        gap: verticalScale(8),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    detailText: {
        fontSize: moderateScale(12.5),
        color: '#475569',
        fontWeight: '500',
        flex: 1,
    },

    // ── Empty ──
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(32),
        gap: verticalScale(10),
        paddingTop: verticalScale(60),
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

    // ── Sheet ──
    sheetList: {
        paddingHorizontal: scale(4),
        paddingBottom: verticalScale(10),
    }, sheetEmptyText: {
        fontSize: moderateScale(13),
        color: '#94a3b8',
        textAlign: 'center',
        paddingVertical: verticalScale(20),
    },

    subjectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(13),
        borderBottomWidth: 0.5,
        borderBottomColor: '#f1f5f9',
    },

    subjectRowText: {
        flex: 1,
        fontSize: moderateScale(14),
        color: '#0f172a',
    },

    checkCircle: {
        width: scale(22),
        height: scale(22),
        borderRadius: scale(11),
        borderWidth: 1.5,
        borderColor: '#dde3ea',
        alignItems: 'center',
        justifyContent: 'center',
    },

    checkCircleSel: {
        backgroundColor: BRAND,
        borderColor: BRAND,
    },
});

export default PrivateClass;
