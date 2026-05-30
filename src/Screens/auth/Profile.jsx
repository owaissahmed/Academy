import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import AppModal from '../../components/Appmodal';
import Button from '../../components/Button';
import { api } from '../../utlis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BRAND = '#2e4c60';

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <View style={styles.infoIconWrap}>
            <Icon name={icon} size={moderateScale(14)} color={BRAND} />
        </View>
        <View style={{ flex: 1 }}>
            <Text allowFontScaling={false} style={styles.infoLabel}>{label}</Text>
            <Text allowFontScaling={false} style={styles.infoValue}>{value || '—'}</Text>
        </View>
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Profile = ({ navigation }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({
        visible: false, type: 'info',
        title: '', message: '',
        onPrimary: null, primaryLabel: 'OK',
        showSecondary: false,
    });

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    const showModal = (type, title, message, opts = {}) => {
        setModal({
            visible: true, type, title, message,
            onPrimary: opts.onPrimary || closeModal,
            primaryLabel: opts.primaryLabel || 'OK',
            showSecondary: opts.showSecondary || false,
            onSecondary: opts.onSecondary || closeModal,
            secondaryLabel: opts.secondaryLabel || 'Cancel',
        });
    };

    useEffect(() => { loadProfile(); }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get('/students/profile');
            setProfile(res.data);
            console.log(res.data)
        } catch {
            showModal('error', 'Error', 'Profile load nahi ho saki. Dobara try karein.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = () => {
        console.log('Edit Profile pressed', profile);
        // navigation.navigate('EditProfile', { profile });
    };

    const handleDeleteAccount = () => {
        showModal(
            'error',
            'Delete Account',
            'Kya aap waqai apna account delete karna chahte hain? Yeh amal wapas nahi ho sakta.',
            {
                primaryLabel: 'Delete',
                showSecondary: true,
                secondaryLabel: 'Cancel',
                onSecondary: closeModal,
                onPrimary: () => {
                    closeModal();
                    console.log('Delete Account confirmed', profile?._id);
                    // api call here
                },
            }
        );
    };

    const user = profile?.userId;

    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-PK', {
            day: 'numeric', month: 'short', year: 'numeric',
        })
        : '—';
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setLogoutModalVisible(false);
        navigation.replace('Login');
    };
    return (
        <Container
            showHeader={true}
            headerTitle="My Profile"
            onBack={() => navigation.goBack()}
            showFooter={false}
            rightIcons={[
                {
                    icon: "edit-2",
                    onPress: () => navigation.navigate("EditProfile"),
                },
            ]}
        >
            {loading && <Loader message="Loading profile..." />}

            {!loading && profile && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                >
                    {/* ── Avatar + name ───────────────────────────────── */}
                    <View style={styles.avatarSection}>
                        {profile.profilePic ? (
                            <Image
                                source={{ uri: profile.profilePic }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text allowFontScaling={false} style={styles.avatarInitial}>
                                    {user?.name?.[0]?.toUpperCase() || '?'}
                                </Text>
                            </View>
                        )}

                        <Text allowFontScaling={false} style={styles.name}>{user?.name}</Text>
                        <Text allowFontScaling={false} style={styles.email}>{user?.email}</Text>

                        <View style={styles.roleBadge}>
                            <Icon name="shield" size={moderateScale(11)} color={BRAND} />
                            <Text allowFontScaling={false} style={styles.roleText}>
                                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                            </Text>
                        </View>
                    </View>

                    {/* ── Personal info card ───────────────────────────── */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Icon name="user" size={moderateScale(14)} color={BRAND} />
                            <Text allowFontScaling={false} style={styles.cardTitle}>
                                Personal Information
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <InfoRow icon="users" label="Father's Name" value={profile.fatherName} />
                        <InfoRow icon="calendar" label="Age" value={profile.age?.toString()} />
                        <InfoRow icon="map-pin" label="Address" value={profile.address} />
                        <InfoRow icon="phone" label="Phone" value={profile.phone} />
                        <InfoRow icon="credit-card" label="CNIC" value={profile.cnic} />
                    </View>

                    {/* ── Education card ───────────────────────────────── */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Icon name="book-open" size={moderateScale(14)} color={BRAND} />
                            <Text allowFontScaling={false} style={styles.cardTitle}>
                                Education
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <InfoRow icon="award" label="Education" value={profile.education} />
                        <InfoRow icon="book" label="Islamic Education" value={profile.islamicEducation} />
                        <InfoRow icon="user-check" label="Gender" value={profile.gender} />
                        <InfoRow icon="clock" label="Member Since" value={joinedDate} />
                    </View>

                    {/* ── Action buttons ───────────────────────────────── */}
                    <View style={styles.actionsCard}>
                        <Button
                            label="Logout"
                            icon="log-out"
                            iconPosition="left"
                            variant="outline"
                            fullWidth
                            color="#e05c5c"
                            onPress={() => setLogoutModalVisible(true)}
                            style={styles.actionBtn}
                        />

                    </View>

                </ScrollView>
            )}

            {/* ── AppModal ─────────────────────────────────────────────── */}
            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryBtn={{
                    label: modal.primaryLabel,
                    onPress: modal.onPrimary,
                    color: modal.type === 'error' ? '#e05c5c'
                        : modal.type === 'warning' ? '#f59e0b'
                            : BRAND,
                }}
                secondaryBtn={modal.showSecondary ? {
                    label: modal.secondaryLabel,
                    onPress: modal.onSecondary,
                } : undefined}
            />
            <AppModal
                visible={isLogoutModalVisible}
                onClose={() => setLogoutModalVisible(false)}
                type="warning"
                title="Logout"
                message="Are you sure you want to logout?"

                primaryBtn={{
                    label: "Logout",
                    onPress: handleLogout,
                    color: '#e05c5c',
                }}

                secondaryBtn={{
                    label: "Cancel",
                    onPress: () => setLogoutModalVisible(false),
                }}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    scroll: {
        padding: scale(16),
        paddingBottom: verticalScale(32),
    },

    // ── Avatar section ──
    avatarSection: {
        alignItems: 'center',
        marginBottom: verticalScale(20),
        paddingTop: verticalScale(8),
    },
    avatar: {
        width: scale(90),
        height: scale(90),
        borderRadius: scale(45),
        borderWidth: 3,
        borderColor: '#e8f0f5',
        marginBottom: verticalScale(12),
    },
    avatarFallback: {
        width: scale(90),
        height: scale(90),
        borderRadius: scale(45),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(12),
    },
    avatarInitial: {
        fontSize: moderateScale(32),
        fontWeight: '800',
        color: BRAND,
    },
    name: {
        fontSize: moderateScale(20),
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: verticalScale(4),
    },
    email: {
        fontSize: moderateScale(13),
        color: '#94a3b8',
        marginBottom: verticalScale(10),
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
        backgroundColor: '#e8f0f5',
        borderRadius: moderateScale(20),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(5),
    },
    roleText: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: BRAND,
    },

    // ── Card ──
    card: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        padding: scale(16),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: '#e8edf2',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        marginBottom: verticalScale(10),
    },
    cardTitle: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: BRAND,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginBottom: verticalScale(10),
    },

    // ── Info row ──
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
        paddingVertical: verticalScale(8),
        borderBottomWidth: 0.5,
        borderBottomColor: '#f8fafc',
    },
    infoIconWrap: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: '#f0f6fa',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoLabel: {
        fontSize: moderateScale(11),
        color: '#94a3b8',
        fontWeight: '500',
        marginBottom: verticalScale(2),
    },
    infoValue: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: '#0f172a',
    },

    // ── Actions ──
    actionsCard: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        padding: scale(16),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: '#e8edf2',
        gap: verticalScale(10),
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    actionBtn: {
        alignSelf: 'stretch',
    },
});

export default Profile;