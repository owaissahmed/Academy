import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const BRAND = '#2e4c60';

const Loader = ({ message = 'Loading...' }) => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = (dot, delay) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
                    Animated.delay(600),
                ])
            ).start();

        animate(dot1, 0);
        animate(dot2, 200);
        animate(dot3, 400);
    }, []);

    const dotStyle = (anim) => ({
        transform: [{
            translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -verticalScale(6)],
            }),
        }],
        opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
    });

    return (
        <View style={styles.wrap}>
            <View style={styles.dotsRow}>
                <Animated.View style={[styles.dot, dotStyle(dot1)]} />
                <Animated.View style={[styles.dot, dotStyle(dot2)]} />
                <Animated.View style={[styles.dot, dotStyle(dot3)]} />
            </View>
            <Text  allowFontScaling={false} style={styles.msg}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: verticalScale(14),
    },
    dotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    dot: {
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
        backgroundColor: BRAND,
    },
    msg: {
        fontSize: moderateScale(13),
        color: '#94a3b8',
        fontWeight: '500',
    },
});

export default Loader;