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
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

// Status color mapping
const STATUS_MAP = {
    present: { label: 'Present', color: '#10b981' },
    absent: { label: 'Absent', color: '#e05c5c' },
    leave: { label: 'Leave', color: '#f59e0b' },
};

// ─── Selector Row ────────────────────────────────────────────────────────────
const SelectorRow = ({ label, value, placeholder, onPress, disabled, icon = 'chevron-down' }) => (
    <TouchableOpacity
        style={[styles.selectorRow, disabled && styles.selectorRowDisabled]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
        <View style={{ flex: 1 }}>
            <Text allowFontScaling={false} style={styles.selectorLabel}>
                {label}
            </Text>
            <Text
                allowFontScaling={false}
                style={[styles.selectorValue, !value && styles.selectorPlaceholder]}
                numberOfLines={1}
            >
                {value || placeholder}
            </Text>
        </View>
        <Icon name={icon} size={moderateScale(18)} color="#94a3b8" />
    </TouchableOpacity>
);

// ─── Attendance Record Row ────────────────────────────────────────────────────
const AttendanceRecordRow = ({ record, showClassSubject = true }) => {
    const meta = STATUS_MAP[record.status] || { label: record.status, color: '#94a3b8' };
    const displayDate = new Date(record.date);
    const dateStr = displayDate.toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <View style={styles.recordCard}>
            <View style={{ flex: 1 }}>
                {showClassSubject && (
                    <>
                        <Text allowFontScaling={false} style={styles.recordClassSubject}>
                            {record.className} • {record.subjectName}
                        </Text>
                        <Text allowFontScaling={false} style={styles.recordDate}>
                            {dateStr}
                        </Text>
                    </>
                )}
                {!showClassSubject && (
                    <Text allowFontScaling={false} style={styles.recordDate}>
                        {dateStr}
                    </Text>
                )}
            </View>

            <View style={[styles.statusPill, { backgroundColor: `${meta.color}1a`, borderColor: meta.color }]}>
                <Text allowFontScaling={false} style={[styles.statusPillText, { color: meta.color }]}>
                    {meta.label}
                </Text>
            </View>
        </View>
    );
};

