import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import { api } from '../../utlis/api';
import { getScreenFromNotificationData } from '../../utlis/Notificationnavigation';
import { notificationEvents } from '../../utlis/notificationEvents';

const BRAND = '#2e4c60';

// ─── Time ago helper ───────────────────────────────────────────────────────────
const timeAgo = (dateString) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString();
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="bell" size={moderateScale(32)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>
            No Notifications
        </Text>
    </View>
);

// ─── Notification Card ─────────────────────────────────────────────────────────
const NotificationCard = ({ item, onPress }) => (
    <TouchableOpacity
        style={[styles.card, !item.isRead && styles.cardUnread]}
        onPress={() => onPress(item)}
        activeOpacity={0.7}
    >
        {!item.isRead && <View style={styles.unreadDot} />}
        <View style={styles.cardIconCircle}>
            <Icon name="bell" size={moderateScale(18)} color={BRAND} />
        </View>
        <View style={styles.cardContent}>
            <Text allowFontScaling={false} style={styles.cardTitle} numberOfLines={1}>
                {item.title}
            </Text>
            <Text allowFontScaling={false} style={styles.cardBody} numberOfLines={2}>
                {item.body}
            </Text>
            <Text allowFontScaling={false} style={styles.cardTime}>
                {timeAgo(item.createdAt)}
            </Text>
        </View>
    </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Notification = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await api.get('/notifications?limit=15');
            setNotifications(response.data || []);
        } catch (error) {
            console.log('Fetch notifications error:', error.message);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchNotifications().finally(() => setLoading(false));
    }, [fetchNotifications]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    const hasUnread = notifications.some((n) => !n.isRead);

    const handleMarkAllRead = async () => {
        if (!hasUnread) return;
        // Local state turant update karo
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        try {
            await api.post('/notifications/mark-all-read');
            notificationEvents.emit(); // Home ka badge bhi refresh ho jaye
        } catch (error) {
            console.log('Mark all read error:', error.message);
        }
    };

    const handlePress = async (item) => {
        // Local state turant update karo (snappy feel)
        if (!item.isRead) {
            setNotifications((prev) =>
                prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n))
            );
            api.post(`/notifications/mark-read/${item._id}`)
                .then(() => notificationEvents.emit())
                .catch(() => { });
        }

        const screen = getScreenFromNotificationData({ type: item.type });
        if (screen && screen !== 'Notification') {
            navigation.navigate(screen, { id: item.relatedId });
        }
    };

    return (
        <Container
            showHeader={true}
            headerTitle="Notifications"
            onBack={() => navigation.goBack()}
            showFooter={false}
            rightIcons={
                hasUnread
                    ? [
                          {
                              icon: 'check-circle',
                              onPress: handleMarkAllRead,
                              color: '#2e4c60',
                          },
                      ]
                    : []
            }
        >
            {loading && <Loader message="Loading notifications..." />}

            {!loading && notifications.length === 0 && <EmptyState />}

            {!loading && notifications.length > 0 && (
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[BRAND]} />
                    }
                >
                    {notifications.map((item) => (
                        <NotificationCard key={item._id} item={item} onPress={handlePress} />
                    ))}
                </ScrollView>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    scroll: {
        padding: scale(16),
        paddingBottom: verticalScale(24),
        gap: verticalScale(10),
    },

    // ── Card
    card: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(14),
        padding: scale(12),
        gap: scale(10),
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        position: 'relative',
    },
    cardUnread: {
        backgroundColor: '#f0f6fa',
        borderColor: '#dceaf0',
    },
    unreadDot: {
        position: 'absolute',
        top: scale(10),
        right: scale(10),
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: '#ef4444',
    },
    cardIconCircle: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: '#e8f0f4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
        gap: verticalScale(2),
    },
    cardTitle: {
        fontSize: moderateScale(13.5),
        fontWeight: '700',
        color: '#1e293b',
    },
    cardBody: {
        fontSize: moderateScale(12),
        color: '#64748b',
        lineHeight: moderateScale(17),
    },
    cardTime: {
        fontSize: moderateScale(10.5),
        color: '#94a3b8',
        marginTop: verticalScale(2),
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
});

export default Notification;