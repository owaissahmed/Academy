import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import { api } from '../../utlis/api';
import { listenToConversations } from '../../utlis/chat';

const BRAND = '#2e4c60';

// ─── Time ago helper ───────────────────────────────────────────────────────────
const timeAgo = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const diffMs = Date.now() - timestamp.toDate().getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return timestamp.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

// ─── Avatar (profilePic ya initial-based) ─────────────────────────────────────────────────────
const Avatar = ({ name, profilePic }) => {
    if (profilePic) {
        return <Image source={{ uri: profilePic }} style={styles.avatarImage} />;
    }
    return (
        <View style={styles.avatar}>
            <Text allowFontScaling={false} style={styles.avatarText}>
                {name?.[0]?.toUpperCase() || '?'}
            </Text>
        </View>
    );
};

// ─── Conversation Row ───────────────────────────────────────────────────────────
const ConversationRow = ({ item, currentUserId, onPress }) => {
    const otherUserId = item.participantIds.find((id) => id !== currentUserId);
    const otherUser = item.participants?.[otherUserId] || {};
    const isLastMine = item.lastMessageSenderId === currentUserId;

    return (
        <TouchableOpacity style={styles.row} onPress={() => onPress(otherUserId, otherUser.name, otherUser.profilePic)} activeOpacity={0.7}>
            <Avatar name={otherUser.name} profilePic={otherUser.profilePic} />
            <View style={styles.rowContent}>
                <View style={styles.rowTop}>
                    <Text allowFontScaling={false} style={styles.rowName} numberOfLines={1}>
                        {otherUser.name || 'Unknown'}
                    </Text>
                    <Text allowFontScaling={false} style={styles.rowTime}>
                        {timeAgo(item.lastMessageAt)}
                    </Text>
                </View>
                <Text allowFontScaling={false} style={styles.rowMessage} numberOfLines={1}>
                    {isLastMine ? 'You: ' : ''}{item.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ isAdmin }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="message-circle" size={moderateScale(30)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>No Conversations Yet</Text>
        {isAdmin && (
            <Text allowFontScaling={false} style={styles.emptySubtitle}>
                Tap the + button to start a new chat
            </Text>
        )}
    </View>
);

// ─── User Picker Row (for New Chat) ─────────────────────────────────────────────
const UserPickerRow = ({ item, onPress }) => (
    <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.7}>
        <Avatar name={item.name} profilePic={item.profilePic} />
        <View style={styles.rowContent}>
            <Text allowFontScaling={false} style={styles.rowName} numberOfLines={1}>
                {item.name}
            </Text>
            <Text allowFontScaling={false} style={styles.rowSubtext} numberOfLines={1}>
                {item.email}
            </Text>
        </View>
    </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ChatList = ({ navigation }) => {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    // New chat picker state (admin only)
    const [pickerVisible, setPickerVisible] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [usersLoading, setUsersLoading] = useState(false);

    const unsubscribeRef = useRef(null);

    useEffect(() => {
        init();
        return () => {
            if (unsubscribeRef.current) unsubscribeRef.current();
        };
    }, []);

    const init = async () => {
        const [userId, role] = await Promise.all([
            AsyncStorage.getItem('userId'),
            AsyncStorage.getItem('role'),
        ]);
        console.log('ChatList init — userId:', userId, 'role:', role);
        setCurrentUserId(userId);

        if (role === 'admin') {
            setIsAdmin(true);
            unsubscribeRef.current = listenToConversations(userId, (convos) => {
                setConversations(convos);
                setLoading(false);
            });
        } else {
            // Non-admin — seedha admin ke sath chat pe redirect karo
            try {
                const res = await api.get('/chat/admin-info');
                if (res.isSuccess && res.data) {
                    navigation.replace('ChatScreen', {
                        otherUserId: res.data.id,
                        otherUserName: res.data.name,
                    });
                }
            } catch (error) {
                console.log('Admin info fetch error:', error.message);
                setLoading(false);
            }
        }
    };

    const openChat = (otherUserId, otherUserName, otherUserProfilePic) => {
        navigation.navigate('ChatScreen', { otherUserId, otherUserName, otherUserProfilePic });
    };

    // ── New Chat Picker ──────────────────────────────────────────────────────
    const openPicker = async () => {
        setPickerVisible(true);
        if (allUsers.length === 0) {
            setUsersLoading(true);
            try {
                const res = await api.get('/admin/students');
                const list = res.data || [];
                const flattened = list
                    .map((s) => ({
                        _id: s.userId?._id,
                        name: s.userId?.name,
                        email: s.userId?.email,
                        role: s.userId?.role,
                        profilePic: s.profilePic,
                    }))
                    .filter((u) => u._id && u.role !== 'admin');
                setAllUsers(flattened);
            } catch (error) {
                console.log('Users fetch error:', error.message);
            } finally {
                setUsersLoading(false);
            }
        }
    };

    const filteredUsers = allUsers.filter((u) =>
        u.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    const handlePickUser = (user) => {
        setPickerVisible(false);
        setSearchText('');
        openChat(user._id, user.name, user.profilePic);
    };

    // ── Render: New Chat Picker Mode ─────────────────────────────────────────
    if (pickerVisible) {
        return (
            <Container
                showHeader={true}
                headerTitle="New Chat"
                onBack={() => { setPickerVisible(false); setSearchText(''); }}
                showFooter={false}
            >
                <View style={styles.searchWrap}>
                    <Icon name="search" size={moderateScale(16)} color="#94a3b8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search users..."
                        placeholderTextColor="#94a3b8"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {usersLoading ? (
                    <Loader message="Loading users..." />
                ) : (
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <UserPickerRow item={item} onPress={handlePickUser} />}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </Container>
        );
    }

    // ── Render: Conversations List ───────────────────────────────────────────
    return (
        <Container
            showHeader={true}
            headerTitle="Messages"
            onBack={() => navigation.goBack()}
            showFooter={false}
            rightIcons={isAdmin ? [{ icon: 'edit', onPress: openPicker }] : []}
        >
            {loading && <Loader message="Loading conversations..." />}

            {!loading && conversations.length === 0 && <EmptyState isAdmin={isAdmin} />}

            {!loading && conversations.length > 0 && (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ConversationRow item={item} currentUserId={currentUserId} onPress={openChat} />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    listContent: { paddingVertical: verticalScale(4) },
    loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    // ── Row
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(11),
        gap: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    avatar: {
        width: scale(46),
        height: scale(46),
        borderRadius: scale(23),
        backgroundColor: BRAND,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImage: {
        width: scale(46),
        height: scale(46),
        borderRadius: scale(23),
        backgroundColor: '#e2e8f0',
    },
    avatarText: { fontSize: moderateScale(17), fontWeight: '700', color: '#ffffff' },
    rowContent: { flex: 1, gap: verticalScale(2) },
    rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowName: { fontSize: moderateScale(14), fontWeight: '700', color: '#1e293b', flex: 1 },
    rowTime: { fontSize: moderateScale(10.5), color: '#94a3b8', marginLeft: scale(8) },
    rowMessage: { fontSize: moderateScale(12.5), color: '#64748b' },
    rowSubtext: { fontSize: moderateScale(11.5), color: '#94a3b8' },

    // ── Search
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        marginHorizontal: scale(16),
        marginVertical: verticalScale(10),
        paddingHorizontal: scale(12),
        borderRadius: moderateScale(12),
        gap: scale(8),
    },
    searchInput: {
        flex: 1,
        paddingVertical: verticalScale(9),
        fontSize: moderateScale(13),
        color: '#1e293b',
    },

    // ── Empty
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(32),
        gap: verticalScale(8),
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
    emptyTitle: { fontSize: moderateScale(15.5), fontWeight: '800', color: '#334155' },
    emptySubtitle: { fontSize: moderateScale(12), color: '#94a3b8', textAlign: 'center' },
});

export default ChatList;