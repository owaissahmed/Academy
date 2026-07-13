import React from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './Header';
import Footer from './Footer';

const Container = ({
    // Header props
    headerTitle,
    onBack,
    showHeader = true,
    rightIcons = [],

    // Footer props
    tabs,
    activeTab,
    onTabPress,
    showFooter = true,

    // Content
    children,
    style,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* ── Header — top par ─────────────────────────────────────── */}
            {showHeader && (
                <View style={{ paddingTop: Platform.OS === 'android' ? insets.top : 0 }}>
                    <Header
                        title={headerTitle}
                        onBack={onBack}
                        rightIcons={rightIcons}
                    />
                </View>
            )}

            {/* ── Content — darmiyan mein, baaki space le ──────────────── */}
            <View style={[styles.content, style]}>
                {children}
            </View>

            {/* ── Footer — bottom par ───────────────────────────────────── */}
            {showFooter && (
                <View style={{ paddingBottom: Platform.OS === 'android' ? insets.bottom : 0 }}>
                    <Footer
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabPress={onTabPress}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
});

export default Container;
