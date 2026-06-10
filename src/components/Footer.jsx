import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';

const BRAND = '#2e4c60';
const INACTIVE = '#94a3b8';

// ─── Default 4 tabs — bahar se override bhi kar sakte ho ─────────────────────
const DEFAULT_TABS = [
    { key: 'Home',    label: 'Home',    icon: 'home' },
    { key: 'Enrollments', label: 'Enrollments', icon: 'book-open' },
    { key: 'QuesAns', label: 'Ask Mufti', icon: 'message-circle' },
    { key: 'Announcements',label: 'Announcements',icon: 'volume-2' },
    { key: 'Contact', label: 'Contact Us', icon: 'phone' },
];

const Footer = ({ tabs = DEFAULT_TABS, activeTab, onTabPress }) => {
    return (
        <View style={styles.footer}>
            {tabs.map(tab => {
                const isActive = tab.key === activeTab;
                return (
                    <TouchableOpacity
                        key={tab.key}
                        style={styles.tab}
                        onPress={() => onTabPress?.(tab.key)}
                        activeOpacity={0.7}
                    >
                        {/* Active tab — brand color dot indicator */}
                        {isActive && <View style={styles.activeIndicator} />}

                        <Icon
                            name={tab.icon}
                            size={moderateScale(19)}
                            color={isActive ? BRAND : INACTIVE}
                        />
                        <Text style={[styles.label, isActive && styles.labelActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingBottom: verticalScale(6),   // safe area ke liye thoda extra
        paddingTop: verticalScale(8),
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(4),
        position: 'relative',
    },
    activeIndicator: {
        position: 'absolute',
        top: -verticalScale(8),
        width: scale(28),
        height: 3,
        borderRadius: 2,
        // backgroundColor: BRAND,
    },
    label: {
        fontSize: moderateScale(5),
        color: INACTIVE,
        marginTop: verticalScale(3),
        fontWeight: '500',
    },
    labelActive: {
        color: BRAND,
        fontWeight: '700',
    },
});

export default Footer;