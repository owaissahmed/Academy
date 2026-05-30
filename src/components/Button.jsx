import React, { useRef, useEffect } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    View,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';

const BRAND = '#2e4c60';

/**
 * Button — Reusable Component
 *
 * ─── Props ───────────────────────────────────────────────────────────────────
 *
 * CONTENT:
 *   label        (string)    — button text
 *   icon         (string)    — Feather icon name (optional)
 *   iconPosition (string)    — 'left' | 'right'  [default: 'right']
 *
 * STATE:
 *   loading      (bool)      — 3-dot loader dikhao
 *   disabled     (bool)      — button disable karo
 *   onPress      (func)      — press handler
 *
 * VARIANT:
 *   variant      (string)    — 'filled' | 'outline' | 'ghost'  [default: 'filled']
 *
 * SIZE:
 *   width        (number)    — fixed width (optional)
 *   fullWidth    (bool)      — 100% width  [default: false]
 *   height       (number)    — custom height (optional)
 *   size         (string)    — 'sm' | 'md' | 'lg'  [default: 'md']
 *
 * COLORS:
 *   color        (string)    — background / border color  [default: BRAND]
 *   textColor    (string)    — label color (auto-set per variant if not given)
 *
 * STYLE:
 *   style        (object)    — extra style on container
 *   borderRadius (number)    — custom border radius
 */

// ─── 3-dot loader ─────────────────────────────────────────────────────────────
const DotsLoader = ({ color = '#ffffff' }) => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = (dot, delay) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, { toValue: 1, duration: 280, useNativeDriver: true }),
                    Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: true }),
                    Animated.delay(560),
                ])
            ).start();

        animate(dot1, 0);
        animate(dot2, 180);
        animate(dot3, 360);
    }, []);

    const dotStyle = (anim) => ({
        transform: [{
            translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -verticalScale(5)] }),
        }],
        opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
    });

    return (
        <View style={dl.row}>
            <Animated.View style={[dl.dot, { backgroundColor: color }, dotStyle(dot1)]} />
            <Animated.View style={[dl.dot, { backgroundColor: color }, dotStyle(dot2)]} />
            <Animated.View style={[dl.dot, { backgroundColor: color }, dotStyle(dot3)]} />
        </View>
    );
};

const dl = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: scale(5) },
    dot: { width: scale(7), height: scale(7), borderRadius: scale(4) },
});

// ─── Size presets ─────────────────────────────────────────────────────────────
const SIZE = {
    sm: { paddingVertical: verticalScale(9),  paddingHorizontal: scale(16), fontSize: moderateScale(12.5) },
    md: { paddingVertical: verticalScale(13), paddingHorizontal: scale(20), fontSize: moderateScale(14)   },
    lg: { paddingVertical: verticalScale(16), paddingHorizontal: scale(24), fontSize: moderateScale(15.5) },
};

// ─── Main component ───────────────────────────────────────────────────────────
const Button = ({
    // Content
    label,
    icon,
    iconPosition = 'right',

    // State
    loading = false,
    disabled = false,
    onPress,

    // Variant
    variant = 'filled',

    // Size
    width,
    fullWidth = false,
    height,
    size = 'md',

    // Colors
    color = BRAND,
    textColor,

    // Style
    style,
    borderRadius,
}) => {
    const sz = SIZE[size] || SIZE.md;

    // Auto text color per variant
    const resolvedTextColor =
        textColor ||
        (variant === 'filled' ? '#ffffff' : color);

    // Container style
    const containerStyle = [
        styles.base,
        {
            paddingVertical: sz.paddingVertical,
            paddingHorizontal: sz.paddingHorizontal,
            borderRadius: borderRadius ?? moderateScale(13),
        },
        // Variant styles
        variant === 'filled' && { backgroundColor: color },
        variant === 'outline' && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: color },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        // Filled shadow
        variant === 'filled' && styles.shadow,
        // Width
        fullWidth && { alignSelf: 'stretch' },
        width && { width },
        height && { height, paddingVertical: 0 },
        // Disabled
        (disabled || loading) && styles.disabled,
        style,
    ];

    const iconSize = moderateScale(size === 'sm' ? 13 : size === 'lg' ? 17 : 15);

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={containerStyle}
            activeOpacity={0.82}
        >
            {loading ? (
                <DotsLoader color={resolvedTextColor} />
            ) : (
                <View style={styles.inner}>
                    {icon && iconPosition === 'left' && (
                        <Icon name={icon} size={iconSize} color={resolvedTextColor} />
                    )}
                    {label && (
                        <Text
                            allowFontScaling={false}
                            style={[styles.label, { fontSize: sz.fontSize, color: resolvedTextColor }]}
                        >
                            {label}
                        </Text>
                    )}
                    {icon && iconPosition === 'right' && (
                        <Icon name={icon} size={iconSize} color={resolvedTextColor} />
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 4,
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(7),
    },
    label: {
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    disabled: {
        opacity: 0.55,
    },
});

export default Button;