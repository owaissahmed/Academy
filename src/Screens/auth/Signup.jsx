import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';
import { setupNotifications } from '../../utlis/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BRAND = '#2e4c60';

const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());



const sbStyles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -verticalScale(10),
        marginBottom: verticalScale(14),
        paddingHorizontal: scale(2),
        gap: scale(8),
    },
    bars: { flexDirection: 'row', gap: scale(4), flex: 1 },
    bar: { flex: 1, height: 4, borderRadius: 4 },
    label: { fontSize: moderateScale(11), fontWeight: '700', minWidth: scale(40) },
});

const Signup = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [modal, setModal] = useState({
        visible: false, type: 'error',
        title: '', message: '',
        onPrimary: null,
    });

    const fadeCard = useRef(new Animated.Value(0)).current;
    const slideCard = useRef(new Animated.Value(40)).current;

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeCard, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(slideCard, { toValue: 0, useNativeDriver: true, tension: 60 }),
        ]).start();
    }, []);

    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = 'Full name required';
        else if (name.trim().length < 2) e.name = 'Enter a valid name';
        if (!email) e.email = 'Email required';
        else if (!validateEmail(email)) e.email = 'Enter a valid email';
        if (!password) e.password = 'Password required';
        else if (password.length < 3) e.password = 'Min 3 characters';
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleSignup = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await api.post('/auth/register', {
                name: name.trim(),
                email: email.trim(),
                password,
            });
            console.log(response);
            if (response.isSuccess) {
                await AsyncStorage.setItem('token', response.data.token);

                // FCM permission maango + token save karo (background mein)
                setupNotifications(api);

                setModal({
                    visible: true,
                    type: 'success',
                    title: 'Account Created!',
                    message: 'Congratulations! Your account has been successfully created. Complete your profile to get started',
                    onPrimary: () => {
                        closeModal();
                        navigation.navigate('CompleteProfile');
                    },
                });
            } else {
                setModal({
                    visible: true,
                    type: 'error',
                    title: 'Signup Failed',
                    message: response.message || 'Something went wrong',
                    onPrimary: closeModal,
                });
            }
        } catch (error) {
            console.log(error);
            setModal({
                visible: true,
                type: 'error',
                title: 'Error',
                message: error.message || 'Registration failed',
                onPrimary: closeModal,
            });
        } finally {
            setLoading(false);
        }
    };

    const setField = (field, setter) => val => {
        setter(val);
        setErrors(p => ({ ...p, [field]: '' }));
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.inner}>

                    {/* ── Header ───────────────────────────────────────── */}
                    <Animated.View
                        style={[
                            styles.header,
                            { opacity: fadeCard, transform: [{ translateY: slideCard }] },
                        ]}
                    >
                        <Image
                            style={styles.logo}
                            source={require('../../Images/landscape-logo.png')}
                            resizeMode="contain"
                        />
                        <Text allowFontScaling={false} style={styles.subtitle}>Join thousands of learners today</Text>
                    </Animated.View>

                    {/* ── Card ─────────────────────────────────────────── */}
                    <Animated.View
                        style={[
                            styles.card,
                            { opacity: fadeCard, transform: [{ translateY: slideCard }] },
                        ]}
                    >
                        <TextField
                            label="Full Name"
                            value={name}
                            onChangeText={setField('name', setName)}
                            error={errors.name}
                            icon="user"
                        />
                        <TextField
                            label="Email Address"
                            value={email}
                            onChangeText={setField('email', setEmail)}
                            keyboardType="email-address"
                            error={errors.email}
                            icon="mail"
                        />
                        <TextField
                            label="Password"
                            value={password}
                            onChangeText={setField('password', setPassword)}
                            secureTextEntry
                            error={errors.password}
                            icon="lock"
                        />

                        <Button
                            label="Create Account"
                            icon="arrow-right"
                            loading={loading}
                            disabled={loading}
                            fullWidth
                            size="lg"
                            onPress={handleSignup}
                        />
                    </Animated.View>

                    {/* ── Footer ───────────────────────────────────────── */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={styles.footer}
                    >
                        <Text allowFontScaling={false} style={styles.footerText}>
                            Already have an account?{'  '}
                            <Text allowFontScaling={false} style={styles.footerLink}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            {/* ── AppModal ─────────────────────────────────────────────── */}
            <AppModal
                visible={modal.visible}
                onClose={modal.type === 'success' ? undefined : closeModal}
                closeOnBackdrop={modal.type !== 'success'}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryBtn={{
                    label: modal.type === 'success' ? 'Continue' : 'OK',
                    onPress: modal.onPrimary || closeModal,
                }}
            />

        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#f8fafc' },
    scroll: { flexGrow: 1 },
    inner: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: scale(22),
        paddingVertical: verticalScale(32),
    },
    header: {
        alignItems: 'center',
        marginBottom: verticalScale(24),
    },
    logo: {
        height: scale(80),
        width: scale(380),
    },
    subtitle: {
        fontSize: moderateScale(13.5),
        color: '#94a3b8',
        marginTop: verticalScale(10),
        fontWeight: '500',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(22),
        padding: scale(22),
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    footer: { alignItems: 'center', marginTop: verticalScale(22) },
    footerText: { fontSize: moderateScale(13.5), color: '#64748b' },
    footerLink: { color: BRAND, fontWeight: '800' },
});

export default Signup;