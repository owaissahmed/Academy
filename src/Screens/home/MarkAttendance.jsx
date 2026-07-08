import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import BottomSheet from '../../components/Bottomsheet';
import AppModal from '../../components/Appmodal';
import Button from '../../components/Button';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

const STATUS_OPTIONS = [
    { key: 'present', label: 'P', color: '#10b981' },
    { key: 'absent', label: 'A', color: '#e05c5c' },
    { key: 'leave', label: 'L', color: '#f59e0b' },
];

// ─── Selector Row (Class / Subject trigger) ──────────────────────────────────
const SelectorRow = ({ label, value, placeholder, onPress, disabled }) => (
    <TouchableOpacity
        style={[styles.selectorRow, disabled && styles.selectorRowDisabled]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
        <View style={{ flex: 1 }}>
            <Text allowFontScaling={false} style={styles.selectorLabel}>{label}</Text>
            <Text
                allowFontScaling={false}
                style={[styles.selectorValue, !value && styles.selectorPlaceholder]}
            >
                {value || placeholder}
            </Text>
        </View>
        <Icon name="chevron-down" size={moderateScale(18)} color="#94a3b8" />
    </TouchableOpacity>
);

// ─── Student Row ──────────────────────────────────────────────────────────────
const StudentRow = ({ student, status, onChangeStatus }) => (
    <View style={styles.studentCard}>

        <View style={{ flex: 1 }}>
            <Text allowFontScaling={false} style={styles.studentName} numberOfLines={1}>
                {student.name}
            </Text>
            <Text allowFontScaling={false} style={styles.studentReg}>
                Reg # {student.regId}
            </Text>
        </View>

        <View style={styles.statusBtnRow}>
            {STATUS_OPTIONS.map(opt => {
                const active = status === opt.key;
                return (
                    <TouchableOpacity
                        key={opt.key}
                        style={[
                            styles.statusBtn,
                            { borderColor: opt.color },
                            active && { backgroundColor: opt.color },
                        ]}
                        onPress={() => onChangeStatus(student._id, opt.key)}
                        activeOpacity={0.8}
                    >
                        <Text
                            allowFontScaling={false}
                            style={[
                                styles.statusBtnText,
                                { color: active ? '#fff' : opt.color },
                            ]}
                        >
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    </View>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onRetry }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="inbox" size={moderateScale(32)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>No Classes Found</Text>
        <Text allowFontScaling={false} style={styles.emptySubtitle}>
            Please try again.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
            <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
            <Text allowFontScaling={false} style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const MarkAttendance = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' | 'leave' }

    const [classSheetVisible, setClassSheetVisible] = useState(false);
    const [subjectSheetVisible, setSubjectSheetVisible] = useState(false);

    const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });
    const showModal = (type, title, message) => setModal({ visible: true, type, title, message });
    const closeModal = () => setModal(prev => ({ ...prev, visible: false }));

    useEffect(() => { loadSubjects(); }, []);

    const loadSubjects = async () => {
        setLoading(true);
        try {
            const response = await api.get('/darse-nizami/teacher/my-subjects');
            const finalData = Array.isArray(response) ? response : (response.data || []);
            setData(finalData);
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const resetSelection = () => {
        setSelectedClass(null);
        setSelectedSubject(null);
        setAttendance({});
    };

    const handleSelectClass = (cls) => {
        setClassSheetVisible(false);
        setSelectedClass(cls);
        setSelectedSubject(null);
        setAttendance({});
    };

    const handleSelectSubject = (subject) => {
        setSubjectSheetVisible(false);
        setSelectedSubject(subject);
        // default every student to "present"
        const defaults = {};
        (selectedClass?.students || []).forEach(s => {
            defaults[s._id] = 'present';
        });
        setAttendance(defaults);
    };

    const handleChangeStatus = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = async () => {
        if (!selectedClass || !selectedSubject) {
            showModal('warning', 'Required', 'Please select class and subject');
            return;
        }
        if (!selectedClass.students || selectedClass.students.length === 0) {
            showModal('warning', 'Required', 'No students found in this class');
            return;
        }

        setSubmitting(true);
        try {
            const records = selectedClass.students.map(s => ({
                student: s._id,
                status: attendance[s._id] || 'present',
            }));

            const payload = {
                classId: selectedClass.classId,
                subjectId: selectedSubject.subjectId,
                records,
            };
            console.log(payload)
            const response = await api.post('/attendance/mark', payload);

            if (response.isSuccess) {
                showModal('success', 'Attendance Marked!', response.message);
                resetSelection();
            } else {
                showModal('error', 'Failed', response.message || 'Failed to mark attendance');
            }
        } catch (err) {
            showModal('error', 'Error', err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const students = selectedClass?.students || [];

    return (
        <Container
            showHeader={true}
            headerTitle="Mark Attendance"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading ..." />}
            {!loading && data.length === 0 && <EmptyState onRetry={loadSubjects} />}

            {!loading && data.length > 0 && (
                <>
                    <View style={styles.topSelectors}>
                        <SelectorRow
                            label="Class"
                            value={selectedClass?.className}
                            placeholder="Select Class"
                            onPress={() => setClassSheetVisible(true)}
                        />
                        <SelectorRow
                            label="Subject"
                            value={selectedSubject?.subjectName}
                            placeholder="Select Subject"
                            onPress={() => selectedClass && setSubjectSheetVisible(true)}
                            disabled={!selectedClass}
                        />
                    </View>

                    {!selectedClass || !selectedSubject ? (
                        <View style={styles.emptyWrap}>
                            <View style={styles.emptyIconCircle}>
                                <Icon name="users" size={moderateScale(32)} color="#cbd5e1" />
                            </View>
                            <Text allowFontScaling={false} style={styles.emptyTitle}>
                                Select Class & Subject
                            </Text>
                            <Text allowFontScaling={false} style={styles.emptySubtitle}>
                                Choose a class and subject above{'\n'}to mark student attendance.
                            </Text>
                        </View>
                    ) : students.length === 0 ? (
                        <View style={styles.emptyWrap}>
                            <View style={styles.emptyIconCircle}>
                                <Icon name="user-x" size={moderateScale(32)} color="#cbd5e1" />
                            </View>
                            <Text allowFontScaling={false} style={styles.emptyTitle}>
                                No Students Found
                            </Text>
                            <Text allowFontScaling={false} style={styles.emptySubtitle}>
                                This class has no enrolled students.
                            </Text>
                        </View>
                    ) : (
                        <>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                                {students.map(student => (
                                    <StudentRow
                                        key={student._id}
                                        student={student}
                                        status={attendance[student._id]}
                                        onChangeStatus={handleChangeStatus}
                                    />
                                ))}
                            </ScrollView>

                            <View style={styles.saveWrap}>
                                <Button
                                    label={submitting ? '' : 'Save'}
                                    iconPosition="left"
                                    onPress={handleSave}
                                    loading={submitting}
                                    disabled={submitting}
                                    fullWidth
                                    size="lg"
                                />
                            </View>
                        </>
                    )}
                </>
            )}

            {/* ── Class Bottom Sheet ─────────────────────────────────────── */}
            <BottomSheet
                visible={classSheetVisible}
                onClose={() => setClassSheetVisible(false)}
                title="Select Class"
                heightPercent={0.55}
                scrollable={true}
            >
                <View style={styles.sheetContent}>
                    {data.map(cls => {
                        const active = selectedClass?.classId === cls.classId;
                        return (
                            <TouchableOpacity
                                key={cls.classId}
                                style={[styles.optionRow, active && styles.optionRowActive]}
                                onPress={() => handleSelectClass(cls)}
                                activeOpacity={0.8}
                                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                            >
                                <View style={styles.optionIconCircle}>
                                    <Icon name="users" size={moderateScale(16)} color={BRAND} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text allowFontScaling={false} style={styles.optionTitle}>{cls.className}</Text>
                                    <Text allowFontScaling={false} style={styles.optionSub}>
                                        {cls.students?.length || 0} Students
                                    </Text>
                                </View>
                                {active && <Icon name="check-circle" size={moderateScale(18)} color={BRAND} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BottomSheet>

            {/* ── Subject Bottom Sheet ───────────────────────────────────── */}
            <BottomSheet
                visible={subjectSheetVisible}
                onClose={() => setSubjectSheetVisible(false)}
                title="Select Subject"
                heightPercent={0.55}
                scrollable={true}
            >
                <View style={styles.sheetContent}>
                    {(selectedClass?.subjects || []).map(subject => {
                        const active = selectedSubject?.subjectId === subject.subjectId;
                        return (
                            <TouchableOpacity
                                key={subject.subjectId}
                                style={[styles.optionRow, active && styles.optionRowActive]}
                                onPress={() => handleSelectSubject(subject)}
                                activeOpacity={0.8}
                                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                            >
                                <View style={styles.optionIconCircle}>
                                    <Icon name="book-open" size={moderateScale(16)} color={BRAND} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text allowFontScaling={false} style={styles.optionTitle}>{subject.subjectName}</Text>
                                    <Text allowFontScaling={false} style={styles.optionSub}>
                                        {subject.marks} Marks
                                    </Text>
                                </View>
                                {active && <Icon name="check-circle" size={moderateScale(18)} color={BRAND} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BottomSheet>

            {/* ── AppModal (Alert replacement) ───────────────────────────── */}
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
    topSelectors: {
        flexDirection: 'row',
        gap: scale(10),
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(8),
    },
    selectorRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(14),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(10),
        borderWidth: 1,
        borderColor: '#e8edf2',
    },
    selectorRowDisabled: { opacity: 0.5 },
    selectorLabel: { fontSize: moderateScale(10.5), color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: verticalScale(2) },
    selectorValue: { fontSize: moderateScale(13.5), fontWeight: '700', color: '#0f172a' },
    selectorPlaceholder: { fontWeight: '500', color: '#94a3b8' },

    scroll: { padding: scale(16), paddingBottom: verticalScale(100) },

    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(14),
        padding: scale(12),
        marginBottom: verticalScale(10),
        borderWidth: 1,
        borderColor: '#e8edf2',
        gap: scale(10),
    },
    avatar: { width: scale(42), height: scale(42), borderRadius: scale(21), backgroundColor: '#e8f0f5' },
    studentName: { fontSize: moderateScale(13.5), fontWeight: '700', color: '#0f172a' },
    studentReg: { fontSize: moderateScale(11), color: '#94a3b8', marginTop: verticalScale(2) },

    statusBtnRow: { flexDirection: 'row', gap: scale(6) },
    statusBtn: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusBtnText: { fontSize: moderateScale(13), fontWeight: '800' },

    saveWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: scale(16),
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e8edf2',
    },
    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: scale(32), gap: verticalScale(10) },
    emptyIconCircle: { width: scale(72), height: scale(72), borderRadius: scale(36), backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginBottom: verticalScale(4) },
    emptyTitle: { fontSize: moderateScale(16), fontWeight: '800', color: '#334155' },
    emptySubtitle: { fontSize: moderateScale(12.5), color: '#94a3b8', textAlign: 'center', lineHeight: moderateScale(19) },
    retryBtn: { flexDirection: 'row', alignItems: 'center', gap: scale(6), marginTop: verticalScale(4), paddingVertical: verticalScale(9), paddingHorizontal: scale(20), borderRadius: moderateScale(20), borderWidth: 1.5, borderColor: BRAND },
    retryText: { fontSize: moderateScale(13), fontWeight: '700', color: BRAND },

    sheetContent: { paddingBottom: verticalScale(8) },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
        backgroundColor: '#fff',
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: '#e8edf2',
        padding: scale(12),
        marginBottom: verticalScale(10),
    },
    optionRowActive: { borderColor: BRAND, backgroundColor: '#f0f6fa' },
    optionIconCircle: { width: scale(36), height: scale(36), borderRadius: scale(18), backgroundColor: '#e8f0f5', alignItems: 'center', justifyContent: 'center' },
    optionTitle: { fontSize: moderateScale(13.5), fontWeight: '700', color: '#0f172a' },
    optionSub: { fontSize: moderateScale(11), color: '#64748b', marginTop: verticalScale(2) },
});

export default MarkAttendance;