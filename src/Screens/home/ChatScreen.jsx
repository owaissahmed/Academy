import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import { api } from '../../utlis/api';
import { ensureChatExists, sendMessage, listenToMessages } from '../../utlis/chat';

const BRAND = '#2e4c60';
const BUBBLE_ME = '#2e4c60';
const BUBBLE_OTHER = '#ffffff';

// ─── Time formatting ────────────────────────────────────────────────────────────
const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatDateDivider = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ─── Message Bubble ─────────────────────────────────────────────────────────────
const MessageBubble = ({ message, isMe }) => (
    <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowOther]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
            <Text
                allowFontScaling={false}
                style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextOther]}
            >
                {message.text}
            </Text>
            <Text
                allowFontScaling={false}
                style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther]}
            >
                {formatTime(message.timestamp)}
            </Text>
        </View>
    </View>
);

// ─── Date Divider ───────────────────────────────────────────────────────────────
const DateDivider = ({ label }) => (
    <View style={styles.dividerRow}>
        <View style={styles.dividerPill}>
            <Text allowFontScaling={false} style={styles.dividerText}>{label}</Text>
        </View>
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
// route.params: { otherUserId, otherUserName, otherUserRole }
const ChatScreen = ({ navigation, route }) => {
    const { otherUserId, otherUserName, otherUserProfilePic } = route.params || {};
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserName, setCurrentUserName] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const listRef = useRef(null);
    const unsubscribeRef = useRef(null);

    useEffect(() => {
        init();
        return () => {
            if (unsubscribeRef.current) unsubscribeRef.current();
        };
    }, []);

    const init = async () => {
        try {
            const [userId, name, role, myProfilePic] = await Promise.all([
                AsyncStorage.getItem('userId'),
                AsyncStorage.getItem('name'),
                AsyncStorage.getItem('role'),
                AsyncStorage.getItem('profilePic'),
            ]);
            setCurrentUserId(userId);
            setCurrentUserName(name);

            const id = await ensureChatExists(
                userId,
                otherUserId,
                { name, role, profilePic: myProfilePic || null },
                { name: otherUserName, role: 'admin', profilePic: otherUserProfilePic || null }
            );
            setChatId(id);

            unsubscribeRef.current = listenToMessages(id, (msgs) => {
                setMessages(msgs);
                setLoading(false);
                setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 100);
            });
        } catch (error) {
            console.log('Chat init error:', error.message);
            setLoading(false);
        }
    };

    const handleSend = async () => {
        const trimmed = text.trim();
        if (!trimmed || !chatId || sending) return;

        setText('');
        setSending(true);
        try {
            await sendMessage(chatId, currentUserId, trimmed);

            // Backend ko chhoti si call — recipient ko FCM push bhejne ke liye (best-effort)
            api.post('/chat/notify', {
                recipientId: otherUserId,
                senderName: currentUserName,
                text: trimmed,
            }).catch(() => { });
        } catch (error) {
            console.log('Send message error:', error.message);
        } finally {
            setSending(false);
        }
    };

    // Messages ko date-grouped list mein convert karo (dividers ke liye)
    const buildListData = () => {
        const items = [];
        let lastDate = null;

        messages.forEach((msg) => {
            const dateLabel = formatDateDivider(msg.timestamp);
            if (dateLabel && dateLabel !== lastDate) {
                items.push({ type: 'divider', id: `divider-${msg.id}`, label: dateLabel });
                lastDate = dateLabel;
            }
            items.push({ type: 'message', id: msg.id, message: msg });
        });

        return items;
    };

    const renderItem = ({ item }) => {
        if (item.type === 'divider') {
            return <DateDivider label={item.label} />;
        }
        const isMe = item.message.senderId === currentUserId;
        return <MessageBubble message={item.message} isMe={isMe} />;
    };

    return (
        <Container
            showHeader={true}
            headerTitle={otherUserName || 'Chat'}
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {loading ? (
                    <Loader message="Loading messages..." />
                ) : (
                    <FlatList
                        ref={listRef}
                        data={buildListData()}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                {/* ── Input Bar ──────────────────────────────────────────── */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#94a3b8"
                        value={text}
                        onChangeText={setText}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        disabled={!text.trim() || sending}
                        activeOpacity={0.8}
                    >
                        <Icon name="send" size={moderateScale(17)} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Container>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    listContent: {
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(10),
        flexGrow: 1,
    },

    // ── Date Divider
    dividerRow: { alignItems: 'center', marginVertical: verticalScale(10) },
    dividerPill: {
        backgroundColor: '#e2e8f0',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(4),
        borderRadius: moderateScale(12),
    },
    dividerText: { fontSize: moderateScale(11), color: '#64748b', fontWeight: '600' },

    // ── Bubbles
    bubbleRow: { flexDirection: 'row', marginBottom: verticalScale(6) },
    bubbleRowMe: { justifyContent: 'flex-end' },
    bubbleRowOther: { justifyContent: 'flex-start' },
    bubble: {
        maxWidth: '78%',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(16),
    },
    bubbleMe: {
        backgroundColor: BUBBLE_ME,
        borderBottomRightRadius: moderateScale(4),
    },
    bubbleOther: {
        backgroundColor: BUBBLE_OTHER,
        borderBottomLeftRadius: moderateScale(4),
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    bubbleText: { fontSize: moderateScale(14), lineHeight: moderateScale(19) },
    bubbleTextMe: { color: '#ffffff' },
    bubbleTextOther: { color: '#1e293b' },
    bubbleTime: { fontSize: moderateScale(9.5), marginTop: verticalScale(3), alignSelf: 'flex-end' },
    bubbleTimeMe: { color: 'rgba(255,255,255,0.7)' },
    bubbleTimeOther: { color: '#94a3b8' },

    // ── Input Bar
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        gap: scale(8),
    },
    input: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        borderRadius: moderateScale(20),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(9),
        fontSize: moderateScale(13.5),
        color: '#1e293b',
        maxHeight: verticalScale(100),
    },
    sendBtn: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: BRAND,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: '#cbd5e1',
    },
});

export default ChatScreen;