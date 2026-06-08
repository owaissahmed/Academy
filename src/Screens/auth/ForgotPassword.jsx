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

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
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

    const canSubmit = email.trim().length > 0 && !submitting;

    const handleSubmit = async () => {
        if (!canSubmit) return;

        setSubmitting(true);
        try {
            const res = await api.post('/auth/forgot-password-request', {
                email: email.trim(),
            });

            if (res.isSuccess) {
                showModal(
                    'success',
                    'Request Sent!',
                    res.message || 'Password reset instructions have been sent to your email.',
                    () => {
                        closeModal();
                        navigation.goBack();
                    }
                );
            } else {
                showModal('error', 'Request Failed', res.message || 'Unable to process your request.');
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
            headerTitle="Forgot Password"
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
                        Enter your registered email address.
                    </Text>
                </View>

                <TextField
                    label="Email Address"
                    placeholder="Enter your email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Button
                    label="Send"
                    icon="mail"
                    loading={submitting}
                    disabled={!canSubmit}
                    fullWidth
                    onPress={handleSubmit}
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

    submitBtn: {
        marginTop: verticalScale(8),
    },
});

export default ForgotPassword;