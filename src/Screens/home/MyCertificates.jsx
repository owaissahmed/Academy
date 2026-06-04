import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Animated, Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';
import Logo from '../../Images/landscape-logo.png'
import RoundLogo from '../../Images/new-logo-blue.png'
const BRAND = '#2e4c60';

// ─── Certificate Card ─────────────────────────────────────────────────────────
const CertificateCard = ({ item, index, onPreview }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, delay: index * 80, tension: 70, friction: 9, useNativeDriver: true }),
        ]).start();
    }, []);

    const formattedDate = item.issuedDate
        ? new Date(item.issuedDate).toLocaleDateString('en-PK', {
            day: 'numeric', month: 'short', year: 'numeric',
        })
        : '—';

    return (
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.cardLeft}>
                <View style={styles.iconCircle}>
                    <Icon name="award" size={moderateScale(18)} color={BRAND} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text allowFontScaling={false} style={styles.cardTitle} numberOfLines={1}>
                        {item.templateId?.title || 'Certificate'}
                    </Text>
                    <View style={styles.dateRow}>
                        <Icon name="calendar" size={moderateScale(11)} color="#94a3b8" />
                        <Text allowFontScaling={false} style={styles.dateText}>{formattedDate}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.previewBtn} onPress={() => onPreview(item._id)} activeOpacity={0.8}>
                <Icon name="eye" size={moderateScale(14)} color={BRAND} />
                <Text allowFontScaling={false} style={styles.previewBtnText}>View</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Certificate Preview ──────────────────────────────────────────────────────
const CertificatePreview = ({ data }) => {
    const formattedDate = data.issuedDate
        ? new Date(data.issuedDate).toLocaleDateString('en-PK', {
            day: 'numeric', month: 'long', year: 'numeric',
        })
        : '—';

    return (
        <View style={cert.wrapper}>
            {/* Logo */}
            <Image
                source={Logo}
                style={cert.logo}
                resizeMode="contain"
            />

            {/* Academy name */}
            <Text allowFontScaling={false} style={cert.academyName}>AZHAAR UL ISLAM ACADEMY</Text>


            {/* Certificate title */}
            <Text allowFontScaling={false} style={cert.certTitle}>{data.title}</Text>
            {/* Body text */}
            <Text allowFontScaling={false} style={cert.bodyText}>{data.renderedText?.trim()}</Text>


            {/* Monogram watermark */}
            <Image
                source={RoundLogo}
                style={cert.monogram}
                resizeMode="contain"
            />
        </View>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="award" size={moderateScale(28)} color="#cbd5e1" />
        </View>

        <Text allowFontScaling={false} style={styles.emptyTitle}>
            No Certificates Yet
        </Text>

        <Text allowFontScaling={false} style={styles.emptySubtitle}>
            No certificates have been issued yet.{'\n'}
            Please check back later.
        </Text>
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const MyCertificates = ({ navigation }) => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewing, setPreviewing] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [sheetVisible, setSheetVisible] = useState(false);
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => { loadCertificates(); }, []);

    const loadCertificates = async () => {
        setLoading(true);
        try {
            const res = await api.get('/certificates/my');
            const list = res.isSuccess ? (res.data || []) : (Array.isArray(res) ? res : []);
            setCertificates(list.filter(c => c.isActive !== false));
        } catch {
            setModal({ visible: true, title: 'Error', message: 'Certificates load nahi ho sakin. Dobara try karein.' });
        } finally {
            setLoading(false);
        }
    };

    const openPreview = async (id) => {
        setPreviewing(true);
        setSheetVisible(true);
        try {
            const res = await api.get(`/certificates/${id}/preview`);
            const data = res.isSuccess ? res.data : null;
            setPreviewData(data);
        } catch {
            setSheetVisible(false);
            setModal({ visible: true, title: 'Error', message: 'Certificate preview load nahi ho saka.' });
        } finally {
            setPreviewing(false);
        }
    };

    const closePreview = () => {
        setSheetVisible(false);
        setPreviewData(null);
    };

    if (loading) return <Loader message="Loading certificates..." />;

    return (
        <Container
            showHeader={true}
            headerTitle="My Certificates"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {certificates.length === 0 ? (
                <EmptyState />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                >
                    {certificates.map((item, index) => (
                        <CertificateCard
                            key={item._id}
                            item={item}
                            index={index}
                            onPreview={openPreview}
                        />
                    ))}
                </ScrollView>
            )}

            {/* ── Preview Modal ──────────────────────────────── */}
            <AppModal
                visible={sheetVisible}
                onClose={closePreview}
                closeOnBackdrop={true}
                modalStyle={{ width: '95%', paddingHorizontal: moderateScale(10), }}
                primaryBtn={{ label: 'Close', onPress: closePreview }}
            >
                {previewing ? (
                    <View style={styles.previewLoading}>
                        <Loader message="Loading certificate..." />
                    </View>
                ) : previewData ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <CertificatePreview data={previewData} />
                    </ScrollView>
                ) : null}
            </AppModal>

            {/* ── Error Modal ────────────────────────────────── */}
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    scroll: {
        padding: scale(16),
        paddingBottom: verticalScale(24),
    },

    // Card
    card: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(14),
        padding: scale(14),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: '#e2e8f0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
        flex: 1,
        marginRight: scale(10),
    },
    iconCircle: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: verticalScale(3),
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
    },
    dateText: {
        fontSize: moderateScale(11),
        color: '#94a3b8',
        fontWeight: '500',
    },
    previewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
        paddingVertical: verticalScale(7),
        paddingHorizontal: scale(12),
        borderRadius: moderateScale(20),
        backgroundColor: '#e8f0f5',
        borderWidth: 1,
        borderColor: '#d4e4ef',
    },
    previewBtnText: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: BRAND,
    },

    // Preview loading
    previewLoading: {
        height: verticalScale(200),
        alignItems: 'center',
        justifyContent: 'center',
    },

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
});

// ─── Certificate Preview Styles ───────────────────────────────────────────────
const cert = StyleSheet.create({
    wrapper: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(14),
        borderWidth: 1,
        borderColor: '#e2e8f0',
        overflow: 'hidden',
        alignItems: 'center',
        paddingHorizontal: scale(8),
        position: 'relative',
        // paddingBottom: verticalScale(24),
    },
    logo: {
        width: scale(150),
        height: scale(30),
        borderRadius: scale(36),
        marginVertical: verticalScale(10),
    },
    academyName: {
        fontSize: moderateScale(13),
        fontFamily: 'good',
        color: BRAND,
        letterSpacing: 1,
        textAlign: 'center',
        marginBottom: verticalScale(10),
    },

    certTitle: {
        fontSize: moderateScale(17),
        fontWeight: '800',
        color: '#0f172a',
        textAlign: 'center',
        marginBottom: verticalScale(6),
        letterSpacing: 0.3,
    },
    studentName: {
        fontSize: moderateScale(15),
        fontWeight: '700',
        color: BRAND,
        textAlign: 'center',
        marginBottom: verticalScale(14),
    },
    bodyText: {
        fontSize: moderateScale(12.5),
        color: '#334155',
        lineHeight: moderateScale(20),
        textAlign: 'justify',
        marginBottom: verticalScale(16),
    },
    issuedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
        marginBottom: verticalScale(16),
    },
    issuedText: {
        fontSize: moderateScale(11.5),
        color: '#64748b',
        fontWeight: '600',
    },
    monogram: {
        width: scale(180),
        height: scale(165),
        opacity: 0.07,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -scale(80),   // height/2
        marginLeft: -scale(80),  // width/2
    },
});

export default MyCertificates;