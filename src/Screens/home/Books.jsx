import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import SearchBar from '../../components/SearchBar';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

// ─── Single Book Card ─────────────────────────────────────────────────────────
const BookCard = ({ item, index, onRead, onDownload, downloadingId }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const isDownloading = downloadingId === item._id;

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
                <View style={styles.cardIconCircle}>
                    <Icon name="book" size={moderateScale(16)} color={BRAND} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text allowFontScaling={false} style={styles.cardTitle} numberOfLines={2}>
                        {item.name}
                    </Text>
                    {item.subject?.name && (
                        <Text allowFontScaling={false} style={styles.cardSubject} numberOfLines={1}>
                            {item.subject.name}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.btnRow}>
                <TouchableOpacity
                    style={styles.readBtn}
                    onPress={() => onRead(item)}
                    activeOpacity={0.85}
                >
                    <Icon name="book-open" size={moderateScale(14)} color={BRAND} />
                    <Text allowFontScaling={false} style={styles.readBtnText}>Read</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.downloadBtn, isDownloading && styles.downloadBtnDisabled]}
                    onPress={() => onDownload(item)}
                    activeOpacity={0.85}
                    disabled={isDownloading}
                >
                    <Icon
                        name={isDownloading ? 'loader' : 'download'}
                        size={moderateScale(14)}
                        color="#fff"
                    />
                    <Text allowFontScaling={false} style={styles.downloadBtnText}>
                        {isDownloading ? 'Downloading...' : 'Download'}
                    </Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onRetry, isSearch }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name={isSearch ? 'search' : 'inbox'} size={moderateScale(32)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>
            {isSearch ? 'No Results Found' : 'No Books Found'}
        </Text>
        <Text allowFontScaling={false} style={styles.emptySubtitle}>
            {isSearch
                ? 'Try searching with a different keyword.'
                : 'No books are available at the moment.'}
        </Text>
        {!isSearch && (
            <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
                <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
                <Text allowFontScaling={false} style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
        )}
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Books = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [downloadingId, setDownloadingId] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [activeSubject, setActiveSubject] = useState(null); // null = "All"

    const [modal, setModal] = useState({ visible: false, type: 'info', title: '', message: '' });
    const showModal = (type, title, message) => setModal({ visible: true, type, title, message });
    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => { loadBooks(); }, []);

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

    const loadBooks = async () => {
        setLoading(true);
        try {
            const res = await api.get('/book/all');
            const list = Array.isArray(res) ? res : (res.data || []);
            setData(list.filter(b => b.isActive));
        } catch {
            showModal('error', 'Failed to Load', 'Could not load books. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data
        .filter(item =>
            item.name?.toLowerCase().includes(search.trim().toLowerCase())
        )
        .filter(item =>
            !activeSubject || item.subject?._id === activeSubject._id
        );

    // ─── Read: open inside app via WebView ───────────────────────────────────
    const handleRead = (item) => {
        navigation.navigate('PdfViewer', { url: item.viewUrl, title: item.name });
    };

    // ─── Android storage permission (only needed on older Android) ──────────
    const requestStoragePermission = async () => {
        if (Platform.OS !== 'android' || Platform.Version >= 33) return true;
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'App needs access to storage to download books.',
                    buttonPositive: 'Allow',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch {
            return false;
        }
    };

    // ─── Download: save file to device ───────────────────────────────────────
    const handleDownload = async (item) => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            showModal('warning', 'Permission Required', 'Storage permission is needed to download this book.');
            return;
        }

        setDownloadingId(item._id);
        try {
            const { dirs } = ReactNativeBlobUtil.fs;
            const safeName = item.name.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'book';
            const fileName = `${safeName}.pdf`;

            if (Platform.OS === 'android') {
                // NOTE: dirs.DownloadDir can resolve to the app-sandboxed
                // Android/data/<package>/files/Download folder on some
                // Android versions, which is invisible in Files app / search.
                // Use the true public Downloads path explicitly instead.
                const filePath = `/storage/emulated/0/Download/${fileName}`;

                await ReactNativeBlobUtil.config({
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        title: fileName,
                        description: 'Downloading book',
                        mime: 'application/pdf',
                        mediaScannable: true,
                        path: filePath,
                    },
                }).fetch('GET', item.downloadUrl);
            } else {
                // iOS: no public "Downloads" folder concept — save into the
                // app's Documents dir instead.
                const filePath = `${dirs.DocumentDir}/${fileName}`;
                await ReactNativeBlobUtil.config({ path: filePath }).fetch('GET', item.downloadUrl);
            }

            showModal(
                'success',
                'Download Complete',
                `"${item.name}" has been saved to your device.`
            );
        } catch (err) {
            showModal(
                'error',
                'Download Failed',
                'Something went wrong while downloading this book. Please try again.'
            );
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <Container
            showHeader={true}
            headerTitle="Books"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading books..." />}

            {!loading && (
                <View style={styles.searchWrap}>
                    <SearchBar
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search books..."
                    />
                </View>
            )}

            {!loading && subjects.length > 0 && (
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

            {!loading && filteredData.length === 0 && (
                <EmptyState
                    onRetry={loadBooks}
                    isSearch={data.length > 0 && (search.length > 0 || activeSubject !== null)}
                />
            )}

            {!loading && filteredData.length > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    {filteredData.map((item, index) => (
                        <BookCard
                            key={item._id}
                            item={item}
                            index={index}
                            onRead={handleRead}
                            onDownload={handleDownload}
                            downloadingId={downloadingId}
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
                primaryBtn={{ label: 'OK', onPress: closeModal }}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    searchWrap: {
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
    },
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
    scroll: {
        padding: scale(16),
        paddingTop: verticalScale(4),
        paddingBottom: verticalScale(24),
    },

    // ── Card ──
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
        gap: scale(10),
        marginBottom: verticalScale(12),
    },
    cardIconCircle: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: moderateScale(14.5),
        fontWeight: '700',
        color: '#0f172a',
    },
    cardSubject: {
        fontSize: moderateScale(11.5),
        fontWeight: '600',
        color: BRAND,
        marginTop: verticalScale(2),
    },
    divider: {
        height: 1,
        backgroundColor: '#eef2f6',
        marginBottom: verticalScale(12),
    },
    btnRow: {
        flexDirection: 'row',
        gap: scale(10),
    },
    readBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(6),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(12),
        borderWidth: 1.4,
        borderColor: BRAND,
        backgroundColor: '#ffffff',
    },
    readBtnText: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: BRAND,
    },
    downloadBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(6),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(12),
        backgroundColor: BRAND,
    },
    downloadBtnDisabled: {
        opacity: 0.6,
    },
    downloadBtnText: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: '#ffffff',
    },

    // ── Empty ──
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

export default Books;