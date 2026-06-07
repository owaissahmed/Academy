import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';



// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onRetry }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconCircle}>
            <Icon name="bell" size={moderateScale(32)} color="#cbd5e1" />
        </View>
        <Text allowFontScaling={false} style={styles.emptyTitle}>
            No Notifications
        </Text>
        {/* <TouchableOpacity
            style={styles.retryBtn}
            onPress={onRetry}
            activeOpacity={0.8}
        >
            <Icon name="refresh-cw" size={moderateScale(14)} color={BRAND} />
            <Text allowFontScaling={false} style={styles.retryText}>
                Retry
            </Text>
        </TouchableOpacity> */}
    </View>
);
// ─── Main Screen ──────────────────────────────────────────────────────────────
const Notification = ({ navigation }) => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });



    return (
        <Container
            showHeader={true}
            headerTitle="Notifications"
            onBack={() => navigation.goBack()}
            showFooter={false}
        >
            {loading && <Loader message="Loading tests..." />}

            {!loading && tests.length === 0 && (
                <EmptyState />
            )}

        </Container>
    );
};

const styles = StyleSheet.create({
    scroll: {
        padding: scale(16),
        paddingBottom: verticalScale(24),
    },

    // ── Card
    

    // ── Empty
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(32),
        gap: verticalScale(10),
    },
    emptyIconCircle: {
        width: scale(72),
        height: scale(72),
        borderRadius: scale(36),
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(4),
    },
    emptyTitle: {
        fontSize: moderateScale(16),
        fontWeight: '800',
        color: '#334155',
    },
    emptySubtitle: {
        fontSize: moderateScale(12.5),
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: moderateScale(19),
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        marginTop: verticalScale(8),
        paddingVertical: verticalScale(9),
        paddingHorizontal: scale(20),
        borderRadius: moderateScale(20),
        borderWidth: 1.5,
        borderColor: BRAND,
    },
    retryText: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: BRAND,
    },
});

export default Notification;