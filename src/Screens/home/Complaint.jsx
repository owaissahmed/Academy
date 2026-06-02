import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, BackHandler,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';


// ─── File Complaint Tab ───────────────────────────────────────────────────────
const FileComplaintTab = ({ onSubmissionSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [modal, setModal] = useState({
        visible: false,
        type: 'success',
        title: '',
        message: '',
        onPrimary: null,
    });

    const showModal = (type, title, message, onPrimary) => {
        setModal({ visible: true, type, title, message, onPrimary });
    };
    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => submitting || false);
        return () => sub.remove();
    }, [submitting]);

    const canSubmit = title.trim().length > 0 && description.trim().length > 0 && !submitting;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setSubmitting(true);
        try {
            const res = await api.post('/complaint/submit', {
                title: title.trim(),
                description: description.trim(),
            });

            // Checking standard wrapper responses
            if (res.isSuccess) {
                showModal(
                    'success',
                    'Complaint Submitted!',
                    res.message || 'Your complaint has been submitted successfully.',
                    () => {
                        closeModal();
                        setTitle('');
                        setDescription('');
                        onSubmissionSuccess(); // Switch to history tab on success
                    }
                );
            } else {
                showModal(
                    'error',
                    'Submission Failed',
                    res.message || 'Unable to submit your complaint.'
                );
            }
        } catch (err) {
            showModal(
                'error',
                'Submission Error',
                err.message || 'A network error occurred. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabBody}>
            <TextField
                label="Title"
                placeholder="e.g., Fee issue, Portal login error..."
                value={title}
                onChangeText={setTitle}
                maxLength={80}
            />

            <View style={{ marginTop: verticalScale(6) }}>
                <TextField
                    label=" Description"
                    placeholder="Apna masla tafseel se likhein..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={5}
                />
            </View>

            <Button
                label="Submit Complaint"
                icon="send"
                loading={submitting}
                disabled={!canSubmit}
                fullWidth
                onPress={handleSubmit}
                style={styles.submitBtn}
            />

            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                closeOnBackdrop={!submitting}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryBtn={{
                    label: 'OK',
                    onPress: modal.onPrimary || closeModal,
                }}
            />
        </ScrollView>
    );
};

