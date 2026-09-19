import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, PanResponder, Platform } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BRAND = '#2e4c60';

const ToastContext = createContext(null);

// ─── Provider — app ke top-level pe wrap karo ─────────────────────────────────
export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);
    const translateY = useRef(new Animated.Value(-120)).current;
    const insets = useSafeAreaInsets();
    const hideTimer = useRef(null);

    const showToast = (title, body, onPress) => {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setToast({ title, body, onPress });

        Animated.spring(translateY, {
            toValue: 0,
            tension: 80,
            friction: 10,
            useNativeDriver: true,
        }).start();

        hideTimer.current = setTimeout(hideToast, 4000);
    };

    const hideToast = () => {
        Animated.timing(translateY, {
            toValue: -120,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setToast(null));
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => gesture.dy < -5,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dy < 0) translateY.setValue(gesture.dy);
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy < -30) hideToast();
                else {
                    Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
                }
            },
        })
    ).current;

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.toastWrap,
                        { top: (Platform.OS === 'android' ? insets.top : insets.top) + verticalScale(8), transform: [{ translateY }] },
                    ]}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.toast}
                        onPress={() => {
                            hideToast();
                            toast.onPress?.();
                        }}
                    >
                        <View style={styles.iconCircle}>
                            <Icon name="bell" size={moderateScale(16)} color="#ffffff" />
                        </View>
                        <View style={styles.textWrap}>
                            <Text allowFontScaling={false} style={styles.title} numberOfLines={1}>
                                {toast.title}
                            </Text>
                            <Text allowFontScaling={false} style={styles.body} numberOfLines={2}>
                                {toast.body}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={hideToast} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <Icon name="x" size={moderateScale(16)} color="#94a3b8" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

// ─── Hook — kahin bhi call karo showToast(title, body, onPress) ──────────────
export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
    toastWrap: {
        position: 'absolute',
        left: scale(12),
        right: scale(12),
        zIndex: 9999,
        elevation: 20,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(14),
        padding: scale(12),
        gap: scale(10),
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    iconCircle: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: BRAND,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWrap: {
        flex: 1,
        gap: verticalScale(1),
    },
    title: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: '#1e293b',
    },
    body: {
        fontSize: moderateScale(11.5),
        color: '#64748b',
    },
});