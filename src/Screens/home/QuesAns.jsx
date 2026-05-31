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
import TextField from '../../components/TextField';
import BottomSheet from '../../components/Bottomsheet';
import AppModal from '../../components/Appmodal';
import Loader from '../../components/Loader';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
const TabBar = ({ activeTab, onChange }) => (
    <View style={styles.tabBar}>
        {[
            { key: 'community', label: 'Community', icon: 'globe' },
            { key: 'my', label: 'My Questions', icon: 'user' },
        ].map(tab => (
            <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
                onPress={() => onChange(tab.key)}
                activeOpacity={0.8}
            >
                <Icon
                    name={tab.icon}
                    size={moderateScale(13)}
                    color={activeTab === tab.key ? BRAND : '#94a3b8'}
                />
                <Text
                    allowFontScaling={false}
                    style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}
                >
                    {tab.label}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

// ─── Question Card ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index, onDeleted }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;
    const [deleting, setDeleting] = useState(false);
    const [modal, setModal] = useState({ visible: false, type: 'error', title: '', message: '', onPrimary: null });

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, delay: index * 80, tension: 70, friction: 9, useNativeDriver: true }),
        ]).start();
    }, []);

    const confirmDelete = () => {
        setModal({
            visible: true,
            type: 'warning',
            title: 'Delete Question?',
            message: 'Are you sure you want to delete this question?',
            onPrimary: handleDelete,
        });
    };

    const handleDelete = async () => {
        closeModal();
        setDeleting(true);
        try {
            await api.post(`/question/delete/${item._id}`);
            onDeleted?.(item._id);
        } catch (err) {
            setModal({
                visible: true,
                type: 'error',
                title: 'Error',
                message: err.response?.data?.message || 'Failed to delete question. Please try again.',
                onPrimary: closeModal,
            });
        } finally {
            setDeleting(false);
        }
    };

    const date = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString('en-PK', {
            day: 'numeric', month: 'short', year: 'numeric',
        })
        : '—';

    return (
        <>
            <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                {/* Top row */}
                <View style={styles.cardTop}>
                    <View style={styles.subjectBadge}>
                        <Icon name="book-open" size={moderateScale(11)} color={BRAND} />
                        <Text allowFontScaling={false} style={styles.subjectBadgeText}>
                            {item.subject?.name || '—'}
                        </Text>
                    </View>
                    <Text allowFontScaling={false} style={styles.cardDate}>{date}</Text>
                </View>

                {/* Question text */}
                <Text allowFontScaling={false} style={styles.questionText}>
                    {item.questionText}
                </Text>

                {/* Answer or pending */}
                {item.answerText ? (
                    <View style={styles.answerWrap}>
                        <View style={styles.answerHeader}>
                            <Icon name="check-circle" size={moderateScale(13)} color="#10b981" />
                            <Text allowFontScaling={false} style={styles.answerLabel}>Answer</Text>
                        </View>
                        <Text allowFontScaling={false} style={styles.answerText}>
                            {item.answerText}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.statusRow}>
                        <View style={styles.pendingWrap}>
                            <Icon name="clock" size={moderateScale(12)} color="#f59e0b" />
                            <Text allowFontScaling={false} style={styles.pendingText}>
                                Awaiting answer
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={confirmDelete}
                            disabled={deleting}
                            activeOpacity={0.7}
                            style={styles.deleteBtn}
                        >
                            <Icon name="trash-2" size={moderateScale(14)} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Asked by */}
                {item.user?.name && (
                    <View style={styles.askedByRow}>
                        <Icon name="user" size={moderateScale(11)} color="#94a3b8" />
                        <Text allowFontScaling={false} style={styles.askedByText}>
                            {item.user.name}
                        </Text>
                    </View>
                )}
            </Animated.View>

            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryBtn={{ label: modal.type === 'warning' ? 'Delete' : 'OK', onPress: modal.onPrimary || closeModal }}
                secondaryBtn={modal.type === 'warning' ? { label: 'Cancel', onPress: closeModal } : undefined}
            />
        </>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onRetry, message }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="inbox" size={moderateScale(32)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>No Questions Yet</Text>
        <Text allowFontScaling={false} style={styles.emptySubtitle}>
            {message || 'No questions available.'}
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
            <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
            <Text allowFontScaling={false} style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
    </View>
);

