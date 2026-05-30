import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';

const BRAND = '#2e4c60';

const Header = ({
    title,
    onBack,
    rightIcons = [],
}) => {
    return (
        <View style={styles.header}>

            {/* LEFT ICON */}
            <TouchableOpacity
                onPress={onBack}
                disabled={!onBack}
                style={[styles.iconBtn, !onBack && styles.invisible]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Icon name="arrow-left" size={moderateScale(20)} color={BRAND} />
            </TouchableOpacity>

            {/* TITLE */}
            <Text style={styles.title} numberOfLines={1}>
                {title}
            </Text>

            {/* RIGHT ICON (optional) */}
            <View style={styles.rightContainer}>
                {rightIcons.length > 0 ? (
                    rightIcons.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={item.onPress}
                            style={styles.iconBtn}
                        >
                            <Icon
                                name={item.icon}
                                size={moderateScale(20)}
                                color={item.color || BRAND}
                            />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.iconBtn} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    title: {
        flex: 1,
        textAlign: 'left',
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: '#0f172a',
        letterSpacing: 0.1,
    },
    iconBtn: {
        width: scale(36),
        height: scale(36),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(18),
    },
    invisible: {
        opacity: 0,         // space hold kare, dikhne nahi de
    },
    rightContainer:{
        display:"flex",
        flexDirection:'row'
    }
});

export default Header;