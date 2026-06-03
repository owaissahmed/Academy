import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    Modal as RNModal,
    Dimensions,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Button from './Button';

const BRAND = '#2e4c60';

const PRESETS = {
    success: { icon: 'check-circle', iconColor: '#10b981', iconBg: '#d1fae5' },
    error: { icon: 'x-circle', iconColor: '#e05c5c', iconBg: '#fee2e2' },
    warning: { icon: 'alert-triangle', iconColor: '#f59e0b', iconBg: '#fef3c7' },
    info: { icon: 'info', iconColor: BRAND, iconBg: '#e8f0f5' },
    confirm: { icon: 'help-circle', iconColor: '#7c3aed', iconBg: '#ede9fe' },
};

const AppModal = ({
    // Visibility
    visible = false,
    onClose,
    closeOnBackdrop = true,

    // Icon
    icon,
    iconColor,
    iconBg,

    // Text
    title,
    message,

    // Buttons
    primaryBtn,
    secondaryBtn,
    btnLayout = 'row',

    // Style
    backdropOpacity = 0.45,
    modalStyle,

    // Preset
    type,

    // Custom content
    children,
}) => {
    // Initial scale is 0.85 to maintain the layout spring effect smoothly
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(backdropAnim, {
                    toValue: backdropOpacity,
                    duration: 220,
                    useNativeDriver: true
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 65,
                    friction: 9,
                    useNativeDriver: true
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 180,
                    useNativeDriver: true
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.85,
                    duration: 180,
                    useNativeDriver: true
                }),
            ]).start();
        }
    }, [visible, backdropOpacity]);

    // Resolve preset
    const preset = type ? PRESETS[type] : null;
    const resolvedIcon = icon || preset?.icon;
    const resolvedIconColor = iconColor || preset?.iconColor || BRAND;
    const resolvedIconBg = iconBg || preset?.iconBg || '#e8f0f5';

    const hasButtons = primaryBtn || secondaryBtn;

    const modalOpacity = scaleAnim.interpolate({
        inputRange: [0.85, 0.92, 1],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
    });

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* ── Backdrop ─────────────────────────────────────────── */}
                <TouchableWithoutFeedback onPress={closeOnBackdrop ? onClose : undefined}>
                    <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />
                </TouchableWithoutFeedback>

                {/* ── Modal card ────────────────────────────────────────── */}
                <Animated.View
                    style={[
                        styles.card,
                        {
                            opacity: modalOpacity,
                            transform: [{ scale: scaleAnim }]
                        },
                        modalStyle,
                    ]}
                >
                    {/* Icon */}
                    {resolvedIcon && (
                        <View style={[styles.iconCircle, { backgroundColor: resolvedIconBg }]}>
                            <Icon name={resolvedIcon} size={moderateScale(28)} color={resolvedIconColor} />
                        </View>
                    )}

                    {/* Title */}
                    {title && (
                        <Text allowFontScaling={false} style={styles.title}>
                            {title}
                        </Text>
                    )}

                    {/* Message */}
                    {message && (
                        <Text allowFontScaling={false} style={styles.message}>
                            {message}
                        </Text>
                    )}

                    {/* Custom children */}
                    {children && <View style={styles.childrenWrap}>{children}</View>}

                    {/* Buttons */}
                    {hasButtons && (
                        <View style={[
                            styles.btnWrap,
                            btnLayout === 'column' && styles.btnWrapColumn,
                        ]}>
                            {secondaryBtn && (
                                <Button
                                    variant="outline"
                                    size="md"
                                    fullWidth={btnLayout === 'column'}
                                    style={btnLayout === 'row' && styles.btnFlex}
                                    {...secondaryBtn}
                                />
                            )}
                            {primaryBtn && (
                                <Button
                                    variant="filled"
                                    size="md"
                                    fullWidth={btnLayout === 'column'}
                                    style={btnLayout === 'row' && styles.btnFlex}
                                    {...primaryBtn}
                                />
                            )}
                        </View>
                    )}
                </Animated.View>
            </View>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    card: {
        width: Dimensions.get('window').width * 0.85,
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(22),
        paddingHorizontal: scale(24),
        paddingTop: verticalScale(28),
        paddingBottom: verticalScale(22),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
    },

    // Icon
    iconCircle: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(16),
    },

    // Text
    title: {
        fontSize: moderateScale(17),
        fontWeight: '800',
        color: '#0f172a',
        textAlign: 'center',
        marginBottom: verticalScale(8),
        letterSpacing: -0.2,
    },
    message: {
        fontSize: moderateScale(13),
        color: '#64748b',
        textAlign: 'center',
        lineHeight: moderateScale(20),
        marginBottom: verticalScale(4),
    },

    // Children
    childrenWrap: {
        width: '100%',
        marginTop: verticalScale(8),
        marginBottom: verticalScale(4),
    },

    // Buttons
    btnWrap: {
        flexDirection: 'row',
        gap: scale(10),
        marginTop: verticalScale(20),
        width: '100%',
    },
    btnWrapColumn: {
        flexDirection: 'column',
        gap: verticalScale(8),
    },
    btnFlex: {
        flex: 1,
        alignSelf: 'stretch',
    },
});

export default AppModal;