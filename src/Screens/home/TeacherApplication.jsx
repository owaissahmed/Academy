import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, BackHandler,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import BottomSheet from '../../components/Bottomsheet';
import TextField from '../../components/TextField';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import { api } from '../../utlis/api';
import AppModal from '../../components/Appmodal';

const BRAND = '#2e4c60';

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const map = {
        pending: { label: 'Application Under Review', bg: '#faeeda', color: '#854f0b', icon: 'clock' },
        approved: { label: 'Application Approved', bg: '#eaf3de', color: '#3b6d11', icon: 'check-circle' },
        rejected: { label: 'Application Rejected', bg: '#fcebeb', color: '#a32d2d', icon: 'x-circle' },
    };
    const s = map[status] || map.pending;
    return (
        <View style={[styles.badge, { backgroundColor: s.bg }]}>
            <Icon name={s.icon} size={moderateScale(12)} color={s.color} />
            <Text allowFontScaling={false} style={[styles.badgeText, { color: s.color }]}>
                {s.label}
            </Text>
        </View>
    );
};

// ─── Apply Tab ────────────────────────────────────────────────────────────────
const ApplyTab = () => {
    const [experience, setExperience] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [tempSelected, setTempSelected] = useState([]);
    const [selected, setSelected] = useState([]);
    const [sheetVisible, setSheetVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    // ── Modal state ──
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

    // Block back on submit
    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => submitting || false);
        return () => sub.remove();
    }, [submitting]);

    const loadSubjects = async () => {
        if (subjects.length > 0) return;
        setLoadingSubjects(true);
        try {
            const res = await api.get('/subjects/all');
            const list = Array.isArray(res) ? res : (res.data || []);
            setSubjects(list);
        } catch {
            showModal('error', 'Error', 'Subjects load nahi ho sake. Dobara try karein.');
        } finally {
            setLoadingSubjects(false);
        }
    };

    const openSheet = async () => {
        await loadSubjects();
        setTempSelected([...selected]);
        setSheetVisible(true);
    };

    const toggleTemp = (id) => {
        setTempSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const confirmSelection = () => {
        setSelected([...tempSelected]);
        setSheetVisible(false);
    };

    const removeSubject = (id) => {
        setSelected(prev => prev.filter(x => x !== id));
        setTempSelected(prev => prev.filter(x => x !== id));
    };

    const selectedNames = subjects.filter(s => selected.includes(s._id));
    const canSubmit = experience.trim().length > 0 && selected.length > 0 && !submitting;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setSubmitting(true);
        try {
            const res = await api.post('/teacher-applications/apply', {
                subjects: selected,
                experience: experience.trim(),
            });

            if (res.isSuccess) {
                showModal(
                    'success',
                    'Application Submitted!',
                    res.message, () => {
                        closeModal();
                        setExperience('');
                        setSelected([]);
                        setTempSelected([]);
                    }
                );
            } else {
                showModal('error', 'Submission Failed', res.message);
            }
        } catch (err) {
            showModal(
                'error',
                'Error',
                err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabBody}>

            <TextField
                label="Experience"
                value={experience}
                onChangeText={setExperience}
                multiline
                numberOfLines={4}
            />

            <Text allowFontScaling={false} style={styles.fieldLabel}>
                Subjects <Text style={styles.req}>*</Text>
            </Text>

            <TouchableOpacity
                style={[styles.subjectTrigger, selected.length > 0 && styles.subjectTriggerFilled]}
                onPress={openSheet}
                activeOpacity={0.8}
            >
                <Text
                    allowFontScaling={false}
                    style={[
                        styles.subjectTriggerText,
                        selected.length > 0 && styles.subjectTriggerTextFilled,
                    ]}
                >
                    {selected.length > 0
                        ? `${selected.length} subject${selected.length > 1 ? 's' : ''} selected`
                        : 'Tap to select subjects'}
                </Text>
                <Icon name="chevron-down" size={moderateScale(16)} color="#94a3b8" />
            </TouchableOpacity>

            {selectedNames.length > 0 && (
                <View style={styles.chipsWrap}>
                    {selectedNames.map(s => (
                        <View key={s._id} style={styles.chip}>
                            <Icon name="book-open" size={moderateScale(12)} color={BRAND} />
                            <Text allowFontScaling={false} style={styles.chipText}>{s.name}</Text>
                            <TouchableOpacity
                                onPress={() => removeSubject(s._id)}
                                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                            >
                                <Icon name="x" size={moderateScale(12)} color={BRAND} style={{ opacity: 0.6 }} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            <Button
                label="Submit Application"
                icon="send"
                loading={submitting}
                disabled={!canSubmit}
                fullWidth
                onPress={handleSubmit}
                style={styles.submitBtn}
            />

            {/* ── Subject Bottom Sheet ──────────────────────────────────── */}
            <BottomSheet
                visible={sheetVisible}
                onClose={() => !loadingSubjects && setSheetVisible(false)}
                title="Select Subjects"
                heightPercent={0.6}
                scrollable={true}
                primaryBtn={{
                    label: 'Confirm',
                    onPress: confirmSelection,
                    icon: 'check',
                    disabled: tempSelected.length === 0,
                }}
                secondaryBtn={{
                    label: 'Cancel',
                    onPress: () => setSheetVisible(false),
                }}
            >
                {loadingSubjects ? (
                    <Loader message="Loading subjects..." />
                ) : (
                    <View>
                        {subjects.map(s => {
                            const isSel = tempSelected.includes(s._id);
                            return (
                                <TouchableOpacity
                                    key={s._id}
                                    style={styles.subjectRow}
                                    onPress={() => toggleTemp(s._id)}
                                    activeOpacity={0.7}
                                >
                                    <Text allowFontScaling={false} style={styles.subjectRowText}>
                                        {s.name}
                                    </Text>
                                    <View style={[styles.checkCircle, isSel && styles.checkCircleSel]}>
                                        {isSel && (
                                            <Icon name="check" size={moderateScale(12)} color="#fff" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </BottomSheet>

            {/* ── AppModal ─────────────────────────────────────────────── */}
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

// ─── Status Tab ───────────────────────────────────────────────────────────────
const StatusTab = () => {
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

    const showError = (title, message) => setModal({ visible: true, title, message });
    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => { loadApplication(); }, []);

    const loadApplication = async () => {
        setLoading(true);
        try {
            const res = await api.get('/teacher-applications/my-application');
            const list = Array.isArray(res) ? res : (res.data || []);
            setApplications(list);
        } catch (err) {
            if (err.response?.status === 404) {
                setApplications([]);
            } else {
                showError('Error', 'The application could not be loaded. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader message="Loading application..." />;

    if (!applications) {
        return (
            <View style={styles.emptyWrap}>
                <View style={styles.emptyIconCircle}>
                    <Icon name="file-text" size={moderateScale(28)} color="#cbd5e1" />
                </View>
                <Text allowFontScaling={false} style={styles.emptyTitle}>No Application Yet</Text>
            </View>
        );
    }

    const subjectNames = applications?.subjects
        ?.map(s => (typeof s === 'object' ? s.name : s))
        .join(', ') || '—';

    const appliedDate = applications?.createdAt
        ? new Date(applications.createdAt).toLocaleDateString('en-PK', {
            day: 'numeric', month: 'short', year: 'numeric',
        })
        : '—';

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabBody}>

            {applications.map((application) => {
                const subjectNames = application.subjects
                    ?.map(s => (typeof s === 'object' ? s.name : s))
                    .join(', ') || '—';

                const appliedDate = application.createdAt
                    ? new Date(application.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric', month: 'short', year: 'numeric',
                    })
                    : '—';

                return (
                    <View key={application._id} style={styles.statusCard}>
                        <View style={styles.statusTop}>
                            <View style={styles.statusIconCircle}>
                                <Icon name="file-text" size={moderateScale(18)} color={BRAND} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <StatusBadge status={application.status} />
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Icon name="calendar" size={moderateScale(13)} color="#64748b" />
                            <Text allowFontScaling={false} style={styles.infoLabel}>Applied</Text>
                            <Text allowFontScaling={false} style={styles.infoVal}>{appliedDate}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="book" size={moderateScale(13)} color="#64748b" />
                            <Text allowFontScaling={false} style={styles.infoLabel}>Subjects</Text>
                            <Text allowFontScaling={false} style={[styles.infoVal, { flex: 1 }]}>
                                {subjectNames}
                            </Text>
                        </View>

                        <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                            <Icon name="edit-3" size={moderateScale(13)} color="#64748b" style={{ marginTop: 2 }} />
                            <Text allowFontScaling={false} style={styles.infoLabel}>Experience</Text>
                            <Text allowFontScaling={false} style={[styles.infoVal, { flex: 1, lineHeight: moderateScale(18) }]}>
                                {application.experience}
                            </Text>
                        </View>

                        {/* Rejection reason — sirf tab dikhega jab rejected ho */}
                        {application.status === 'rejected' && application.rejectionReason && (
                            <>
                                <View style={styles.divider} />
                                <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                                    <Icon name="alert-circle" size={moderateScale(13)} color="#a32d2d" style={{ marginTop: 2 }} />
                                    <Text allowFontScaling={false} style={[styles.infoLabel, { color: '#a32d2d' }]}>
                                        Reason
                                    </Text>
                                    <Text allowFontScaling={false} style={[styles.infoVal, { flex: 1, lineHeight: moderateScale(18), color: '#a32d2d' }]}>
                                        {application.rejectionReason}
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

// ─── Main Screen ──────────────────────────────────────────────────────────────
const TeacherApplication = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('apply');

    return (
        <Container
            showHeader={true}
            headerTitle="Teacher Application"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            <View style={styles.tabBar}>
                {['apply', 'status'].map(tab => (
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
                            {tab === 'apply' ? 'Apply' : 'My Application'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {activeTab === 'apply' ? <ApplyTab /> : <StatusTab />}
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
    fieldLabel: { fontSize: moderateScale(13), fontWeight: '600', color: '#334155', marginBottom: verticalScale(8) },
    req: { color: '#e05c5c' },
    subjectTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.4, borderColor: '#dde3ea', borderRadius: moderateScale(14), paddingHorizontal: scale(14), paddingVertical: verticalScale(13), backgroundColor: '#ffffff' },
    subjectTriggerFilled: { borderColor: BRAND },
    subjectTriggerText: { fontSize: moderateScale(14), color: '#94a3b8' },
    subjectTriggerTextFilled: { color: '#1e293b' },
    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(6), marginTop: verticalScale(10) },
    chip: { flexDirection: 'row', alignItems: 'center', gap: scale(5), backgroundColor: '#e8f0f5', borderRadius: moderateScale(20), paddingHorizontal: scale(10), paddingVertical: verticalScale(5) },
    chipText: { fontSize: moderateScale(12), fontWeight: '500', color: BRAND },
    submitBtn: { marginTop: verticalScale(24) },
    subjectRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: verticalScale(13), borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9' },
    subjectRowText: { fontSize: moderateScale(14), color: '#0f172a', flex: 1 },
    checkCircle: { width: scale(22), height: scale(22), borderRadius: scale(11), borderWidth: 1.5, borderColor: '#dde3ea', alignItems: 'center', justifyContent: 'center' },
    checkCircleSel: { backgroundColor: BRAND, borderColor: BRAND },
    badge: { flexDirection: 'row', alignItems: 'center', gap: scale(5), borderRadius: moderateScale(20), paddingHorizontal: scale(10), paddingVertical: verticalScale(4), alignSelf: 'flex-start', marginTop: verticalScale(4) },
    badgeText: { fontSize: moderateScale(12), fontWeight: '600' },
    statusCard: { backgroundColor: '#f0f6fa', borderRadius: moderateScale(14), padding: scale(14), marginBottom: verticalScale(14), borderWidth: 1, borderColor: '#d4e4ef' },
    statusTop: { flexDirection: 'row', alignItems: 'center', gap: scale(12) },
    statusIconCircle: { width: scale(40), height: scale(40), borderRadius: scale(20), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    statusCardTitle: { fontSize: moderateScale(15), fontWeight: '700', color: '#0f172a' },
    divider: { height: 1, backgroundColor: '#e2eaf0', marginVertical: verticalScale(12) },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: scale(8), marginBottom: verticalScale(8) },
    infoLabel: { fontSize: moderateScale(12), color: '#64748b', minWidth: scale(70) },
    infoVal: { fontSize: moderateScale(12), fontWeight: '500', color: '#0f172a' },
    hintCard: { backgroundColor: '#fff', borderRadius: moderateScale(12), padding: scale(14), borderWidth: 1, borderColor: '#e8edf2', gap: verticalScale(6) },
    hintHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
    hintTitle: { fontSize: moderateScale(13), fontWeight: '700', color: BRAND },
    hintText: { fontSize: moderateScale(12), color: '#475569', lineHeight: moderateScale(18) },
    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: scale(32), gap: verticalScale(10) },
    emptyIconCircle: { width: scale(64), height: scale(64), borderRadius: scale(32), backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginBottom: verticalScale(4) },
    emptyTitle: { fontSize: moderateScale(16), fontWeight: '800', color: '#334155' },
    emptySubtitle: { fontSize: moderateScale(12.5), color: '#94a3b8', textAlign: 'center', lineHeight: moderateScale(19) },
});

export default TeacherApplication;