// ─── Questions List ───────────────────────────────────────────────────────────
const QuestionsList = ({ endpoint, emptyMessage }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => { loadData(); }, [endpoint]);
    const handleDeleted = (id) => {
        setData(prev => prev.filter(q => q._id !== id));
    };
    const loadData = async () => {
        setLoading(true);
        try {
            const res = await api.get(endpoint);
            const list = Array.isArray(res) ? res : (res.data || []);
            setData(list);
        } catch {
            setModal({ visible: true, title: 'Error', message: 'Failed to load questions. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader message="Loading questions..." />;

    if (data.length === 0) return <EmptyState onRetry={loadData} message={emptyMessage} />;

    return (
        <>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {data.map((item, index) => (
                    <QuestionCard key={item._id} item={item} index={index} onDeleted={handleDeleted} />
                ))}
            </ScrollView>

            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type="error"
                title={modal.title}
                message={modal.message}
                primaryBtn={{ label: 'OK', onPress: closeModal }}
            />
        </>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const QuesAns = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('community');
    const [subjects, setSubjects] = useState([]);
    const [activeSubject, setActiveSubject] = useState(null);

    // Ask sheet
    const [sheetVisible, setSheetVisible] = useState(false);
    const [subjectSheet, setSubjectSheet] = useState(false);
    const [tempSubject, setTempSubject] = useState(null);
    const [selSubject, setSelSubject] = useState(null);
    const [loadingSubj, setLoadingSubj] = useState(false);
    const [question, setQuestion] = useState('');
    const [questionError, setQuestionError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [modal, setModal] = useState({
        visible: false, type: 'error',
        title: '', message: '', onPrimary: null,
    });

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    // Load subjects once on mount
    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const res = await api.get('/subjects/all');
                const list = Array.isArray(res) ? res : (res.data || []);
                setSubjects(list);
            } catch { }
        };
        loadSubjects();
    }, []);

    // Block back while submitting
    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            if (submitting) return true;
            return false;
        });
        return () => sub.remove();
    }, [submitting]);

    const openAskSheet = () => {
        setQuestion('');
        setQuestionError('');
        setSelSubject(null);
        setTempSubject(null);
        setSheetVisible(true);
    };

    const closeAskSheet = () => {
        if (submitting) return;
        setSheetVisible(false);
    };

    const handleSubmit = async () => {
        if (!selSubject) {
            setModal({
                visible: true, type: 'warning',
                title: 'Subject Required',
                message: 'Please select a subject before submitting.',
                onPrimary: closeModal,
            });
            return;
        }
        if (!question.trim()) {
            setQuestionError('Question is required.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await api.post('/question/ask', {
                subject: selSubject._id,
                questionText: question.trim(),
            });
            if (res.isSuccess || res.success) {
                setSheetVisible(false);
                setModal({
                    visible: true, type: 'success',
                    title: 'Question Submitted!',
                    message: 'Your question has been submitted. You will receive a response soon.',
                    onPrimary: closeModal,
                });
            } else {
                setModal({
                    visible: true, type: 'error',
                    title: 'Submission Failed',
                    message: res.message || 'Failed to submit your question.',
                    onPrimary: closeModal,
                });
            }
        } catch (err) {
            setModal({
                visible: true, type: 'error',
                title: 'Error',
                message: err.response?.data?.message || 'Something went wrong. Please try again.',
                onPrimary: closeModal,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container
            showHeader={true}
            headerTitle="Q & A"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {/* Tab bar */}
            <TabBar activeTab={activeTab} onChange={tab => {
                setActiveTab(tab);
                setActiveSubject(null); // reset filter on tab switch
            }} />

            {/* Subject filter pills — community only */}
            {activeTab === 'community' && (
                <View style={styles.pillsWrap}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.pillsScroll}
                    >
                        <TouchableOpacity
                            style={[styles.pill, !activeSubject && styles.pillActive]}
                            onPress={() => setActiveSubject(null)}
                            activeOpacity={0.8}
                        >
                            <Text allowFontScaling={false} style={[styles.pillText, !activeSubject && styles.pillTextActive]}>
                                All
                            </Text>
                        </TouchableOpacity>

                        {subjects.map(s => (
                            <TouchableOpacity
                                key={s._id}
                                style={[styles.pill, activeSubject?._id === s._id && styles.pillActive]}
                                onPress={() => setActiveSubject(s)}
                                activeOpacity={0.8}
                            >
                                <Text allowFontScaling={false} style={[styles.pillText, activeSubject?._id === s._id && styles.pillTextActive]}>
                                    {s.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Questions list */}
            {activeTab === 'community' ? (
                <QuestionsList
                    endpoint={
                        activeSubject
                            ? `/question/community?subject=${activeSubject._id}`
                            : '/question/community'
                    }
                    emptyMessage="No questions found in the community yet."
                />
            ) : (
                <QuestionsList
                    endpoint="/question/my"
                    emptyMessage="You haven't asked any questions yet."
                />
            )}

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={openAskSheet}
                activeOpacity={0.85}
            >
                <Icon name="plus" size={moderateScale(22)} color="#fff" />
            </TouchableOpacity>

            {/* Ask Question Sheet */}
            <BottomSheet
                visible={sheetVisible}
                onClose={closeAskSheet}
                title="Ask a Question"
                scrollable={true}
                heightPercent={0.6}
                primaryBtn={{
                    label: 'Submit Question',
                    icon: 'send',
                    onPress: handleSubmit,
                    loading: submitting,
                    disabled: submitting,
                }}
                secondaryBtn={{
                    label: 'Cancel',
                    onPress: closeAskSheet,
                    disabled: submitting,
                }}
            >
                <View style={styles.sheetContent}>
                    <Text allowFontScaling={false} style={styles.fieldLabel}>
                        Subject <Text style={styles.req}>*</Text>
                    </Text>

                    <TouchableOpacity
                        style={[styles.subjectTrigger, selSubject && styles.subjectTriggerFilled]}
                        onPress={() => { setTempSubject(selSubject); setSubjectSheet(true); }}
                        activeOpacity={0.8}
                        disabled={submitting}
                    >
                        <Text
                            allowFontScaling={false}
                            style={[styles.subjectTriggerText, selSubject && styles.subjectTriggerTextFilled]}
                        >
                            {selSubject ? selSubject.name : 'Tap to select subject'}
                        </Text>
                        <Icon name="chevron-down" size={moderateScale(16)} color="#94a3b8" />
                    </TouchableOpacity>

                    <View style={{ marginTop: verticalScale(14) }}>
                        <TextField
                            label="Your Question"
                            value={question}
                            onChangeText={t => { setQuestion(t); setQuestionError(''); }}
                            multiline
                            numberOfLines={4}
                            error={questionError}
                            icon="help-circle"
                        />
                    </View>
                </View>
            </BottomSheet>

            {/* Subject Picker Sheet */}
            <BottomSheet
                visible={subjectSheet}
                onClose={() => setSubjectSheet(false)}
                title="Select Subject"
                scrollable={true}
                heightPercent={0.4}
                primaryBtn={{
                    label: 'Confirm',
                    icon: 'check',
                    onPress: () => { setSelSubject(tempSubject); setSubjectSheet(false); },
                    disabled: !tempSubject,
                }}
                secondaryBtn={{
                    label: 'Cancel',
                    onPress: () => setSubjectSheet(false),
                }}
            >
                <View>
                    {subjects.map(s => {
                        const isSel = tempSubject?._id === s._id;
                        return (
                            <TouchableOpacity
                                key={s._id}
                                style={styles.subjectRow}
                                onPress={() => setTempSubject(s)}
                                activeOpacity={0.7}
                            >
                                <Text allowFontScaling={false} style={styles.subjectRowText}>
                                    {s.name}
                                </Text>
                                <View style={[styles.radioCircle, isSel && styles.radioCircleSel]}>
                                    {isSel && <View style={styles.radioDot} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BottomSheet>

            {/* AppModal */}
            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryBtn={{ label: 'OK', onPress: modal.onPrimary || closeModal }}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    // Tabs
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        marginHorizontal: scale(16),
    },
    tabItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(6),
        paddingVertical: verticalScale(12),
        borderBottomWidth: 2.5,
        borderBottomColor: 'transparent',
    },
    tabItemActive: { borderBottomColor: BRAND },
    tabText: { fontSize: moderateScale(13), fontWeight: '500', color: '#94a3b8' },
    tabTextActive: { color: BRAND },

    // Pills
    pillsWrap: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    pillsScroll: {
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(10),
        gap: scale(8),
        flexDirection: 'row',
    },
    pill: {
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(7),
        borderRadius: moderateScale(20),
        backgroundColor: '#f1f5f9',
    },
    pillActive: { backgroundColor: BRAND },
    pillText: { fontSize: moderateScale(12.5), fontWeight: '600', color: '#64748b' },
    pillTextActive: { color: '#ffffff' },

    // Scroll
    scroll: { padding: scale(16), paddingBottom: verticalScale(90) },

    // Card
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
        justifyContent: 'space-between',
        marginBottom: verticalScale(10),
    },
    subjectBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
        backgroundColor: '#e8f0f5',
        borderRadius: moderateScale(20),
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
    },
    subjectBadgeText: { fontSize: moderateScale(11), fontWeight: '700', color: BRAND },
    cardDate: { fontSize: moderateScale(11), color: '#94a3b8' },
    questionText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: '#0f172a',
        lineHeight: moderateScale(21),
        marginBottom: verticalScale(10),
    },

    // Answer
    answerWrap: {
        backgroundColor: '#f0faf5',
        borderRadius: moderateScale(12),
        padding: scale(12),
        borderWidth: 1,
        borderColor: '#c6edd8',
    },
    answerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        marginBottom: verticalScale(6),
    },
    answerLabel: { fontSize: moderateScale(12), fontWeight: '700', color: '#10b981' },
    answerText: { fontSize: moderateScale(13), color: '#1e293b', lineHeight: moderateScale(19) },

    // Pending
    pendingWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        backgroundColor: '#fffbeb',
        borderRadius: moderateScale(10),
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(6),
        borderWidth: 1,
        borderColor: '#fde68a',
        alignSelf: 'flex-start',
    },
    pendingText: { fontSize: moderateScale(11), fontWeight: '600', color: '#f59e0b' },

    // Asked by
    askedByRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
        marginTop: verticalScale(8),
    },
    askedByText: { fontSize: moderateScale(11), color: '#94a3b8' },

    // Empty
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
    emptyTitle: { fontSize: moderateScale(16), fontWeight: '800', color: '#334155' },
    emptySubtitle: { fontSize: moderateScale(12.5), color: '#94a3b8', textAlign: 'center', lineHeight: moderateScale(19) },
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
    retryText: { fontSize: moderateScale(13), fontWeight: '700', color: BRAND },

    // FAB
    fab: {
        position: 'absolute',
        bottom: verticalScale(24),
        right: scale(20),
        width: scale(54),
        height: scale(54),
        borderRadius: scale(27),
        backgroundColor: BRAND,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: BRAND,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
    },

    // Sheet
    sheetContent: { paddingBottom: verticalScale(8) },
    fieldLabel: { fontSize: moderateScale(13), fontWeight: '600', color: '#334155', marginBottom: verticalScale(8) },
    req: { color: '#e05c5c' },
    subjectTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.4,
        borderColor: '#dde3ea',
        borderRadius: moderateScale(14),
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(13),
        backgroundColor: '#ffffff',
    },
    subjectTriggerFilled: { borderColor: BRAND },
    subjectTriggerText: { fontSize: moderateScale(14), color: '#94a3b8', flex: 1 },
    subjectTriggerTextFilled: { color: '#1e293b' },

    // Subject picker
    subjectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(13),
        borderBottomWidth: 0.5,
        borderBottomColor: '#f1f5f9',
    },
    subjectRowText: { fontSize: moderateScale(14), color: '#0f172a', flex: 1 },
    radioCircle: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        borderWidth: 1.5,
        borderColor: '#dde3ea',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircleSel: { borderColor: BRAND },
    radioDot: {
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
        backgroundColor: BRAND,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    deleteBtn: {
        marginLeft: 'auto',
        paddingLeft: scale(8),
    },
});

export default QuesAns;