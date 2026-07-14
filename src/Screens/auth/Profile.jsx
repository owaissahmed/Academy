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
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import AppModal from '../../components/Appmodal';
import Button from '../../components/Button';
import { api, formatToYYYYMMDD } from '../../utlis/api';
import TextField from '../../components/TextField';
import DatePicker from '../../components/DatePicker';
const BRAND = '#2e4c60';

const EditProfile = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [modal, setModal] = useState({ visible: false, type: 'error', title: '', message: '', onPrimary: null });

    const [fatherName, setFatherName] = useState('');
    const [phone, setPhone] = useState('');
    const [cnic, setCnic] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [education, setEducation] = useState('');
    const [islamicEducation, setIslamicEducation] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [existingPic, setExistingPic] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const [existingName, setExistingName] = useState('');
    const [existingEmail, setExistingEmail] = useState('');
    const [existingRole, setExistingRole] = useState('');
    const [dob, setDob] = useState(null);
    const [calVisible, setCalVisible] = useState(false);
    const closeModal = () => setModal(m => ({ ...m, visible: false }));

    useEffect(() => { loadProfile(); }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get('/students/profile');
            console.log(res)
            const user = res.data.userId;
            const p = res.data;
            setExistingName(user?.name || '');
            setExistingEmail(user?.email || '');
            setPhone(p.phone || '');
            setExistingRole(user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '');
            setFatherName(p.fatherName || '');
            setCnic(p.cnic || '');
            setAge(p.age?.toString() || '');
            setGender(p.gender || '');
            setAddress(p.address || '');
            setEducation(p.education || '');
            setIslamicEducation(p.islamicEducation || '');
            setExistingPic(p.profilePic || null);
            setDob(p.dob || null)
        } catch {
            setModal({
                visible: true, type: 'error',
                title: 'Error',
                message: 'Failed to load profile. Please try again.',
                onPrimary: closeModal,
            });
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setLogoutModalVisible(false);
        navigation.replace('Login');
    };
    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (res) => {
            if (!res.didCancel && res.assets?.[0]) {
                const asset = res.assets[0];
                setProfilePic({
                    uri: asset.uri,
                    name: asset.fileName || 'profile.jpg',
                    type: asset.type || 'image/jpeg',
                });
            }
        });
    };
    // const formatCnic = raw => {
    //     const digits = raw.replace(/\D/g, '').slice(0, 13);
    //     if (digits.length <= 5) return digits;
    //     if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    //     return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    // };

    // const formatPhone = raw => raw.replace(/\D/g, '').slice(0, 11);

    const formatAge = raw => raw.replace(/\D/g, '').slice(0, 2);
    const validate = () => {
        const e = {};
        if (!fatherName.trim()) e.fatherName = 'Father name is required.';
        if (!dob) e.dob = "Date of Birth is required.";
        if (!phone.trim()) e.phone = 'Phone number is required.';
        if (!cnic.trim()) e.cnic = 'CNIC is required.';
        if (!age.trim() || isNaN(age) || age < 5 || age > 99) e.age = 'Enter a valid age.';
        if (!address.trim()) e.address = 'Address is required.';
        if (!gender.trim()) e.gender = 'Gender is required.';
        if (!education.trim()) e.education = 'Education is required.';
        if (!islamicEducation.trim()) e.islamicEducation = 'Islamic education is required.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        console.log('DOB:', dob);
        console.log('Formatted DOB:', formatToYYYYMMDD(dob));
        setSubmitting(true);
        try {
            const formData = new FormData();

            formData.append('fatherName', fatherName.trim());
            formData.append('phone', phone.trim());
            formData.append('cnic', cnic.trim());
            formData.append('age', age.toString());
            formData.append('gender', gender.trim());
            formData.append('address', address.trim());
            formData.append('education', education.trim());
            formData.append('islamicEducation', islamicEducation.trim());
            formData.append('dob', formatToYYYYMMDD(dob));

            if (profilePic) {
                formData.append('profilePic', {
                    uri: profilePic.uri,
                    name: profilePic.name,
                    type: profilePic.type,
                });
            }

            const response = await api.postFormData('/students/edit-profile', formData);
            console.log(response)
            if (response.isSuccess || response.success) {
                setModal({
                    visible: true, type: 'success',
                    title: 'Profile Updated',
                    message: 'Your profile has been updated successfully.',
                    onPrimary: () => { closeModal(); },
                });
            } else {
                setModal({
                    visible: true, type: 'error',
                    title: 'Update Failed',
                    message: response.message || 'Failed to update profile. Please try again.',
                    onPrimary: closeModal,
                });
            }
        } catch (err) {
            setModal({
                visible: true, type: 'error',
                title: 'Error',
                message: err.message || 'Something went wrong. Please try again.',
                onPrimary: closeModal,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const picUri = profilePic?.uri || existingPic;

    return (
        <Container
            showHeader={true}
            headerTitle="Edit Profile"
            onBack={() => navigation.goBack()}
            rightIcons={[
                {
                    icon: "lock",
                    onPress: () => navigation.navigate('UpdatePassword'),
                },
                {
                    icon: "log-out",
                    onPress: () => setLogoutModalVisible(true),
                },
            ]}
            showFooter={false}
        >
            {loading && <Loader message="Loading..." />}

            {!loading && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Photo picker ─────────────────────────── */}
                    <View style={styles.picSection}>
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.picWrap}>
                            {picUri ? (
                                <Image source={{ uri: picUri }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarFallback}>
                                    <Icon name="user" size={moderateScale(32)} color={BRAND} />
                                </View>
                            )}
                            <View style={styles.cameraBtn}>
                                <Icon name="camera" size={moderateScale(13)} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        {/* <Text allowFontScaling={false} style={styles.picHint}>Tap to change photo</Text> */}
                    </View>
                    {/* ── Name / Email / Role ─────────────────── */}
                    <View style={styles.userInfoSection}>
                        <Text allowFontScaling={false} style={styles.userName}>
                            {existingName}
                        </Text>
                        <Text allowFontScaling={false} style={styles.userEmail}>
                            {existingEmail} | {phone}
                        </Text>
                        <View style={styles.roleBadge}>
                            <Icon name="shield" size={moderateScale(11)} color={BRAND} />
                            <Text allowFontScaling={false} style={styles.roleText}>
                                {existingRole}
                            </Text>
                        </View>
                    </View>
                    {/* ── Personal Info ────────────────────────── */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Icon name="user" size={moderateScale(14)} color={BRAND} />
                            <Text allowFontScaling={false} style={styles.cardTitle}>Personal Information</Text>
                        </View>

                        <TextField
                            label="Father's Name"
                            value={fatherName}
                            onChangeText={t => { setFatherName(t); setErrors(e => ({ ...e, fatherName: '' })); }}
                            icon="users"
                            error={errors.fatherName}
                        />
                        {/* <TextField
                            label="Phone Number"
                            value={phone}
                            onChangeText={t => { setPhone(t); setErrors(e => ({ ...e, phone: '' })); }}
                            icon="phone"
                            keyboardType="phone-pad"
                            error={errors.phone}
                        /> */}
                        <TextField
                            label="CNIC"
                            value={cnic}
                            onChangeText={t => {
                                setCnic(t);
                                setErrors(e => ({ ...e, cnic: '' }));
                            }}
                            icon="credit-card"
                            keyboardType="numeric"
                            error={errors.cnic}
                        />
                        <TouchableOpacity
                            onPress={() => setCalVisible(true)}
                            activeOpacity={0.8}
                        >
                            <View pointerEvents="none">
                                <TextField
                                    label="Date of Birth"
                                    value={dob}
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
                            onChangeText={v => { setAge(formatAge(v)); setErrors(e => ({ ...e, age: '' })); }}
                            keyboardType="numeric"
                            icon="calendar"
                            error={errors.age}
                        />
                        {/* <TextField
                            label="Gender"
                            value={gender}
                            onChangeText={t => { setGender(t); setErrors(e => ({ ...e, gender: '' })); }}
                            icon="user-check"
                            error={errors.gender}
                        /> */}
                        <TextField
                            label="Address"
                            value={address}
                            onChangeText={t => { setAddress(t); setErrors(e => ({ ...e, address: '' })); }}
                            icon="map-pin"
                            multiline
                            numberOfLines={3}
                            error={errors.address}
                        />
                    </View>

                    {/* ── Education ────────────────────────────── */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Icon name="book-open" size={moderateScale(14)} color={BRAND} />
                            <Text allowFontScaling={false} style={styles.cardTitle}>Education</Text>
                        </View>

                        <TextField
                            label="Education"
                            value={education}
                            onChangeText={t => { setEducation(t); setErrors(e => ({ ...e, education: '' })); }}
                            icon="award"
                            error={errors.education}
                        />
                        <TextField
                            label="Islamic Education"
                            value={islamicEducation}
                            onChangeText={t => { setIslamicEducation(t); setErrors(e => ({ ...e, islamicEducation: '' })); }}
                            icon="book"
                            error={errors.islamicEducation}
                        />
                    </View>

                    <Button
                        label="Save Changes"
                        icon="check"
                        iconPosition="left"
                        fullWidth
                        onPress={handleSubmit}
                        loading={submitting}
                        disabled={submitting}
                        style={{ marginBottom: verticalScale(16) }}
                    />
                </ScrollView>
            )}
            <DatePicker
                visible={calVisible}
                onClose={() => setCalVisible(false)}
                onSelect={(date) => {
                    // ✅ String store karo state mein
                    const formatted = date.toLocaleDateString('en-PK', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    });
                    setDob(formatted);
                }}
                value={dob ? new Date(dob) : null}
                dob={true}
                title="Date of Birth"
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

            <AppModal
                visible={modal.visible}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryBtn={{
                    label: modal.type === 'success' ? 'Done' : 'OK',
                    onPress: modal.onPrimary || closeModal,
                    color: modal.type === 'error' ? '#e05c5c'
                        : modal.type === 'warning' ? '#f59e0b'
                            : BRAND,
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
    picSection: {
        alignItems: 'center',
        marginBottom: verticalScale(20),
        paddingTop: verticalScale(8),
    },
    picWrap: {
        position: 'relative',
        // marginBottom: verticalScale(8),
    },
    avatar: {
        width: scale(90),
        height: scale(90),
        borderRadius: scale(45),
        borderWidth: 3,
        borderColor: '#e8f0f5',
    },
    avatarFallback: {
        width: scale(90),
        height: scale(90),
        borderRadius: scale(45),
        backgroundColor: '#e8f0f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userInfoSection: {
        alignItems: 'center',
        marginBottom: verticalScale(20),
        gap: verticalScale(4),
    },
    userName: {
        fontSize: moderateScale(18),
        fontWeight: '800',
        color: '#0f172a',
    },
    userEmail: {
        fontSize: moderateScale(13),
        color: '#94a3b8',
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
        backgroundColor: '#e8f0f5',
        borderRadius: moderateScale(20),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(5),
        marginTop: verticalScale(4),
    },
    roleText: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: BRAND,
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: scale(28),
        height: scale(28),
        borderRadius: scale(14),
        backgroundColor: BRAND,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    picHint: {
        fontSize: moderateScale(12),
        color: '#94a3b8',
    },
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
        gap: verticalScale(10),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        marginBottom: verticalScale(4),
    },
    cardTitle: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: BRAND,
    },
});

export default EditProfile;