// ─── Statistics Card ──────────────────────────────────────────────────────────
const StatisticsCard = ({ total, presentCount, absentCount, leaveCount, percentage }) => (
    <View style={styles.statsContainer}>
        <View style={styles.statItem}>
            <Text allowFontScaling={false} style={styles.statLabel}>Total</Text>
            <Text allowFontScaling={false} style={styles.statValue}>{total}</Text>
        </View>

        <View style={styles.statItem}>
            <Text allowFontScaling={false} style={styles.statLabel}>Present</Text>
            <Text allowFontScaling={false} style={[styles.statValue, { color: '#10b981' }]}>
                {presentCount}
            </Text>
        </View>

        <View style={styles.statItem}>
            <Text allowFontScaling={false} style={styles.statLabel}>Absent</Text>
            <Text allowFontScaling={false} style={[styles.statValue, { color: '#e05c5c' }]}>
                {absentCount}
            </Text>
        </View>

        <View style={styles.statItem}>
            <Text allowFontScaling={false} style={styles.statLabel}>Leave</Text>
            <Text allowFontScaling={false} style={[styles.statValue, { color: '#f59e0b' }]}>
                {leaveCount}
            </Text>
        </View>

        <View style={styles.statItem}>
            <Text allowFontScaling={false} style={styles.statLabel}>%</Text>
            <Text allowFontScaling={false} style={[styles.statValue, { color: BRAND }]}>
                {percentage}%
            </Text>
        </View>
    </View>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon = 'inbox', title, subtitle, onRetry }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name={icon} size={moderateScale(32)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>
            {title}
        </Text>
        <Text allowFontScaling={false} style={styles.emptySubtitle}>
            {subtitle}
        </Text>
        {onRetry && (
            <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
                <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
                <Text allowFontScaling={false} style={styles.retryText}>
                    Retry
                </Text>
            </TouchableOpacity>
        )}
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const UserAttendance = ({ navigation }) => {
    // Data & Loading States
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [enrollments, setEnrollments] = useState([]);

    // Filters (all optional)
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    // Results & Stats
    const [records, setRecords] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        presentCount: 0,
        absentCount: 0,
        leaveCount: 0,
        percentage: '0',
    });

    // Bottom Sheet Visibility
    const [classSheetVisible, setClassSheetVisible] = useState(false);
    const [subjectSheetVisible, setSubjectSheetVisible] = useState(false);
    const [monthSheetVisible, setMonthSheetVisible] = useState(false);
    const [yearSheetVisible, setYearSheetVisible] = useState(false);

    // Modal
    const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });
    const showModal = (type, title, message) => setModal({ visible: true, type, title, message });
    const closeModal = () => setModal(prev => ({ ...prev, visible: false }));

    // Load enrollments on mount
    useEffect(() => {
        loadEnrollments();
    }, []);

    // Auto-load attendance when filters change
    useEffect(() => {
        loadAttendance();
    }, [selectedClass, selectedSubject, selectedMonth, selectedYear]);

    const loadEnrollments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/darse-nizami/my-enrollments');
            const data = Array.isArray(response) ? response : (response.data || []);

            // Transform enrollments to match class/subject structure
            const transformedData = data.map(enrollment => ({
                classId: enrollment.item._id,
                className: enrollment.item.name,
                students: [],
                subjects: enrollment.subjects.map(subject => ({
                    subjectId: subject._id,
                    subjectName: subject.name,
                    marks: subject.marks,
                })),
            }));

            setEnrollments(transformedData);
        } catch (err) {
            setEnrollments([]);
            showModal('error', 'Error', 'Failed to load enrollments');
        } finally {
            setLoading(false);
        }
    };

    const loadAttendance = async () => {
        setFetching(true);
        try {
            let url = '/attendance/my';
            const params = [];

            if (selectedMonth && selectedYear) {
                params.push(`month=${selectedMonth}`);
                params.push(`year=${selectedYear}`);
            }

            if (selectedClass && selectedSubject) {
                params.push(`classId=${selectedClass.classId}`);
                params.push(`subjectId=${selectedSubject.subjectId}`);
            }

            if (params.length > 0) {
                url += '?' + params.join('&');
            }

            const response = await api.get(url);
            const responseData = response.data || response;

            setRecords(responseData.records || []);
            setStats({
                total: responseData.total || 0,
                presentCount: responseData.presentCount || 0,
                absentCount: responseData.absentCount || 0,
                leaveCount: responseData.leaveCount || 0,
                percentage: responseData.percentage || '0',
            });
        } catch (err) {
            setRecords([]);
            setStats({
                total: 0,
                presentCount: 0,
                absentCount: 0,
                leaveCount: 0,
                percentage: '0',
            });
            showModal('error', 'Error', err.message || 'Failed to load attendance');
        } finally {
            setFetching(false);
        }
    };

    const handleSelectClass = (cls) => {
        setClassSheetVisible(false);
        setSelectedClass(cls);
        setSelectedSubject(null);
    };

    const handleSelectSubject = (subject) => {
        setSubjectSheetVisible(false);
        setSelectedSubject(subject);
    };

    const handleMonthChange = (month) => {
        setMonthSheetVisible(false);
        setSelectedMonth(month);
    };

    const handleYearChange = (year) => {
        setYearSheetVisible(false);
        setSelectedYear(year);
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    // Generate year options (current year and 4 years back)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <Container
            showHeader={true}
            headerTitle="My Attendance"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading ..." />}

            {!loading && enrollments.length === 0 && (
                <EmptyState
                    icon="inbox"
                    title="No Enrollments Found"
                    subtitle="You are not enrolled in any classes yet."
                    onRetry={loadEnrollments}
                />
            )}

            {!loading && enrollments.length > 0 && (
                <>
                    {/* ── Filters ───────────────────────────────────────────────– */}
                    <View style={styles.filtersWrapper}>
                        <View style={styles.topSelectors}>
                            <SelectorRow
                                label="Month"
                                value={selectedMonth ? monthNames[selectedMonth - 1] : null}
                                placeholder="All Months"
                                icon="calendar"
                                onPress={() => setMonthSheetVisible(true)}
                            />
                            <SelectorRow
                                label="Year"
                                value={selectedYear ? selectedYear.toString() : null}
                                placeholder="All Years"
                                icon="chevron-down"
                                onPress={() => setYearSheetVisible(true)}
                            />
                        </View>
                        <View style={styles.topSelectors}>
                            <SelectorRow
                                label="Class"
                                value={selectedClass?.className}
                                placeholder="All Classes"
                                onPress={() => setClassSheetVisible(true)}
                            />
                            <SelectorRow
                                label="Subject"
                                value={selectedSubject?.subjectName}
                                placeholder="All Subjects"
                                onPress={() => selectedClass && setSubjectSheetVisible(true)}
                                disabled={!selectedClass}
                            />
                        </View>
                    </View>

                    {/* ── Loading State ───────────────────────────────────── */}
                    {fetching && <Loader message="Loading attendance..." />}

                    {/* ── Results with Stats ──────────────────────────────– */}
                    {!fetching && records.length > 0 && (
                        <>
                            <StatisticsCard
                                total={stats.total}
                                presentCount={stats.presentCount}
                                absentCount={stats.absentCount}
                                leaveCount={stats.leaveCount}
                                percentage={stats.percentage}
                            />
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scroll}
                            >
                                <Text allowFontScaling={false} style={styles.resultCount}>
                                    {records.length} Record{records.length > 1 ? 's' : ''}
                                </Text>
                                {records.map(record => (
                                    <AttendanceRecordRow
                                        key={record._id}
                                        record={record}
                                        showClassSubject={true}
                                    />
                                ))}
                            </ScrollView>
                        </>
                    )}

                    {/* ── No Records Found ──────────────────────────────────– */}
                    {!fetching && records.length === 0 && (
                        <EmptyState
                            icon="inbox"
                            title="No Records Found"
                            subtitle="No attendance records found. Try adjusting your filters."
                            onRetry={loadAttendance}
                        />
                    )}
                </>
            )}

            {/* ── Class Bottom Sheet ────────────────────────────────────– */}
            <BottomSheet
                visible={classSheetVisible}
                onClose={() => setClassSheetVisible(false)}
                title="Select Class"
                heightPercent={0.55}
                scrollable={true}
            >
                <View style={styles.sheetContent}>
                    {enrollments.map(enrollment => {
                        const active = selectedClass?.classId === enrollment.classId;
                        return (
                            <TouchableOpacity
                                key={enrollment.classId}
                                style={[styles.optionRow, active && styles.optionRowActive]}
                                onPress={() => handleSelectClass(enrollment)}
                                activeOpacity={0.8}
                                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                            >
                                <View style={styles.optionIconCircle}>
                                    <Icon name="users" size={moderateScale(16)} color={BRAND} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text allowFontScaling={false} style={styles.optionTitle}>
                                        {enrollment.className}
                                    </Text>
                                    <Text allowFontScaling={false} style={styles.optionSub}>
                                        {enrollment.subjects?.length || 0} Subjects
                                    </Text>
                                </View>
                                {active && (
                                    <Icon name="check-circle" size={moderateScale(18)} color={BRAND} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BottomSheet>

            {/* ── Subject Bottom Sheet ────────────────────────────────── */}
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
                                    <Text allowFontScaling={false} style={styles.optionTitle}>
                                        {subject.subjectName}
                                    </Text>
                                    <Text allowFontScaling={false} style={styles.optionSub}>
                                        {subject.marks} Marks
                                    </Text>
                                </View>
                                {active && (
                                    <Icon name="check-circle" size={moderateScale(18)} color={BRAND} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BottomSheet>

            {/* ── Month Bottom Sheet ───────────────────────────────────– */}
            <BottomSheet
                visible={monthSheetVisible}
                onClose={() => setMonthSheetVisible(false)}
                title="Select Month"
                heightPercent={0.55}
                scrollable={true}
            >
                <View style={styles.sheetContent}>
                    {monthNames.map((month, index) => {
                        const monthNum = index + 1;
                        const active = selectedMonth === monthNum;
                        return (
                            <TouchableOpacity
                                key={monthNum}
                                style={[styles.optionRow, active && styles.optionRowActive]}
                                onPress={() => handleMonthChange(monthNum)}
                                activeOpacity={0.8}
                                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                            >
                                <View style={styles.optionIconCircle}>
                                    <Icon name="calendar" size={moderateScale(16)} color={BRAND} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text allowFontScaling={false} style={styles.optionTitle}>
                                        {month}
                                    </Text>
                                </View>
                                {active && (
                                    <Icon name="check-circle" size={moderateScale(18)} color={BRAND} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BottomSheet>

            {/* ── Year Bottom Sheet ───────────────────────────────────– */}
            <BottomSheet
                visible={yearSheetVisible}
                onClose={() => setYearSheetVisible(false)}
                title="Select Year"
                heightPercent={0.4}
                scrollable={true}
            >
                <View style={styles.sheetContent}>
                    {yearOptions.map(year => {
                        const active = selectedYear === year;
                        return (
                            <TouchableOpacity
                                key={year}
                                style={[styles.optionRow, active && styles.optionRowActive]}
                                onPress={() => handleYearChange(year)}
                                activeOpacity={0.8}
                                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                            >
                                <View style={styles.optionIconCircle}>
                                    <Icon name="calendar" size={moderateScale(16)} color={BRAND} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text allowFontScaling={false} style={styles.optionTitle}>
                                        {year}
                                    </Text>
                                </View>
                                {active && (
                                    <Icon name="check-circle" size={moderateScale(18)} color={BRAND} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BottomSheet>

            {/* ── AppModal ───────────────────────────────────────────── */}
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
    filtersWrapper: {
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        backgroundColor: '#f8fafc',
        borderBottomWidth: 1,
        borderBottomColor: '#e8edf2',
    },

    topSelectors: {
        flexDirection: 'row',
        gap: scale(10),
        marginBottom: verticalScale(8),
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

    selectorRowDisabled: {
        opacity: 0.5,
    },

    selectorLabel: {
        fontSize: moderateScale(10.5),
        color: '#94a3b8',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: verticalScale(2),
    },

    selectorValue: {
        fontSize: moderateScale(13.5),
        fontWeight: '700',
        color: '#0f172a',
    },

    selectorPlaceholder: {
        fontWeight: '500',
        color: '#94a3b8',
    },

    statsContainer: {
        flexDirection: 'row',
        gap: scale(8),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
    },

    statItem: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(12),
        paddingVertical: verticalScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e8edf2',
        gap: verticalScale(4),
    },

    statDot: {
        width: scale(6),
        height: scale(6),
        borderRadius: scale(3),
        backgroundColor: '#10b981',
    },

    statLabel: {
        fontSize: moderateScale(10),
        color: '#94a3b8',
        fontWeight: '600',
        textTransform: 'uppercase',
    },

    statValue: {
        fontSize: moderateScale(11),
        fontWeight: '800',
        color: '#0f172a',
    },

    scroll: {
        padding: scale(16),
        paddingBottom: verticalScale(30),
    },

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
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(10),
        marginBottom: verticalScale(10),
        borderWidth: 1,
        borderColor: '#e8edf2',
        gap: scale(10),
    },

    recordDate: {
        fontSize: moderateScale(13.5),
        fontWeight: '600',
        color: '#0f172a',
    },

    recordClassSubject: {
        fontSize: moderateScale(11),
        color: '#94a3b8',
        fontWeight: '600',
        marginBottom: verticalScale(3),
    },

    statusPill: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(6),
        borderRadius: moderateScale(20),
        borderWidth: 1,
    },

    statusPillText: {
        fontSize: moderateScale(11.5),
        fontWeight: '700',
    },

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

    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        marginTop: verticalScale(4),
        paddingVertical: verticalScale(9),
        paddingHorizontal: scale(20),
        borderRadius: moderateScale(20),
        borderWidth: 1.5,
        borderColor: BRAND,
    },

    retryText: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: BRAND,
    },

    sheetContent: {
        paddingBottom: verticalScale(8),
    },

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

    optionRowActive: {
        borderColor: BRAND,
        backgroundColor: '#f0f6fa',
    },

    optionIconCircle: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
    },

    optionTitle: {
        fontSize: moderateScale(13.5),
        fontWeight: '700',
        color: '#0f172a',
    },

    optionSub: {
        fontSize: moderateScale(11),
        color: '#64748b',
        marginTop: verticalScale(2),
    },
});

export default UserAttendance;
