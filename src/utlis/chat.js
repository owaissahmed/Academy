import { getApp } from '@react-native-firebase/app';
import { getAuth, signInAnonymously } from '@react-native-firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    where,
} from '@react-native-firebase/firestore';

const getDb = () => getFirestore(getApp());

// Firestore rules ke liye zaroori — app start hote hi silently sign-in karo
export const ensureFirebaseAuth = async () => {
    const auth = getAuth(getApp());
    try {
        if (!auth.currentUser) {
            await signInAnonymously(auth);
        }
    } catch (error) {
        console.log('Firebase Auth error:', error.message);
    }
};

// Chat ID hamesha same banega chahe kisi bhi taraf se generate ho (sorted IDs)
export const getChatId = (userIdA, userIdB) => {
    return [userIdA, userIdB].sort().join('_');
};

// undefined ko null mein convert karo — Firestore undefined accept nahi karta
const sanitize = (obj) => {
    const clean = {};
    Object.keys(obj).forEach((key) => {
        clean[key] = obj[key] === undefined ? null : obj[key];
    });
    return clean;
};

// Chat document create karo (agar exist nahi karta) — participants store karta hai
export const ensureChatExists = async (currentUserId, otherUserId, currentUserInfo, otherUserInfo) => {
    if (!currentUserId || !otherUserId) {
        throw new Error('Missing currentUserId or otherUserId for chat');
    }

    const db = getDb();
    const chatId = getChatId(currentUserId, otherUserId);
    const chatRef = doc(db, 'chats', chatId);

    await setDoc(
        chatRef,
        {
            participantIds: [currentUserId, otherUserId],
            participants: {
                [currentUserId]: sanitize(currentUserInfo || {}),
                [otherUserId]: sanitize(otherUserInfo || {}),
            },
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );

    return chatId;
};

// Message bhejo
export const sendMessage = async (chatId, senderId, text) => {
    if (!chatId || !senderId || !text) {
        throw new Error('Missing chatId, senderId or text');
    }

    const db = getDb();
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    await addDoc(messagesRef, {
        senderId,
        text: text.trim(),
        timestamp: serverTimestamp(),
        isRead: false,
    });

    // Chat doc ka lastMessage update karo (list screen ke liye)
    const chatRef = doc(db, 'chats', chatId);
    await setDoc(
        chatRef,
        {
            lastMessage: text.trim(),
            lastMessageAt: serverTimestamp(),
            lastMessageSenderId: senderId,
        },
        { merge: true }
    );
};

// Real-time messages listen karo ek chat ke — callback ko array milega
export const listenToMessages = (chatId, callback) => {
    const db = getDb();
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(messages);
    });
};

// Admin ki conversations list — jin users se pehle baat hui
export const listenToConversations = (adminId, callback) => {
    const db = getDb();
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participantIds', 'array-contains', adminId));

    return onSnapshot(q, (snapshot) => {
        const conversations = snapshot.docs
            ?.map((d) => ({ id: d.id, ...d.data() }))
            ?.filter((c) => c.lastMessage) // sirf wo jin mein kam se kam ek message ho
            ?.sort((a, b) => {
                const aTime = a.lastMessageAt?.toMillis ? a.lastMessageAt.toMillis() : 0;
                const bTime = b.lastMessageAt?.toMillis ? b.lastMessageAt.toMillis() : 0;
                return bTime - aTime; // newest first
            });
        callback(conversations);
    });
};