import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import BottomSheet from '../../components/Bottomsheet';
import AppModal from '../../components/Appmodal';
import DatePicker from '../../components/DatePicker';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

// full-word status map for read-only display (color reused from Mark Attendance)
const STATUS_MAP = {
    present: { label: 'Present', color: '#10b981' },
    absent: { label: 'Absent', color: '#e05c5c' },
    leave: { label: 'Leave', color: '#f59e0b' },
};

const formatDateForApi = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const formatDateForDisplay = (date) => {
    if (!date) return null;
    return date.toLocaleDateString('en-PK', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
};

// ─── Selector Row (Class / Subject / Date trigger) ──────────────────────────
const SelectorRow = ({ label, value, placeholder, onPress, disabled, icon = 'chevron-down' }) => (
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
        <Icon name={icon} size={moderateScale(18)} color="#94a3b8" />
    </TouchableOpacity>
);

// ─── Attendance Record Row (read-only) ──────────────────────────────────────
const AttendanceRecordRow = ({ record }) => {
    const meta = STATUS_MAP[record.status] || { label: record.status, color: '#94a3b8' };
    const initial = record.student?.name?.charAt(0)?.toUpperCase() || '?';

    return (
        <View style={styles.recordCard}>


            <View style={{ flex: 1 }}>
                <Text allowFontScaling={false} style={styles.studentName} numberOfLines={1}>
                    {record.student?.name}
                </Text>
                <Text allowFontScaling={false} style={styles.studentReg}>
                    Reg # {record.regId}
                </Text>
            </View>

            <View style={[styles.statusPill, { backgroundColor: `${meta.color}1a`, borderColor: meta.color }]}>
                <Text allowFontScaling={false} style={[styles.statusPillText, { color: meta.color }]}>
                    {meta.label}
                </Text>
            </View>
        </View>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon = 'inbox', title, subtitle, onRetry }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name={icon} size={moderateScale(32)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>{title}</Text>
        <Text allowFontScaling={false} style={styles.emptySubtitle}>{subtitle}</Text>
        {onRetry && (
            <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
                <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
                <Text allowFontScaling={false} style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
        )}
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ViewAttendance = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [records, setRecords] = useState([]);

    const [classSheetVisible, setClassSheetVisible] = useState(false);
    const [subjectSheetVisible, setSubjectSheetVisible] = useState(false);
    const [dateSheetVisible, setDateSheetVisible] = useState(false);

    const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });
    const showModal = (type, title, message) => setModal({ visible: true, type, title, message });
    const closeModal = () => setModal(prev => ({ ...prev, visible: false }));

    useEffect(() => { loadSubjects(); }, []);

    useEffect(() => {
        if (selectedClass && selectedSubject && selectedDate) {
            loadAttendance();
        } else {
            setRecords([]);
        }
    }, [selectedClass, selectedSubject, selectedDate]);

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

    const loadAttendance = async () => {
        setFetching(true);
        try {
            const dateStr = formatDateForApi(selectedDate);
            const response = await api.get(
                `/attendance/view?classId=${selectedClass.classId}&subjectId=${selectedSubject.subjectId}&date=${dateStr}`
            );
            const list = Array.isArray(response) ? response : (response.data || []);
            setRecords(list);
        } catch (err) {
            setRecords([]);
            showModal('error', 'Error', err.message || 'Failed to load attendance');
        } finally {
            setFetching(false);
        }
    };

    const handleSelectClass = (cls) => {
        setClassSheetVisible(false);
        setSelectedClass(cls);
        setSelectedSubject(null);
        setSelectedDate(null);
        setRecords([]);
    };

    const handleSelectSubject = (subject) => {
        setSubjectSheetVisible(false);
        setSelectedSubject(subject);
        setSelectedDate(null);
        setRecords([]);
    };

    const handleSelectDate = (date) => {
        setSelectedDate(date);
    };

    const allSelected = selectedClass && selectedSubject && selectedDate;

    return (
        <Container
            showHeader={true}
            headerTitle="View Attendance"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading ..." />}
            {!loading && data.length === 0 && (
                <EmptyState
                    icon="inbox"
                    title="No Classes Found"
                    subtitle="Please try again."
                    onRetry={loadSubjects}
                />
            )}

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

                    <View style={styles.dateSelectorWrap}>
                        <SelectorRow
                            label="Date"
                            value={formatDateForDisplay(selectedDate)}
                            placeholder="Select Date"
                            icon="calendar"
                            onPress={() => selectedSubject && setDateSheetVisible(true)}
                            disabled={!selectedSubject}
                        />
                    </View>

                    {fetching && <Loader message="Loading attendance..." />}

                    {!fetching && !allSelected && (
                        <EmptyState
                            icon="calendar"
                            title="Select Class, Subject & Date"
                            subtitle={'Choose a class, subject and date above\nto view marked attendance.'}
                        />
                    )}

                    {!fetching && allSelected && records.length === 0 && (
                        <EmptyState
                            icon="user-x"
                            title="No Records Found"
                            subtitle="Attendance has not been marked for this selection."
                            onRetry={loadAttendance}
                        />
                    )}

                    {!fetching && allSelected && records.length > 0 && (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                            <Text allowFontScaling={false} style={styles.resultCount}>
                                {records.length} Student{records.length > 1 ? 's' : ''}
                            </Text>
                            {records.map(record => (
                                <AttendanceRecordRow key={record._id} record={record} />
                            ))}
                        </ScrollView>
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

            {/* ── Date Picker ────────────────────────────────────────────── */}
            <DatePicker
                visible={dateSheetVisible}
                onClose={() => setDateSheetVisible(false)}
                onSelect={handleSelectDate}
                value={selectedDate}
                dob={false}
                title="Select Date"
            />

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
    dateSelectorWrap: {
        paddingHorizontal: scale(16),
        paddingBottom: verticalScale(8),
        height: scale(75),
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

    scroll: { padding: scale(16), paddingBottom: verticalScale(30) },

    resultCount: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: '#94a3b8',
        marginBottom: verticalScale(10),
        textTransform: 'uppercase',
    },

    recordCard: {
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
    avatarCircle: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: moderateScale(14), fontWeight: '800', color: BRAND },
    studentName: { fontSize: moderateScale(13.5), fontWeight: '700', color: '#0f172a' },
    studentReg: { fontSize: moderateScale(11), color: '#94a3b8', marginTop: verticalScale(2) },

    statusPill: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(5),
        borderRadius: moderateScale(20),
        borderWidth: 1,
    },
    statusPillText: { fontSize: moderateScale(11.5), fontWeight: '700' },

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

export default ViewAttendance;
