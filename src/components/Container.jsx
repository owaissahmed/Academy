import React from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import Header from './Header';
import Footer from './Footer';

/**
 * Container — full screen layout
 *
 * Props:
 *  — Header:
 *      headerTitle   (string)    → Header ka title
 *      onBack        (function)  → Back arrow press handler; nahi diya toh arrow hidden
 *      showHeader    (bool)      → default true; false karo agar header nahi chahiye
 *
 *  — Footer:
 *      tabs          (array)     → custom tabs [{key, label, icon}]; default 4 tabs
 *      activeTab     (string)    → active tab ki key
 *      onTabPress    (function)  → (key) => void
 *      showFooter    (bool)      → default true; false karo agar footer nahi chahiye
 *
 *  — Layout:
 *      children                 → screen ka main content (beech mein render hoga)
 *      style                    → content area ka extra style
 */
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
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* ── Header — top par ─────────────────────────────────────── */}
            {showHeader && (
                <Header
                    title={headerTitle}
                    onBack={onBack}
                    rightIcons={rightIcons}
                />
            )}

            {/* ── Content — darmiyan mein, baaki space le ──────────────── */}
            <View style={[styles.content, style]}>
                {children}
            </View>

            {/* ── Footer — bottom par ───────────────────────────────────── */}
            {showFooter && (
                <Footer
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabPress={onTabPress}
                />
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
        flex: 1,            // header or footer k beech jo space bache woh le lo
        backgroundColor: '#f8fafc',
    },
});

export default Container;