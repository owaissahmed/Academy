import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    Animated,
    ScrollView,
    Modal,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Button from './Button';

const BRAND = '#2e4c60';
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BottomSheet = ({
    visible = false,
    onClose,
    title,
    showHandle = true,
    showCloseBtn = true,
    height,
    heightPercent,
    scrollable = false,
    scrollProps = {},
    primaryBtn,
    secondaryBtn,
    footerComponent,
    backdropOpacity = 0.4,
    sheetStyle,
    contentStyle,
    keyboardAware = true,
    children,
}) => {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
                Animated.timing(backdropAnim, { toValue: backdropOpacity, duration: 250, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }),
                Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const sheetHeight = height
        ? height
        : heightPercent
            ? SCREEN_HEIGHT * heightPercent
            : undefined;

    const hasFooter = primaryBtn || secondaryBtn || footerComponent;

    const ContentWrapper = scrollable ? ScrollView : View;
    const contentWrapperProps = scrollable
        ? {
            showsVerticalScrollIndicator: false,
            keyboardShouldPersistTaps: 'handled',
            ...scrollProps,
            style: [styles.content, contentStyle],
            contentContainerStyle: scrollProps?.contentContainerStyle,
        }
        : { style: [styles.content, contentStyle] };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />
                </TouchableWithoutFeedback>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    enabled={keyboardAware}
                    style={styles.kavWrap}
                >
                    <Animated.View
                        style={[
                            styles.sheet,
                            sheetHeight ? { height: sheetHeight } : {},
                            sheetStyle,
                            { transform: [{ translateY: slideAnim }] },
                        ]}
                    >
                        {showHandle && <View style={styles.handle} />}

                        {(title || showCloseBtn) && (
                            <View style={styles.header}>
                                <Text allowFontScaling={false} style={styles.title} numberOfLines={1}>
                                    {title || ''}
                                </Text>
                                {showCloseBtn && (
                                    <TouchableOpacity
                                        onPress={onClose}
                                        style={styles.closeBtn}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    >
                                        <Icon name="x" size={moderateScale(18)} color="#64748b" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {(title || showCloseBtn) && <View style={styles.headerDivider} />}

                        <ContentWrapper {...contentWrapperProps}>
                            {children}
                        </ContentWrapper>

                        {/* ── Footer ───────────────────────────────────── */}
                        {hasFooter && (
                            <View style={styles.footer}>
                                {footerComponent ? (
                                    footerComponent
                                ) : (
                                    <View style={styles.footerBtns}>
                                        {secondaryBtn && (
                                            <View style={styles.btnWrap}>
                                                <Button
                                                    variant="outline"
                                                    label={secondaryBtn.label}
                                                    icon={secondaryBtn.icon}
                                                    iconPosition="left"
                                                    disabled={secondaryBtn.disabled}
                                                    onPress={secondaryBtn.onPress}
                                                    fullWidth
                                                />
                                            </View>
                                        )}
                                        {primaryBtn && (
                                            <View style={styles.btnWrap}>
                                                <Button
                                                    variant="filled"
                                                    label={primaryBtn.label}
                                                    icon={primaryBtn.icon}
                                                    iconPosition="left"
                                                    loading={primaryBtn.loading}
                                                    disabled={primaryBtn.disabled}
                                                    onPress={primaryBtn.onPress}
                                                    fullWidth
                                                />
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000' },
    kavWrap: { justifyContent: 'flex-end' },
    sheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: moderateScale(22),
        borderTopRightRadius: moderateScale(22),
        paddingBottom: verticalScale(28),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 12,
    },
    handle: {
        width: scale(36),
        height: verticalScale(4),
        borderRadius: 4,
        backgroundColor: '#cbd5e1',
        alignSelf: 'center',
        marginTop: verticalScale(10),
        marginBottom: verticalScale(4),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(12),
    },
    title: { fontSize: moderateScale(16), fontWeight: '700', color: '#0f172a', flex: 1 },
    closeBtn: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerDivider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: verticalScale(4) },
    content: { flex: 1, paddingHorizontal: scale(20), paddingTop: verticalScale(8) },
    footer: {
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(12),
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    footerBtns: { flexDirection: 'row', gap: scale(10) },

    // ── Key fix: Button ko View mein wrap karo flex:1 se ──
    btnWrap: { flex: 1 },
});

export default BottomSheet;