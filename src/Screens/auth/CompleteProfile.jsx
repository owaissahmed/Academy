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
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextField from '../../components/TextField';
import AppModal from '../../components/Appmodal';
import Button from '../../components/Button';
import BottomSheet from '../../components/Bottomsheet';
import DatePicker from '../../components/DatePicker';
import { api } from '../../utlis/api';

const BRAND = '#2e4c60';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const EDUCATION_OPTIONS = ['Matric', 'Intermediate', 'BA', 'BSc', 'MA', 'MSc', 'Other'];
const ISLAMIC_OPTIONS = ['None', 'Nazra', 'Quran', 'Hifz', 'Alim'];

// ─── Dropdown via BottomSheet ─────────────────────────────────────────────────
const DropdownField = ({ label, value, options, onSelect, error, icon }) => {
    const [sheetVisible, setSheetVisible] = useState(false);
    const [temp, setTemp] = useState(value);

    return (
        <>
            <View style={dd.wrapper}>
                <TouchableOpacity
                    style={[dd.box, { borderColor: error ? '#e05c5c' : value ? BRAND : '#dde3ea' }]}
                    onPress={() => { setTemp(value); setSheetVisible(true); }}
                    activeOpacity={0.8}
                >
                    {icon && (
                        <Icon name={icon} size={moderateScale(16)} color={value ? BRAND : '#94a3b8'} style={dd.icon} />
                    )}
                    <View style={dd.textWrap}>
                        <Text allowFontScaling={false} style={dd.floatLabel}>{label}</Text>
                        <Text allowFontScaling={false} style={[dd.selected, !value && { color: '#94a3b8' }]}>
                            {value || 'Select...'}
                        </Text>
                    </View>
                    <Icon name="chevron-down" size={moderateScale(16)} color="#94a3b8" />
                </TouchableOpacity>

                {!!error && (
                    <View style={dd.errorRow}>
                        <Icon name="alert-circle" size={moderateScale(12)} color="#e05c5c" />
                        <Text allowFontScaling={false} style={dd.errorText}>{error}</Text>
                    </View>
                )}
            </View>

            <BottomSheet
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                title={`Select ${label}`}
                scrollable={true}
                heightPercent={0.45}
                primaryBtn={{
                    label: 'Confirm',
                    icon: 'check',
                    onPress: () => { onSelect(temp); setSheetVisible(false); },
                    disabled: !temp,
                }}
                secondaryBtn={{
                    label: 'Cancel',
                    onPress: () => setSheetVisible(false),
                }}
            >
                <View>
                    {options.map(opt => {
                        const isSel = temp === opt;
                        return (
                            <TouchableOpacity
                                key={opt}
                                style={dd.optionRow}
                                onPress={() => setTemp(opt)}
                                activeOpacity={0.7}
                            >
                                <Text allowFontScaling={false} style={[dd.optionText, isSel && dd.optionTextActive]}>
                                    {opt}
                                </Text>
                                <View style={[dd.radioCircle, isSel && dd.radioCircleSel]}>
                                    {isSel && <View style={dd.radioDot} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BottomSheet>
        </>
    );
};

const dd = StyleSheet.create({
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.4,
        borderRadius: moderateScale(14),
        backgroundColor: '#fff',
        paddingRight: scale(12),
        minHeight: verticalScale(50),
        marginBottom: verticalScale(16),
    },
    icon: { marginLeft: scale(12) },
    textWrap: { flex: 1, paddingVertical: verticalScale(8), paddingLeft: scale(10) },
    floatLabel: { fontSize: moderateScale(10.5), color: BRAND, fontWeight: '600', marginBottom: 2 },
    selected: { fontSize: moderateScale(13.5), color: '#1e293b', fontWeight: '500' },
    errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginLeft: 4, gap: 4, marginBottom: verticalScale(14) },
    errorText: { fontSize: moderateScale(11), color: '#e05c5c', fontWeight: '500' },
    optionRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: verticalScale(13),
        borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9',
    },
    optionText: { fontSize: moderateScale(14), color: '#0f172a', flex: 1 },
    optionTextActive: { color: BRAND, fontWeight: '700' },
    radioCircle: {
        width: scale(20), height: scale(20), borderRadius: scale(10),
        borderWidth: 1.5, borderColor: '#dde3ea',
        alignItems: 'center', justifyContent: 'center',
    },
    radioCircleSel: { borderColor: BRAND },
    radioDot: { width: scale(10), height: scale(10), borderRadius: scale(5), backgroundColor: BRAND },
});

// ─── Step Dot ─────────────────────────────────────────────────────────────────
const StepDot = ({ active, done }) => (
    <View style={[sp.dot, active && sp.dotActive, done && sp.dotDone]}>
        {done && <Icon name="check" size={moderateScale(10)} color="#fff" />}
    </View>
);
const sp = StyleSheet.create({
    dot: {
        width: scale(22), height: scale(22),
        borderRadius: scale(11),
        backgroundColor: '#e2e8f0',
        alignItems: 'center', justifyContent: 'center',
    },
    dotActive: { backgroundColor: BRAND },
    dotDone: { backgroundColor: '#10b981' },
});

// ─── Main Component ───────────────────────────────────────────────────────────
const CompleteProfile = ({ navigation }) => {
    const [fatherName, setFatherName] = useState('');
    const [dob, setDob] = useState(null);
    const [calVisible, setCalVisible] = useState(false);
    const [phone, setPhone] = useState('');
    const [cnic, setCnic] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [education, setEducation] = useState('');
    const [islamicEducation, setIslamicEducation] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [genderSheet, setGenderSheet] = useState(false);
    const [tempGender, setTempGender] = useState('');
    const [modal, setModal] = useState({
        visible: false, type: 'error', title: '', message: '', onPrimary: null,
    });

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 70 }),
        ]).start();
    }, [step]);

    const formatCnic = raw => {
        const digits = raw.replace(/\D/g, '').slice(0, 13);
        if (digits.length <= 5) return digits;
        if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
        return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    };

    const formatPhone = raw => raw.replace(/\D/g, '').slice(0, 11);

    const pickImage = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.8, maxWidth: 800, maxHeight: 800, selectionLimit: 1 },
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

    const setErr = field => () => setErrors(p => ({ ...p, [field]: '' }));

    const validateStep = () => {
        const e = {};
        if (step === 0) {
            if (!fatherName.trim()) e.fatherName = "Father's name is required.";
            if (!dob) e.dob = "Date of Birth is required.";
            if (!phone || phone.length < 11) e.phone = 'Enter a valid 11-digit phone number.';
            if (!cnic || cnic.replace(/\D/g, '').length < 13) e.cnic = 'Enter a valid CNIC.';
            if (!age || isNaN(age) || age < 5 || age > 99) e.age = 'Enter a valid age.';
            if (!gender) e.gender = 'Please select gender.';
            if (!address.trim()) e.address = 'Address is required.';
        }
        if (step === 1) {
            if (!education) e.education = 'Please select education.';
            if (!islamicEducation) e.islamicEducation = 'Please select Islamic education.';
        }
        if (step === 2) {
            if (!profilePic) e.profilePic = 'Please select a profile photo.';
        }
        setErrors(e);
        return !Object.keys(e).length;
    };

    const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('fatherName', fatherName.trim());
            formData.append('dob', dob instanceof Date ? dob.toISOString().split('T')[0] : dob);
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
            if (response?.isSuccess) {
                setModal({
                    visible: true, type: 'success',
                    title: 'Profile Complete!',
                    message: 'Your profile has been saved successfully.',
                    onPrimary: () => { closeModal(); navigation.replace('Home'); },
                });
            } else {
                setModal({
                    visible: true, type: 'error',
                    title: 'Failed',
                    message: response.message || 'Something went wrong. Please try again.',
                    onPrimary: closeModal,
                });
            }
        } catch (err) {
            setModal({
                visible: true, type: 'error',
                title: 'Error',
                message: err.response?.message || 'Failed to save profile. Please try again.',
                onPrimary: closeModal,
            });
        } finally {
            setLoading(false);
        }
    };

    const renderStep0 = () => (
        <>
            <TextField
                label="Father's Name"
                value={fatherName}
                onChangeText={v => { setFatherName(v); setErr('fatherName')(); }}
                icon="users"
                error={errors.fatherName}
            />
            <TextField
                label="Phone Number"
                value={phone}
                onChangeText={v => { setPhone(formatPhone(v)); setErr('phone')(); }}
                keyboardType="phone-pad"
                icon="phone"
                error={errors.phone}
            />
            <TextField
                label="CNIC (13 digits)"
                value={cnic}
                onChangeText={v => { setCnic(formatCnic(v)); setErr('cnic')(); }}
                keyboardType="numeric"
                icon="credit-card"
                error={errors.cnic}
            />
            <TouchableOpacity
                onPress={() => setCalVisible(true)}
                activeOpacity={0.8}
            >
                <View pointerEvents="none">
                    <TextField
                        label="Date of Birth"
                        value={dob
                            ? dob.toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })
                            : ''
                        }
                        icon="calendar"
                        editable={false}
                        error={errors.dob}
                        placeholder="Select date of birth"
                    />
                </View>
            </TouchableOpacity>

            <TextField
                label="Age"
                value={age}
                onChangeText={v => { setAge(v.replace(/\D/g, '')); setErr('age')(); }}
                keyboardType="numeric"
                icon="calendar"
                error={errors.age}
            />
            <DatePicker
                visible={calVisible}
                onClose={() => setCalVisible(false)}
                onSelect={(date) => {
                    setDob(date); // Date object store karo
                    setErr('dob')();
                }}
                value={dob instanceof Date ? dob : dob ? new Date(dob) : null} // ✅ string ko Date object mein convert
                dob={true}
                title="Date of Birth"
            />
            <TouchableOpacity
                style={[dd.box, { borderColor: errors.gender ? '#e05c5c' : gender ? BRAND : '#dde3ea' }]}
                onPress={() => { setTempGender(gender); setGenderSheet(true); }}
                activeOpacity={0.8}
            >
                <Icon name="user-check" size={moderateScale(16)} color={gender ? BRAND : '#94a3b8'} style={dd.icon} />
                <View style={dd.textWrap}>
                    <Text allowFontScaling={false} style={dd.floatLabel}>Gender</Text>
                    <Text allowFontScaling={false} style={[dd.selected, !gender && { color: '#94a3b8' }]}>
                        {gender || 'Select'}
                    </Text>
                </View>
                <Icon name="chevron-down" size={moderateScale(16)} color="#94a3b8" />
            </TouchableOpacity>
            {!!errors.gender && (
                <View style={dd.errorRow}>
                    <Icon name="alert-circle" size={moderateScale(12)} color="#e05c5c" />
                    <Text allowFontScaling={false} style={dd.errorText}>{errors.gender}</Text>
                </View>
            )}
            <TextField
                label="Address"
                value={address}
                onChangeText={v => { setAddress(v); setErr('address')(); }}
                icon="map-pin"
                error={errors.address}
            />
        </>
    );

    const renderStep1 = () => (
        <>
            <View style={styles.stepInfo}>
                <Icon name="book-open" size={moderateScale(32)} color={BRAND} />
                <Text allowFontScaling={false} style={styles.stepInfoTitle}>Education Details</Text>
            </View>
            <TextField
                label="Education Level"
                value={education}
                onChangeText={v => { setEducation(v); setErr('education')(); }}
                icon="award"
                error={errors.education}
            />
            <TextField
                label="Islamic Education"
                value={islamicEducation}
                onChangeText={v => { setIslamicEducation(v); setErr('islamicEducation')(); }}
                icon="book"
                error={errors.islamicEducation}
            />
        </>
    );

    const renderStep2 = () => (
        <>
            <View style={styles.stepInfo}>
                <Icon name="camera" size={moderateScale(32)} color={BRAND} />
                <Text allowFontScaling={false} style={styles.stepInfoTitle}>Profile Photo</Text>
                <Text allowFontScaling={false} style={styles.stepInfoSub}>Add a clear photo of yourself</Text>
            </View>

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
                            <Text allowFontScaling={false} style={styles.changeText}>Change Photo</Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.pickerPlaceholder}>
                        <View style={styles.pickerIconCircle}>
                            <Icon name="upload" size={moderateScale(28)} color={BRAND} />
                        </View>
                        <Text allowFontScaling={false} style={styles.pickerTitle}>Tap to select photo</Text>
                        <Text allowFontScaling={false} style={styles.pickerSub}>JPG, PNG • Max 5MB</Text>
                    </View>
                )}
            </TouchableOpacity>

            {!!errors.profilePic && (
                <View style={styles.imgError}>
                    <Icon name="alert-circle" size={moderateScale(12)} color="#e05c5c" />
                    <Text allowFontScaling={false} style={styles.imgErrorText}>{errors.profilePic}</Text>
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

            {/* ── Top bar ─────────────────────────────────────────── */}
            <View style={styles.topBar}>
                {step > 0 ? (
                    <TouchableOpacity onPress={prevStep} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Icon name="arrow-left" size={moderateScale(20)} color={BRAND} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: scale(20) }} />
                )}

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

                <Text allowFontScaling={false} style={styles.stepCount}>{step + 1}/3</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text allowFontScaling={false} style={styles.subtitle}>
                        {step === 0
                            ? 'Fill in your personal details'
                            : step === 1
                                ? 'Tell us about your education'
                                : 'Upload your profile photo'}
                    </Text>
                </View>

                <Animated.View
                    style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
                >
                    {step === 0 && renderStep0()}
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}

                    {step < 2 ? (
                        <Button
                            label="Continue"
                            icon="arrow-right"
                            iconPosition="right"
                            fullWidth
                            onPress={nextStep}
                        />
                    ) : (
                        <Button
                            label="Complete Profile"
                            icon="check"
                            iconPosition="right"
                            fullWidth
                            onPress={handleSubmit}
                            loading={loading}
                            disabled={loading}
                        />
                    )}
                </Animated.View>
            </ScrollView>
            <BottomSheet
                visible={genderSheet}
                onClose={() => setGenderSheet(false)}
                title="Select Gender"
                scrollable={true}
                heightPercent={0.4}
                primaryBtn={{
                    label: 'Confirm', icon: 'check',
                    onPress: () => { setGender(tempGender); setErr('gender')(); setGenderSheet(false); },
                    disabled: !tempGender,
                }}
                secondaryBtn={{ label: 'Cancel', onPress: () => setGenderSheet(false) }}
            >
                <View>
                    {GENDER_OPTIONS.map(opt => {
                        const isSel = tempGender === opt;
                        return (
                            <TouchableOpacity key={opt} style={dd.optionRow} onPress={() => setTempGender(opt)} activeOpacity={0.7}>
                                <Text allowFontScaling={false} style={[dd.optionText, isSel && dd.optionTextActive]}>{opt}</Text>
                                <View style={[dd.radioCircle, isSel && dd.radioCircleSel]}>
                                    {isSel && <View style={dd.radioDot} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BottomSheet>
            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryBtn={{
                    label: modal.type === 'success' ? 'Continue' : 'OK',
                    onPress: modal.onPrimary || closeModal,
                    color: modal.type === 'error' ? '#e05c5c'
                        : modal.type === 'warning' ? '#f59e0b'
                            : BRAND,
                }}
            />
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
    stepLine: { width: scale(28), height: 2, backgroundColor: '#e2e8f0', borderRadius: 2 },
    stepLineDone: { backgroundColor: '#10b981' },
    stepCount: { fontSize: moderateScale(12), color: '#94a3b8', fontWeight: '700' },
    header: { paddingTop: verticalScale(8), marginBottom: verticalScale(18) },
    subtitle: { fontSize: moderateScale(13.5), color: '#94a3b8', fontWeight: '500' },
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
        bottom: 0, left: 0, right: 0,
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
        width: scale(60), height: scale(60),
        borderRadius: scale(30),
        backgroundColor: '#e8f0f5',
        alignItems: 'center', justifyContent: 'center',
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
});

export default CompleteProfile;