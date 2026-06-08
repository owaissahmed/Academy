import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, BackHandler,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Container from '../../components/Container';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

const UpdatePassword = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [modal, setModal] = useState({
        visible: false,
        type: 'info',
        title: '',
        message: '',
        onPrimary: null,
    });

    const showModal = (type, title, message, onPrimary = null) => {
        setModal({ visible: true, type, title, message, onPrimary });
    };
    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            if (submitting) return true;
            return false;
        });
        return () => sub.remove();
    }, [submitting]);

    const canSubmit =
        currentPassword.trim().length >= 3 &&
        newPassword.trim().length >= 3 &&
        !submitting;

    const handleUpdate = async () => {
        if (!canSubmit) return;

        // Frontend validation: new password cannot be same as old
        if (currentPassword.trim() === newPassword.trim()) {
            showModal('warning', 'Invalid Password', 'New password cannot be the same as your current password.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post('/auth/update-password', {
                currentPassword: currentPassword.trim(),
                newPassword: newPassword.trim(),
            });

            if (res.isSuccess) {
                showModal(
                    'success',
                    'Password Updated!',
                    res.message || 'Your password has been changed successfully.',
                    () => {
                        closeModal();
                        navigation.goBack();
                    }
                );
            } else {
                showModal('error', 'Update Failed', res.message || 'Unable to update password.');
            }
        } catch (err) {
            showModal('error', 'Error', err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container
            showHeader={true}
            headerTitle="Update Password"
            onBack={() => !submitting && navigation.goBack()}
            showFooter={false}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.body}
                keyboardShouldPersistTaps="handled"
            >
                {/* Info Banner */}
                <View style={styles.infoBanner}>
                    <Text allowFontScaling={false} style={styles.infoBannerText}>
                        Enter your current password and choose a new one to update your credentials.
                    </Text>
                </View>

                {/* Current Password */}
                <TextField
                    label="Current Password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                />

                <View style={{ marginTop: verticalScale(6) }}>
                    <TextField
                        label="New Password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                </View>

                {/* Inline hint if same passwords */}
                {currentPassword.length > 0 &&
                    newPassword.length > 0 &&
                    currentPassword === newPassword && (
                        <View style={styles.hintRow}>
                            <Text allowFontScaling={false} style={styles.hintText}>
                                ✕  New password cannot be the same as current password
                            </Text>
                        </View>
                    )}

                <Button
                    label="Update Password"
                    icon="lock"
                    loading={submitting}
                    disabled={!canSubmit || currentPassword === newPassword}
                    fullWidth
                    onPress={handleUpdate}
                    style={styles.submitBtn}
                />
            </ScrollView>

            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                closeOnBackdrop={!submitting}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryBtn={{
                    label: 'OK',
                    onPress: modal.onPrimary || closeModal,
                }}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    body: {
        padding: scale(16),
        paddingBottom: verticalScale(32),
    },

    infoBanner: {
        backgroundColor: '#f0f6fa',
        borderRadius: moderateScale(10),
        borderLeftWidth: 3,
        borderLeftColor: BRAND,
        padding: scale(12),
        marginBottom: verticalScale(20),
    },
    infoBannerText: {
        fontSize: moderateScale(12.5),
        color: '#475569',
        lineHeight: moderateScale(19),
        fontWeight: '500',
    },

    hintRow: {
        marginTop: verticalScale(8),
        paddingHorizontal: scale(4),
    },
    hintText: {
        fontSize: moderateScale(12),
        color: '#e05c5c',
        fontWeight: '500',
    },

    submitBtn: {
        marginTop: verticalScale(24),
    },
});

export default UpdatePassword;