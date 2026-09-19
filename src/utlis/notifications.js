import { getApp } from '@react-native-firebase/app';
import {
    getMessaging,
    requestPermission,
    AuthorizationStatus,
    getToken,
    onMessage,
} from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';

// Notification permission maango (Android 13+ ke liye zaroori)
export const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS ya purane Android versions ke liye
    const messagingInstance = getMessaging(getApp());
    const authStatus = await requestPermission(messagingInstance);
    return (
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL
    );
};

// FCM token generate karo
export const getFcmToken = async () => {
    try {
        const messagingInstance = getMessaging(getApp());
        const token = await getToken(messagingInstance);
        console.log('FCM Token:', token);
        return token;
    } catch (error) {
        console.error('FCM token error:', error);
        return null;
    }
};

// Foreground mein notification aaye to listen karo (app open hote hue)
// onReceive callback ko remoteMessage milega — UI dikhana caller ki zimmedari (toast component)
export const listenForegroundMessages = (onReceive) => {
    const messagingInstance = getMessaging(getApp());
    return onMessage(messagingInstance, async (remoteMessage) => {
        console.log('Foreground notification:', remoteMessage);
        if (onReceive) onReceive(remoteMessage);
    });
};

// Combined helper: permission maango + token lo + backend ko bhejo
// First.jsx (app reopen) aur Login.jsx (fresh login) dono se reuse hoga
export const setupNotifications = async (apiInstance) => {
    try {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) return;

        const fcmToken = await getFcmToken();
        if (fcmToken) {
            await apiInstance.post('/auth/save-fcm-token', { fcmToken });
        }
    } catch (error) {
        console.log('FCM setup error:', error.message);
        // Fail ho bhi jaye to app flow nahi rokna
    }
};