// ─── My Complaints Tab ────────────────────────────────────────────────────────
const MyComplaintsTab = ({ refreshTrigger }) => {
    const [loading, setLoading] = useState(true);
    const [complaints, setComplaints] = useState([]);
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

    const showError = (title, message) => setModal({ visible: true, title, message });
    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => {
        loadComplaints();
    }, [refreshTrigger]);

    const loadComplaints = async () => {
        setLoading(true);
        try {
            const res = await api.get('/complaint/my');
            console.log(res)
            const list = Array.isArray(res) ? res : (res.data || []);
            setComplaints(list);
        } catch (err) {
            if (err.response?.status === 404) {
                setComplaints([]);
            } else {
                showError('Error', 'Complaints load nahi ho saki. Dobara koshish karein.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader message="Loading your complaints..." />;

    if (complaints.length === 0) {
        return (
            <View style={styles.emptyWrap}>
                <View style={styles.emptyIconCircle}>
                    <Icon name="alert-circle" size={moderateScale(28)} color="#cbd5e1" />
                </View>
                <Text allowFontScaling={false} style={styles.emptyTitle}>No Complaints Found</Text>
                <Text allowFontScaling={false} style={styles.emptySubtitle}>
                    If you are facing any issues, you can submit a complaint from the first tab.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabBody}>
            {complaints.map((item) => {
                const createdDate = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric', month: 'short', year: 'numeric',
                    })
                    : '—';

                return (
                    <View key={item._id} style={styles.statusCard}>
                        {/* Top Area: Title & Dynamic Badge */}
                        <View style={styles.statusTop}>
                            <View style={styles.statusIconCircle}>
                                <Icon name="info" size={moderateScale(18)} color={BRAND} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text allowFontScaling={false} style={styles.statusCardTitle} numberOfLines={1}>
                                    {item.title}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Date Row */}
                        <View style={styles.infoRow}>
                            <Icon name="calendar" size={moderateScale(13)} color="#64748b" />
                            <Text allowFontScaling={false} style={styles.infoLabel}>Filed Date</Text>
                            <Text allowFontScaling={false} style={styles.infoVal}>{createdDate}</Text>
                        </View>

                        {/* Description Row */}
                        <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                            <Icon name="align-left" size={moderateScale(13)} color="#64748b" style={{ marginTop: 2 }} />
                            <Text allowFontScaling={false} style={styles.infoLabel}>Message</Text>
                            <Text allowFontScaling={false} style={[styles.infoVal, { flex: 1, lineHeight: moderateScale(18) }]}>
                                {item.description}
                            </Text>
                        </View>

                        {/* Admin Feedback Box (Incase Admin replied) */}
                        {item.adminNote && (
                            <>
                                <View style={styles.divider} />
                                <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                                    <Icon name="message-square" size={moderateScale(13)} color="#10b981" style={{ marginTop: 2 }} />
                                    <Text allowFontScaling={false} style={[styles.infoLabel, { color: '#10b981', fontWeight: '700' }]}>
                                        Remarks
                                    </Text>
                                    <Text allowFontScaling={false} style={[styles.infoVal, { flex: 1, lineHeight: moderateScale(18), color: '#1e293b' }]}>
                                        {item.adminNote}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                );
            })}

            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type="error"
                title={modal.title}
                message={modal.message}
                primaryBtn={{ label: 'OK', onPress: closeModal }}
            />
        </ScrollView>
    );
};

// ─── Main Screen Wrapper ──────────────────────────────────────────────────────
const Complaint = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('file');
    const [refreshHistoryCount, setRefreshHistoryCount] = useState(0);

    const triggerHistoryRefresh = () => {
        setRefreshHistoryCount(prev => prev + 1);
        setActiveTab('status'); // Auto shift tab to history list
    };

    return (
        <Container
            showHeader={true}
            headerTitle="Complaints"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {/* Custom Tab Bar System matching your exact Spec */}
            <View style={styles.tabBar}>
                {['file', 'status'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                        onPress={() => setActiveTab(tab)}
                        activeOpacity={0.8}
                    >
                        <Text
                            allowFontScaling={false}
                            style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
                        >
                            {tab === 'file' ? 'Add Complaint' : 'My Complaints'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {activeTab === 'file' ? (
                <FileComplaintTab onSubmissionSuccess={triggerHistoryRefresh} />
            ) : (
                <MyComplaintsTab refreshTrigger={refreshHistoryCount} />
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        marginHorizontal: scale(16),
    },
    tabItem: {
        flex: 1,
        paddingVertical: verticalScale(12),
        alignItems: 'center',
        borderBottomWidth: 2.5,
        borderBottomColor: 'transparent',
    },
    tabItemActive: { borderBottomColor: BRAND },
    tabText: { fontSize: moderateScale(14), fontWeight: '500', color: '#94a3b8' },
    tabTextActive: { color: BRAND },
    tabBody: { padding: scale(16), paddingBottom: verticalScale(32) },

    submitBtn: { marginTop: verticalScale(24) },

    badge: { flexDirection: 'row', alignItems: 'center', gap: scale(5), borderRadius: moderateScale(20), paddingHorizontal: scale(10), paddingVertical: verticalScale(4), alignSelf: 'flex-start', marginTop: verticalScale(5) },
    badgeText: { fontSize: moderateScale(11.5), fontWeight: '600' },

    statusCard: { backgroundColor: '#f0f6fa', borderRadius: moderateScale(14), padding: scale(14), marginBottom: verticalScale(14), borderWidth: 1, borderColor: '#d4e4ef' },
    statusTop: { flexDirection: 'row', alignItems: 'center', gap: scale(12) },
    statusIconCircle: { width: scale(40), height: scale(40), borderRadius: scale(20), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    statusCardTitle: { fontSize: moderateScale(14.5), fontWeight: '700', color: '#0f172a', marginBottom: verticalScale(1) },

    divider: { height: 1, backgroundColor: '#e2eaf0', marginVertical: verticalScale(12) },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: scale(8), marginBottom: verticalScale(8) },
    infoLabel: { fontSize: moderateScale(12), color: '#64748b', minWidth: scale(70) },
    infoVal: { fontSize: moderateScale(12.5), fontWeight: '500', color: '#0f172a' },

    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: scale(32), gap: verticalScale(10), marginTop: verticalScale(60) },
    emptyIconCircle: { width: scale(64), height: scale(64), borderRadius: scale(32), backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginBottom: verticalScale(4) },
    emptyTitle: { fontSize: moderateScale(16), fontWeight: '800', color: '#334155' },
    emptySubtitle: { fontSize: moderateScale(12.5), color: '#94a3b8', textAlign: 'center', lineHeight: moderateScale(19) },
});

export default Complaint;