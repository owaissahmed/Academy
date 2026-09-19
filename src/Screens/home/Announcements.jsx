import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, TouchableOpacity
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

const EmptyState = ({ onRetry }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="bell-off" size={moderateScale(26)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>No Announcements</Text>
        <Text allowFontScaling={false} style={styles.emptySubtitle}>
            No Announcements Found
        </Text>
        <TouchableOpacity
            style={styles.retryBtn}
            onPress={onRetry}
            activeOpacity={0.8}
        >
            <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
            <Text allowFontScaling={false} style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
    </View>
);
const Announcements = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null); // Preview Image State
    const highlightId = route?.params?.id || null;
    const scrollRef = useRef(null);
    const itemPositions = useRef({});

    const [modal, setModal] = useState({ visible: false, title: '', message: '' });
    const showError = (title, message) => setModal({ visible: true, title, message });
    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => {
        loadAnnouncements();
    }, []);

    // Highlighted item load hone ke baad us tak scroll karo
    useEffect(() => {
        if (!highlightId || announcements.length === 0) return;
        const y = itemPositions.current[highlightId];
        if (y !== undefined && scrollRef.current) {
            setTimeout(() => {
                scrollRef.current.scrollTo({ y: Math.max(y - verticalScale(16), 0), animated: true });
            }, 300);
        }
    }, [highlightId, announcements]);

    const loadAnnouncements = async () => {
        setLoading(true);
        try {
            const res = await api.get('/announcement/all');
            // Safe extraction pattern for wrapper response structure
            const list = res.isSuccess ? (res.data || []) : (Array.isArray(res) ? res : []);

            // Filtering out inactive notices if needed
            const activeItems = list.filter(item => item.isActive !== false);
            setAnnouncements(activeItems);
        } catch (err) {
            showError('Error', 'Could not load announcements. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container
            showHeader={true}
            headerTitle="Announcements"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading Announcements..." />}
            {!loading && announcements.length === 0 && (
                <EmptyState onRetry={loadAnnouncements} />
            )}

            {!loading && announcements.length > 0 && (
                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollBody}
                >
                    {announcements.map((item) => {
                        const formattedDate = item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString('en-PK', {
                                day: 'numeric', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit', hour12: true
                            })
                            : '—';

                        const isHighlighted = highlightId && item._id === highlightId;

                        return (
                            <View
                                key={item._id}
                                onLayout={(e) => {
                                    itemPositions.current[item._id] = e.nativeEvent.layout.y;
                                }}
                                style={[styles.announcementCard, isHighlighted && styles.announcementCardHighlighted]}
                            >
                                {/* Header Row: Badge Icon, Title & Stamp */}
                                <View style={styles.cardHeader}>
                                    <View style={styles.bellIconBox}>
                                        <Icon name="bell" size={moderateScale(16)} color={BRAND} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text allowFontScaling={false} style={styles.cardTitle}>
                                            {item.title}
                                        </Text>
                                        <View style={styles.dateRow}>
                                            <Icon name="calendar" size={moderateScale(11)} color="#64748b" />
                                            <Text allowFontScaling={false} style={styles.dateText}>
                                                {formattedDate}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Body Text */}
                                <Text allowFontScaling={false} style={styles.cardDescription}>
                                    {item.description}
                                </Text>

                                {/* Exact Attachment Preview Row Integration */}
                                {item.image && (
                                    <TouchableOpacity
                                        style={styles.screenshotRow}
                                        onPress={() => setSelectedImg(item.image)}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            source={{ uri: item.image }}
                                            style={styles.screenshotThumb}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.screenshotInfo}>
                                            <Text allowFontScaling={false} style={styles.screenshotSub}>Tap to view full image</Text>
                                        </View>
                                        <Icon name="eye" size={moderateScale(15)} color="#94a3b8" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            )}

            {/* ─── Media Preview Full-View Modal ─── */}
            <AppModal
                visible={!!selectedImg}
                onClose={() => setSelectedImg(null)}
                closeOnBackdrop={true}
                primaryBtn={{
                    label: 'Close',
                    onPress: () => setSelectedImg(null)
                }}
            >
                <View style={styles.fullImageContainer}>
                    {selectedImg && (
                        <Image
                            source={{ uri: selectedImg }}
                            style={styles.fullViewImage}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </AppModal>

            {/* Error App Modal */}
            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type="error"
                title={modal.title}
                message={modal.message}
                primaryBtn={{ label: 'OK', onPress: closeModal }}
            />
        </Container>
    );
};

// ─── Design Sheet Styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
    scrollBody: {
        padding: scale(16),
        paddingBottom: verticalScale(32)
    },
    announcementCard: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(14),
        padding: scale(14),
        marginBottom: verticalScale(14),
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2
    },
    announcementCardHighlighted: {
        borderColor: BRAND,
        borderWidth: 2,
        backgroundColor: '#f0f6fa',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        marginBottom: verticalScale(10)
    },
    bellIconBox: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardTitle: {
        fontSize: moderateScale(14.5),
        fontWeight: '700',
        color: '#0f172a'
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        marginTop: verticalScale(2)
    },
    dateText: {
        fontSize: moderateScale(11),
        color: '#64748b',
        fontWeight: '500'
    },
    cardDescription: {
        fontSize: moderateScale(13),
        color: '#334155',
        lineHeight: moderateScale(19),
    },

    // Screenshot Row Style Spec
    screenshotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: moderateScale(10),
        padding: scale(8),
        marginTop: verticalScale(12),
    },
    screenshotThumb: {
        width: scale(42),
        height: scale(42),
        borderRadius: moderateScale(6),
        backgroundColor: '#cbd5e1',
    },
    screenshotInfo: {
        flex: 1,
        marginLeft: scale(10),
    },
    screenshotLabel: {
        fontSize: moderateScale(12.5),
        fontWeight: '600',
        color: '#1e293b',
    },
    screenshotSub: {
        fontSize: moderateScale(11),
        color: '#64748b',
        marginTop: verticalScale(1),
    },

    // Full View Modal Canvas
    fullImageContainer: {
        width: '100%',
        height: verticalScale(280),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: moderateScale(12),
        overflow: 'hidden',
        marginTop: verticalScale(6)
    },
    fullViewImage: {
        width: '100%',
        height: '100%',
    },

    // Empty state handlers
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(32),
        gap: verticalScale(10)
    },
    emptyIconCircle: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(4)
    },
    emptyTitle: {
        fontSize: moderateScale(16),
        fontWeight: '800',
        color: '#334155'
    },
    emptySubtitle: {
        fontSize: moderateScale(12.5),
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: moderateScale(19)
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

export default Announcements;