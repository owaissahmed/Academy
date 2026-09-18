import { getApp } from '@react-native-firebase/app';
import {
    getMessaging,
    requestPermission,
    AuthorizationStatus,
    getToken,
    onMessage,
} from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

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
export const listenForegroundMessages = () => {
    const messagingInstance = getMessaging(getApp());
    return onMessage(messagingInstance, async (remoteMessage) => {
        console.log('Foreground notification:', remoteMessage);
        const title = remoteMessage.notification?.title || 'New Notification';
        const body = remoteMessage.notification?.body || '';
        Alert.alert(title, body);
    });
};

// dWEIVvqZSj2THdBDFkvjIf:APA91bHgIq8FTuZlm-FTSwJjcXSdwoeDjORXHvZR3rdMppXf3X7Itl75cvQZhIbBaVoppbpeMBzf3JCdA_G7SZ7Uau0QzJYK4otc-dx477gOD6QAk6vDIwc