import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Animated,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextField from '../../components/TextField';
import { api } from '../../utlis/api';
const BRAND = '#2e4c60';

// ─── Dropdown options ─────────────────────────────────────────────────────────
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const EDUCATION_OPTIONS = ['Matric', 'Intermediate', 'BA', 'BSc', 'MA', 'MSc', 'Other'];
const ISLAMIC_OPTIONS = ['None', 'Nazra', 'Quran', 'Hifz', 'Alim'];

// ─── Simple inline dropdown ───────────────────────────────────────────────────
const DropdownField = ({ label, value, options, onSelect, error, icon }) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={dd.wrapper}>
            <TouchableOpacity
                style={[dd.box, { borderColor: error ? '#e05c5c' : open ? BRAND : '#dde3ea' }]}
                onPress={() => setOpen(p => !p)}
                activeOpacity={0.8}
            >
                {/* Left icon */}
                {icon && (
                    <Icon name={icon} size={moderateScale(16)} color={open ? BRAND : '#94a3b8'} style={dd.icon} />
                )}
                <View style={dd.textWrap}>
                    <Text style={dd.floatLabel}>{label}</Text>
                    <Text style={[dd.selected, !value && { color: '#94a3b8' }]}>
                        {value || 'Select...'}
                    </Text>
                </View>
                <Icon
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={moderateScale(16)}
                    color="#94a3b8"
                />
            </TouchableOpacity>

            {open && (
                <View style={dd.optionsBox}>
                    {options.map(opt => (
                        <TouchableOpacity
                            key={opt}
                            style={[dd.option, value === opt && dd.optionActive]}
                            onPress={() => { onSelect(opt); setOpen(false); }}
                        >
                            <Text style={[dd.optionText, value === opt && dd.optionTextActive]}>
                                {opt}
                            </Text>
                            {value === opt && <Icon name="check" size={moderateScale(13)} color={BRAND} />}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {!!error && (
                <View style={dd.errorRow}>
                    <Icon name="alert-circle" size={moderateScale(12)} color="#e05c5c" />
                    <Text style={dd.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

const dd = StyleSheet.create({
    wrapper: { marginBottom: verticalScale(18) },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.4,
        borderRadius: moderateScale(14),
        backgroundColor: '#fff',
        paddingRight: scale(12),
        minHeight: verticalScale(52),
    },
    icon: { marginLeft: scale(12) },
    textWrap: { flex: 1, paddingVertical: verticalScale(8), paddingLeft: scale(10) },
    floatLabel: { fontSize: moderateScale(10.5), color: BRAND, fontWeight: '600', marginBottom: 2 },
    selected: { fontSize: moderateScale(13.5), color: '#1e293b', fontWeight: '500' },
    optionsBox: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: verticalScale(4),
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 5,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(11),
        paddingHorizontal: scale(16),
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    optionActive: { backgroundColor: '#f0f6fa' },
    optionText: { fontSize: moderateScale(13.5), color: '#334155' },
    optionTextActive: { color: BRAND, fontWeight: '700' },
    errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 4, gap: 4 },
    errorText: { fontSize: moderateScale(11), color: '#e05c5c', fontWeight: '500' },
});

// ─── Step indicator ───────────────────────────────────────────────────────────
const StepDot = ({ active, done }) => (
    <View style={[sp.dot, active && sp.dotActive, done && sp.dotDone]}>
        {done && <Icon name="check" size={moderateScale(10)} color="#fff" />}
    </View>
);
const sp = StyleSheet.create({
    dot: {
        width: scale(22),
        height: scale(22),
        borderRadius: scale(11),
        backgroundColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotActive: { backgroundColor: BRAND },
    dotDone: { backgroundColor: '#10b981' },
});

// ─── Main Component ───────────────────────────────────────────────────────────
const CompleteProfile = ({ navigation }) => {
    // Form state
    const [fatherName, setFatherName] = useState('');
    const [phone, setPhone] = useState('');
    const [cnic, setCnic] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [education, setEducation] = useState('');
    const [islamicEducation, setIslamicEducation] = useState('');
    const [profilePic, setProfilePic] = useState(null); // { uri, name, type }
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Steps: 0 = Personal, 1 = Education, 2 = Photo
    const [step, setStep] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        animateIn();
    }, [step]);

    const animateIn = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 70 }),
        ]).start();
    };

    // ─── CNIC auto-format: 12345-1234567-1 ───────────────────────────────────
    const formatCnic = raw => {
        const digits = raw.replace(/\D/g, '').slice(0, 13);
        if (digits.length <= 5) return digits;
        if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
        return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    };

    // ─── Phone auto-format: 03001234567 ──────────────────────────────────────
    const formatPhone = raw => raw.replace(/\D/g, '').slice(0, 11);

    // ─── Image picker ─────────────────────────────────────────────────────────
    const pickImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 800,
                maxHeight: 800,
                selectionLimit: 1,
            },
            response => {
                if (response.didCancel || response.errorCode) return;
                const asset = response.assets?.[0];
                if (asset) {
                    setProfilePic({
                        uri: asset.uri,
                        name: asset.fileName || `profile_${Date.now()}.jpg`,
                        type: asset.type || 'image/jpeg',
                    });
                    setErrors(p => ({ ...p, profilePic: '' }));
                }
            }
        );
    };

    // ─── Validation per step ──────────────────────────────────────────────────
    const validateStep = () => {
        const e = {};
        if (step === 0) {
            if (!fatherName.trim()) e.fatherName = "Father's name required";
            if (!phone || phone.length < 11) e.phone = 'Enter valid 11-digit number';
            if (!cnic || cnic.replace(/\D/g, '').length < 13) e.cnic = 'Enter valid CNIC';
            if (!age || isNaN(age) || age < 5 || age > 99) e.age = 'Enter valid age';
            if (!gender) e.gender = 'Please select gender';
            if (!address.trim()) e.address = 'Address required';
        }
        if (step === 1) {
            if (!education) e.education = 'Please select education';
            if (!islamicEducation) e.islamicEducation = 'Please select Islamic education';
        }
        if (step === 2) {
            if (!profilePic) e.profilePic = 'Please select a profile photo';
        }
        setErrors(e);
        return !Object.keys(e).length;
    };

    const nextStep = () => {
        if (validateStep()) setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    // ─── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!validateStep()) return;
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            console.log(token)
            const formData = new FormData();
            formData.append('fatherName', fatherName.trim());
            formData.append('phone', phone);
            formData.append('cnic', cnic);
            formData.append('age', age.toString());
            formData.append('gender', gender);
            formData.append('address', address.trim());
            formData.append('education', education);
            formData.append('islamicEducation', islamicEducation);
            formData.append('profilePic', {
                uri: profilePic.uri,
                name: profilePic.name,
                type: profilePic.type,
            });
            const response = await api.postFormData('/students/complete-profile', formData);
            console.log(formData)
            console.log(response)
            if (response) {
                Alert.alert('✅ Profile Complete!', 'Your profile has been saved.', [
                    { text: 'Continue', onPress: () => navigation.replace('Home') },
                ]);
            } else {
                Alert.alert('Error', response.message || 'Something went wrong');
            }
        } catch (err) {
            console.log(err)

            Alert.alert('Error', err.response?.data?.message || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    const setErr = field => val => setErrors(p => ({ ...p, [field]: '' }));

    // ─── Render steps ─────────────────────────────────────────────────────────
    const renderStep0 = () => (
        <>
            <TextField
                label="Father's Name"
                value={fatherName}
                onChangeText={v => { setFatherName(v); setErr('fatherName')(); }}
                error={errors.fatherName}
            />
            <TextField
                label="Phone Number"
                value={phone}
                onChangeText={v => { setPhone(formatPhone(v)); setErr('phone')(); }}
                keyboardType="phone-pad"
                error={errors.phone}
            />
            <TextField
                label="CNIC (13 digits)"
                value={cnic}
                onChangeText={v => { setCnic(formatCnic(v)); setErr('cnic')(); }}
                keyboardType="numeric"
                error={errors.cnic}
            />
            <TextField
                label="Age"
                value={age}
                onChangeText={v => { setAge(v.replace(/\D/g, '')); setErr('age')(); }}
                keyboardType="numeric"
                error={errors.age}
            />
            <DropdownField
                label="Gender"
                value={gender}
                options={GENDER_OPTIONS}
                onSelect={v => { setGender(v); setErr('gender')(); }}
                error={errors.gender}
            />
            <TextField
                label="Address"
                value={address}
                onChangeText={v => { setAddress(v); setErr('address')(); }}
                error={errors.address}
            />
        </>
    );

    const renderStep1 = () => (
        <>
            <View style={styles.stepInfo}>
                <Icon name="book-open" size={moderateScale(32)} color={BRAND} />
                <Text style={styles.stepInfoTitle}>Education Details</Text>
            </View>
            <DropdownField
                label="Education Level"
                value={education}
                options={EDUCATION_OPTIONS}
                onSelect={v => { setEducation(v); setErr('education')(); }}
                error={errors.education}
            />
            <DropdownField
                label="Islamic Education"
                value={islamicEducation}
                options={ISLAMIC_OPTIONS}
                onSelect={v => { setIslamicEducation(v); setErr('islamicEducation')(); }}
                error={errors.islamicEducation}
            />
        </>
    );

    const renderStep2 = () => (
        <>
            <View style={styles.stepInfo}>
                <Icon name="camera" size={moderateScale(32)} color={BRAND} />
                <Text style={styles.stepInfoTitle}>Profile Photo</Text>
                <Text style={styles.stepInfoSub}>Add a clear photo of yourself</Text>
            </View>

            {/* Image picker area */}
            <TouchableOpacity
                style={[styles.pickerBox, errors.profilePic && { borderColor: '#e05c5c' }]}
                onPress={pickImage}
                activeOpacity={0.8}
            >
                {profilePic ? (
                    <>
                        <Image source={{ uri: profilePic.uri }} style={styles.previewImg} />
                        <View style={styles.changeOverlay}>
                            <Icon name="edit-2" size={moderateScale(18)} color="#fff" />
                            <Text style={styles.changeText}>Change Photo</Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.pickerPlaceholder}>
                        <View style={styles.pickerIconCircle}>
                            <Icon name="upload" size={moderateScale(28)} color={BRAND} />
                        </View>
                        <Text style={styles.pickerTitle}>Tap to select photo</Text>
                        <Text style={styles.pickerSub}>JPG, PNG • Max 5MB</Text>
                    </View>
                )}
            </TouchableOpacity>

            {!!errors.profilePic && (
                <View style={styles.imgError}>
                    <Icon name="alert-circle" size={moderateScale(12)} color="#e05c5c" />
                    <Text style={styles.imgErrorText}>{errors.profilePic}</Text>
                </View>
            )}

        </>
    );

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

            {/* ── Top bar ──────────────────────────────────────────────────── */}
            <View style={styles.topBar}>
                {step > 0 ? (
                    <TouchableOpacity onPress={prevStep} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Icon name="arrow-left" size={moderateScale(20)} color={BRAND} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: scale(20) }} />
                )}

                {/* Step indicators */}
                <View style={styles.stepsRow}>
                    {[0, 1, 2].map(i => (
                        <React.Fragment key={i}>
                            <StepDot active={step === i} done={step > i} />
                            {i < 2 && (
                                <View style={[styles.stepLine, step > i && styles.stepLineDone]} />
                            )}
                        </React.Fragment>
                    ))}
                </View>

                <Text style={styles.stepCount}>{step + 1}/3</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ───────────────────────────────────────────────── */}
                <View style={styles.header}>
                    {/* <Text style={styles.title}>
                        {step === 0 ? 'Personal Info' : step === 1 ? 'Education' : 'Profile Photo'}
                    </Text> */}
                    <Text style={styles.subtitle}>
                        {step === 0
                            ? 'Fill in your personal details'
                            : step === 1
                                ? 'Tell us about your education'
                                : 'Upload your profile photo'}
                    </Text>
                </View>

                {/* ── Card ─────────────────────────────────────────────────── */}
                <Animated.View
                    style={[
                        styles.card,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {step === 0 && renderStep0()}
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}

                    {/* ── Action button ──────────────────────────────────────── */}
                    {step < 2 ? (
                        <TouchableOpacity onPress={nextStep} style={styles.btn} activeOpacity={0.85}>
                            <View style={styles.btnInner}>
                                <Text style={styles.btnText}>Continue</Text>
                                <Icon name="arrow-right" size={moderateScale(16)} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            style={[styles.btn, loading && styles.btnDisabled]}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <View style={styles.btnInner}>
                                    <Text style={styles.btnText}>Complete Profile</Text>
                                    <Icon name="check" size={moderateScale(16)} color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#f8fafc' },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: scale(22),
        paddingBottom: verticalScale(36),
    },

    // Top bar
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(22),
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(12),
        backgroundColor: '#f8fafc',
    },
    stepsRow: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
    stepLine: {
        width: scale(28),
        height: 2,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
    },
    stepLineDone: { backgroundColor: '#10b981' },
    stepCount: { fontSize: moderateScale(12), color: '#94a3b8', fontWeight: '700' },

    // Header
    header: { paddingTop: verticalScale(8), marginBottom: verticalScale(18) },
    title: {
        fontSize: moderateScale(24),
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
        marginBottom: verticalScale(4),
    },
    subtitle: { fontSize: moderateScale(13.5), color: '#94a3b8', fontWeight: '500' },

    // Card
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

    // Step info banner
    stepInfo: {
        alignItems: 'center',
        marginBottom: verticalScale(24),
        paddingVertical: verticalScale(8),
    },
    stepInfoTitle: {
        fontSize: moderateScale(17),
        fontWeight: '800',
        color: '#0f172a',
        marginTop: verticalScale(8),
    },
    stepInfoSub: { fontSize: moderateScale(12.5), color: '#94a3b8', marginTop: verticalScale(3) },

    // Image picker
    pickerBox: {
        borderWidth: 2,
        borderColor: '#dde3ea',
        borderStyle: 'dashed',
        borderRadius: moderateScale(18),
        overflow: 'hidden',
        height: verticalScale(180),
        marginBottom: verticalScale(10),
        backgroundColor: '#fafbfc',
    },
    previewImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    changeOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(10),
        gap: scale(6),
    },
    changeText: { color: '#fff', fontSize: moderateScale(13), fontWeight: '600' },
    pickerPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: verticalScale(8) },
    pickerIconCircle: {
        width: scale(60),
        height: scale(60),
        borderRadius: scale(30),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerTitle: { fontSize: moderateScale(14), fontWeight: '700', color: '#334155' },
    pickerSub: { fontSize: moderateScale(12), color: '#94a3b8' },
    imgError: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        marginBottom: verticalScale(10),
        marginLeft: scale(4),
    },
    imgErrorText: { fontSize: moderateScale(11), color: '#e05c5c', fontWeight: '500' },

    // Tips card
    tipsCard: {
        backgroundColor: '#f0f9f4',
        borderRadius: moderateScale(12),
        padding: scale(14),
        marginBottom: verticalScale(20),
        gap: verticalScale(8),
    },
    tipRow: { flexDirection: 'row', alignItems: 'center', gap: scale(8) },
    tipText: { fontSize: moderateScale(12.5), color: '#334155', fontWeight: '500' },

    // Button
    btn: {
        backgroundColor: BRAND,
        borderRadius: moderateScale(14),
        paddingVertical: verticalScale(14),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: BRAND,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
        marginTop: verticalScale(4),
    },
    btnDisabled: { opacity: 0.7 },
    btnInner: { flexDirection: 'row', alignItems: 'center', gap: scale(8) },
    btnText: { color: '#fff', fontWeight: '700', fontSize: moderateScale(15), letterSpacing: 0.2 },
});

export default CompleteProfile;