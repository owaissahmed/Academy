import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Animated,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import AppModal from '../../components/Appmodal';
import { api } from '../../utlis/api';
const BRAND = '#2e4c60';

const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

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
        if (!email) e.email = 'Email required';
        else if (!validateEmail(email)) e.email = 'Enter a valid email';
        if (!password) e.password = 'Password required';
        else if (password.length < 3) e.password = 'Min 3 characters';
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email: email.trim(), password });
            console.log("FULL RESPONSE:", response);
            console.log("DATA:", response.data);
            if (response.isSuccess) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('name', response.data.name);
                await AsyncStorage.setItem('role', response.data.role);
                navigation.replace('Home');
            } else {
                setModal({
                    visible: true,
                    title: 'Error',
                    message: response.message || 'Connection failed',
                });
            }
        } catch (error) {
            setModal({
                visible: true,
                title: 'Error',
                message: error.message || 'Connection failed',
            });
        } finally {
            setLoading(false);
        }
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
                        <Text style={styles.subtitle}>Sign in to continue learning</Text>
                    </Animated.View>

                    {/* ── Card ─────────────────────────────────────────── */}
                    <Animated.View
                        style={[
                            styles.card,
                            { opacity: fadeCard, transform: [{ translateY: slideCard }] },
                        ]}
                    >
                        <TextField
                            label="Email Address"
                            value={email}
                            onChangeText={t => { setEmail(t); setErrors(p => ({ ...p, email: '' })); }}
                            keyboardType="email-address"
                            error={errors.email}
                            icon="mail"
                        />
                        <TextField
                            label="Password"
                            value={password}
                            onChangeText={t => { setPassword(t); setErrors(p => ({ ...p, password: '' })); }}
                            secureTextEntry
                            error={errors.password}
                            icon="lock"
                        />

                        <TouchableOpacity
                            style={styles.forgot}
                            onPress={() => navigation.navigate('ForgotPassword')}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Text style={styles.forgotText}>Forgot password?</Text>
                        </TouchableOpacity>

                        <Button
                            label="Sign In"
                            icon="arrow-right"
                            loading={loading}
                            disabled={loading}
                            fullWidth
                            size="lg"
                            onPress={handleLogin}
                        />
                    </Animated.View>

                    {/* ── Footer ───────────────────────────────────────── */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                        style={styles.footer}
                    >
                        <Text style={styles.footerText}>
                            Don't have an account?{'  '}
                            <Text style={styles.footerLink}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            {/* ── AppModal ─────────────────────────────────────────────── */}
            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type="error"
                title={modal.title}
                message={modal.message}
                primaryBtn={{ label: 'OK', onPress: closeModal }}
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
        marginBottom: verticalScale(28),
    },
    logo: {
        height: scale(80),
        width: scale(380),
        marginBottom: scale(2),
    },
    subtitle: {
        fontSize: moderateScale(13.5),
        color: '#94a3b8',
        marginTop: verticalScale(10),
        fontWeight: '500',
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
    forgot: {
        alignSelf: 'flex-end',
        marginBottom: verticalScale(18),
        marginTop: -verticalScale(6),
    },
    forgotText: { fontSize: moderateScale(12.5), color: BRAND, fontWeight: '600' },
    footer: { alignItems: 'center', marginTop: verticalScale(22) },
    footerText: { fontSize: moderateScale(13.5), color: '#64748b' },
    footerLink: { color: BRAND, fontWeight: '800' },
});

export default Login;