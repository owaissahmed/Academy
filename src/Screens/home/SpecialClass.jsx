import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import AppModal from '../../components/Appmodal';
import Button from '../../components/Button';
import { api } from '../../utlis/api';
import SearchBar from '../../components/SearchBar';
const BRAND = '#2e4c60';

// ─── Subject Chip ─────────────────────────────────────────────────────────────
const SubjectChip = ({ name }) => (
    <View style={styles.chip}>
        <Icon name="book" size={moderateScale(10)} color={BRAND} />
        <Text allowFontScaling={false} style={styles.chipText}>{name}</Text>
    </View>
);

// ─── Class Card ───────────────────────────────────────────────────────────────
const ClassCard = ({ item, onEnroll, enrollingId }) => {
    const [expanded, setExpanded] = useState(false);
    const isEnrolling = enrollingId === item._id;

    return (
        <View style={styles.card}>
            {/* Header row */}
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpanded(p => !p)}
                activeOpacity={0.8}
            >
                <View style={styles.classIconWrap}>
                    <Icon name="book-open" size={moderateScale(18)} color={BRAND} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text allowFontScaling={false} style={styles.className}>{item.name}</Text>
                </View>
                <Icon
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={moderateScale(16)}
                    color="#94a3b8"
                />
            </TouchableOpacity>

            {/* Expanded — subjects + enroll */}
            {expanded && (
                <>
                    <View style={styles.divider} />

                    {/* Subjects */}
                    {item.subjects?.length > 0 ? (
                        <>
                            <Text allowFontScaling={false} style={styles.subjectsLabel}>Subjects</Text>
                            <View style={styles.chipsRow}>
                                {item.subjects.map(s => (
                                    <SubjectChip key={s._id} name={s.name} />
                                ))}
                            </View>
                        </>
                    ) : (
                        <Text allowFontScaling={false} style={styles.noSubjects}>
                            No subjects available.
                        </Text>
                    )}

                    <View style={styles.divider} />

                    {/* Fees summary */}
                    <View style={styles.feesRow}>
                        <View style={styles.feesBox}>
                            <Icon name="credit-card" size={moderateScale(13)} color={BRAND} />
                            <Text allowFontScaling={false} style={styles.feesLabel}>Monthly Fee</Text>
                        </View>
                        <Text allowFontScaling={false} style={styles.feesAmount}>
                            {item?.fees != null
                                ? `Rs. ${item.fees.toLocaleString()}`
                                : 'Not set'}
                        </Text>
                    </View>

                    {/* Enroll button */}
                    <Button
                        label="Enroll Now"
                        icon="user-plus"
                        iconPosition="left"
                        fullWidth
                        onPress={() => onEnroll(item._id)}
                        loading={isEnrolling}
                        disabled={isEnrolling}
                        style={styles.enrollBtn}
                    />
                </>
            )}
        </View>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const SpecialClass = ({ navigation }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState(null);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState({
        visible: false, type: 'error', title: '', message: '', onPrimary: null,
    });

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setLoading(true);

        try {
            const classRes = await api.get('/special/all');

            const classList = Array.isArray(classRes)
                ? classRes.filter(e => e.isActive)
                : (classRes.data || []).filter(e => e.isActive);

            setClasses(classList);
        } catch {
            setModal({
                visible: true,
                type: 'error',
                title: 'Failed to Load',
                message: 'Could not load classes. Please try again.',
                onPrimary: closeModal,
            });
        } finally {
            setLoading(false);
        }
    };
    const filteredClasses = classes.filter(item =>
        item.name?.toLowerCase().includes(search.trim().toLowerCase())
    );
    const handleEnroll = async (classId) => {
        setEnrollingId(classId);
        try {
            const res = await api.post('/special/enroll', { classId: classId });
            setModal({
                visible: true, type: 'success',
                title: 'Enrolled!',
                message: res.message || 'You have been successfully enrolled.',
                onPrimary: closeModal,
            });
        } catch (err) {
            console.log(err)
            setModal({
                visible: true, type: 'error',
                title: 'Enrollment Failed',
                message: err.message || 'Could not enroll. Please try again.',
                onPrimary: closeModal,
            });
        } finally {
            setEnrollingId(null);
        }
    };

    return (
        <Container
            showHeader={true}
            headerTitle="Special Class"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading classes..." />}

            {!loading && (
                <View style={styles.searchWrap}>
                    <SearchBar
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search class..."
                    />
                </View>
            )}

            {!loading && filteredClasses.length === 0 && (
                <View style={styles.emptyWrap}>
                    <View style={styles.emptyIconCircle}>
                        <Icon name={classes.length > 0 ? 'search' : 'inbox'} size={moderateScale(32)} color="#cbd5e1" />
                    </View>
                    <Text allowFontScaling={false} style={styles.emptyTitle}>
                        {classes.length > 0 ? 'No Results Found' : 'No Classes Found'}
                    </Text>
                    <Text allowFontScaling={false} style={styles.emptySubtitle}>
                        {classes.length > 0
                            ? 'Try searching with a different keyword.'
                            : 'No classes are available at the moment.'}
                    </Text>
                    {classes.length === 0 && (
                        <TouchableOpacity style={styles.retryBtn} onPress={loadAll} activeOpacity={0.8}>
                            <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
                            <Text allowFontScaling={false} style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {!loading && filteredClasses.length > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    {filteredClasses.map(item => (
                        <ClassCard
                            key={item._id}
                            item={item}
                            onEnroll={handleEnroll}
                            enrollingId={enrollingId}
                        />
                    ))}
                </ScrollView>
            )}

            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryBtn={{
                    label: modal.type === 'success' ? 'Done' : 'OK',
                    onPress: modal.onPrimary || closeModal,
                    color: modal.type === 'error' ? '#e05c5c'
                        : modal.type === 'warning' ? '#f59e0b'
                            : BRAND,
                }}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    scroll: {
        padding: scale(16),
        paddingTop: verticalScale(0),
        paddingBottom: verticalScale(24),
    },
    searchWrap: {
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
    },
    screenSubtitle: {
        fontSize: moderateScale(13),
        color: '#94a3b8',
        marginBottom: verticalScale(14),
        fontWeight: '500',
    },

    // ── Card
    card: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: '#e8edf2',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(16),
        gap: scale(12),
    },
    classIconWrap: {
        width: scale(42),
        height: scale(42),
        borderRadius: scale(12),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    className: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: verticalScale(2),
    },
    feesText: {
        fontSize: moderateScale(12),
        color: '#64748b',
        fontWeight: '500',
    },

    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginHorizontal: scale(16),
    },

    // ── Subjects
    subjectsLabel: {
        fontSize: moderateScale(11.5),
        fontWeight: '700',
        color: '#94a3b8',
        marginHorizontal: scale(16),
        marginTop: verticalScale(12),
        marginBottom: verticalScale(8),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: scale(16),
        gap: scale(8),
        marginBottom: verticalScale(12),
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
        backgroundColor: '#e8f0f5',
        borderRadius: moderateScale(20),
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(5),
    },
    chipText: {
        fontSize: moderateScale(11.5),
        fontWeight: '600',
        color: BRAND,
    },
    noSubjects: {
        fontSize: moderateScale(12.5),
        color: '#94a3b8',
        marginHorizontal: scale(16),
        marginVertical: verticalScale(12),
    },

    // ── Fees row
    feesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: scale(16),
        marginVertical: verticalScale(12),
    },
    feesBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
    },
    feesLabel: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: '#334155',
    },
    feesAmount: {
        fontSize: moderateScale(15),
        fontWeight: '800',
        color: BRAND,
    },

    // ── Enroll button
    enrollBtn: {
        margin: scale(16),
        marginTop: verticalScale(4),
    },

    // ── Empty
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
        marginTop: verticalScale(8),
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
});

export default SpecialClass;