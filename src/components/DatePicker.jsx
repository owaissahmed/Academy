import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import AppModal from './Appmodal';

const BRAND = '#2e4c60';
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const isSameDay = (a, b) =>
    a && b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

const formatDisplay = (date) => {
    if (!date) return null;
    return date.toLocaleDateString('en-PK', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
};

const DatePicker = ({
    visible = false,
    onClose,
    onSelect,
    value,
    dob = false,
    title = 'Select Date',
}) => {
    const today = useRef(new Date()).current;
    const [cursor, setCursor] = useState({ month: today.getMonth(), year: today.getFullYear() });
    const [selected, setSelected] = useState(null);
    const [mode, setMode] = useState('day');

    // Sync state only when the modal is explicitly opened
    useEffect(() => {
        if (visible) {
            if (value instanceof Date && !isNaN(value)) {
                setCursor({ month: value.getMonth(), year: value.getFullYear() });
                setSelected(value);
            } else {
                setCursor({ month: today.getMonth(), year: today.getFullYear() });
                setSelected(null);
            }
            setMode('day');
        }
    }, [visible, value]);

    const yearRange = useMemo(() => {
        const base = dob ? today.getFullYear() : today.getFullYear() + 10;
        const start = base - 60;
        const end = dob ? today.getFullYear() : today.getFullYear() + 10;
        const arr = [];
        for (let y = end; y >= start; y--) arr.push(y);
        return arr;
    }, [dob]);

    const calendarDays = useMemo(() => {
        const firstDay = new Date(cursor.year, cursor.month, 1).getDay();
        const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
        const cells = [];
        for (let i = 0; i < firstDay; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);
        return cells;
    }, [cursor]);

    const isFutureDisabled = (day) => {
        if (!dob || !day) return false;
        const d = new Date(cursor.year, cursor.month, day);
        return d > today;
    };

    const isToday = (day) => {
        if (!day) return false;
        return isSameDay(new Date(cursor.year, cursor.month, day), today);
    };

    const isSelected = (day) => {
        if (!day || !selected) return false;
        return isSameDay(new Date(cursor.year, cursor.month, day), selected);
    };

    const handleDayPress = (day) => {
        if (!day || isFutureDisabled(day)) return;
        setSelected(new Date(cursor.year, cursor.month, day));
    };

    const prevMonth = () => {
        setCursor(c => {
            if (c.month === 0) return { month: 11, year: c.year - 1 };
            return { month: c.month - 1, year: c.year };
        });
    };

    const nextMonth = () => {
        if (dob) {
            const next = cursor.month === 11
                ? { month: 0, year: cursor.year + 1 }
                : { month: cursor.month + 1, year: cursor.year };
            const firstOfNext = new Date(next.year, next.month, 1);
            if (firstOfNext > today) return;
        }
        setCursor(c => {
            if (c.month === 11) return { month: 0, year: c.year + 1 };
            return { month: c.month + 1, year: c.year };
        });
    };

    const prevYear = () => setCursor(c => ({ ...c, year: c.year - 1 }));
    const nextYear = () => {
        if (dob && cursor.year >= today.getFullYear()) return;
        setCursor(c => ({ ...c, year: c.year + 1 }));
    };

    const handleConfirm = () => {
        if (selected) {
            // First dismiss layout to let AppModal trigger exit transitions, then pass state to parent
            onClose?.();
            setTimeout(() => {
                onSelect?.(selected);
            }, 100);
        }
    };

    const renderMonthPicker = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pickerGrid}>
            {MONTHS.map((m, i) => {
                const isDisabled = dob && new Date(cursor.year, i + 1, 0) > today
                    && cursor.year >= today.getFullYear() && i > today.getMonth();
                const isCurrent = i === cursor.month;
                return (
                    <TouchableOpacity
                        key={m}
                        disabled={isDisabled}
                        onPress={() => { setCursor(c => ({ ...c, month: i })); setMode('day'); }}
                        style={[styles.pickerCell, isCurrent && styles.pickerCellActive, isDisabled && styles.pickerCellDisabled]}
                    >
                        <Text allowFontScaling={false} style={[styles.pickerCellText, isCurrent && styles.pickerCellTextActive, isDisabled && styles.pickerCellTextDisabled]}>
                            {m.slice(0, 3)}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    const renderYearPicker = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pickerGrid}>
            {yearRange.map(y => {
                const isCurrent = y === cursor.year;
                return (
                    <TouchableOpacity
                        key={y}
                        onPress={() => { setCursor(c => ({ ...c, year: y })); setMode('day'); }}
                        style={[styles.pickerCell, isCurrent && styles.pickerCellActive]}
                    >
                        <Text allowFontScaling={false} style={[styles.pickerCellText, isCurrent && styles.pickerCellTextActive]}>
                            {y}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    const renderDayGrid = () => (
        <View style={styles.dayGridContainer}>
            <View style={styles.dayLabelsRow}>
                {DAYS.map(d => (
                    <Text key={d} allowFontScaling={false} style={styles.dayLabel}>{d}</Text>
                ))}
            </View>

            <View style={styles.daysGrid}>
                {calendarDays.map((day, idx) => {
                    const disabled = isFutureDisabled(day);
                    const todayDay = isToday(day);
                    const selDay = isSelected(day);

                    return (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => handleDayPress(day)}
                            disabled={!day || disabled}
                            activeOpacity={0.7}
                            style={styles.dayCell}
                        >
                            {day ? (
                                <View style={[styles.dayInner, selDay && styles.daySelected, todayDay && !selDay && styles.dayToday]}>
                                    <Text allowFontScaling={false} style={[styles.dayText, selDay && styles.dayTextSelected, todayDay && !selDay && styles.dayTextToday, disabled && styles.dayTextDisabled]}>
                                        {day}
                                    </Text>
                                </View>
                            ) : null}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    return (
        <AppModal
            visible={visible}
            title={title}
            onClose={onClose}
            closeOnBackdrop={true}
            modalStyle={styles.customModalOverride}
            primaryBtn={{
                label: 'Confirm',
                onPress: handleConfirm,
                disabled: !selected,
                icon: 'check',
            }}
            secondaryBtn={{
                label: 'Cancel',
                onPress: onClose,
            }}
        >
            <View style={styles.calendarWrap}>
                <View style={styles.selectedBanner}>
                    <Icon name="calendar" size={moderateScale(13)} color={selected ? BRAND : '#94a3b8'} />
                    <Text allowFontScaling={false} style={[styles.selectedText, !selected && styles.selectedPlaceholder]}>
                        {selected ? formatDisplay(selected) : 'No date selected'}
                    </Text>
                </View>

                <View style={styles.navBar}>
                    <TouchableOpacity onPress={mode === 'year' ? prevYear : prevMonth} style={styles.navArrow} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Icon name="chevron-left" size={moderateScale(18)} color={BRAND} />
                    </TouchableOpacity>

                    <View style={styles.navCenter}>
                        {mode === 'year' ? (
                            <Text allowFontScaling={false} style={styles.navLabel}>Select Year</Text>
                        ) : (
                            <>
                                <TouchableOpacity onPress={() => setMode(mode === 'month' ? 'day' : 'month')} style={styles.navChip}>
                                    <Text allowFontScaling={false} style={styles.navChipText}>{MONTHS[cursor.month]}</Text>
                                    <Icon name={mode === 'month' ? 'chevron-up' : 'chevron-down'} size={moderateScale(12)} color={BRAND} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setMode(mode === 'year' ? 'day' : 'year')} style={styles.navChip}>
                                    <Text allowFontScaling={false} style={styles.navChipText}>{cursor.year}</Text>
                                    <Icon name={mode === 'year' ? 'chevron-up' : 'chevron-down'} size={moderateScale(12)} color={BRAND} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={mode === 'year' ? nextYear : nextMonth}
                        style={styles.navArrow}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        disabled={dob && mode !== 'year' && cursor.month === today.getMonth() && cursor.year === today.getFullYear()}
                    >
                        <Icon
                            name="chevron-right"
                            size={moderateScale(18)}
                            color={dob && mode !== 'year' && cursor.month === today.getMonth() && cursor.year === today.getFullYear() ? '#cbd5e1' : BRAND}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.contentBodyContainer}>
                    {mode === 'day' && renderDayGrid()}
                    {mode === 'month' && renderMonthPicker()}
                    {mode === 'year' && renderYearPicker()}
                </View>
            </View>
        </AppModal>
    );
};

const styles = StyleSheet.create({
    customModalOverride: {
        width: '92%',
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(16),
        alignItems: 'stretch',
    },
    calendarWrap: {
        width: '100%',
        paddingBottom: verticalScale(2),
    },
    selectedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(7),
        backgroundColor: '#f0f4f8',
        borderRadius: moderateScale(10),
        paddingVertical: verticalScale(9),
        paddingHorizontal: scale(12),
        marginBottom: verticalScale(14),
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    selectedText: {
        fontSize: moderateScale(12.5),
        fontWeight: '600',
        color: BRAND,
        flex: 1,
    },
    selectedPlaceholder: {
        color: '#94a3b8',
        fontWeight: '500',
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: verticalScale(12),
    },
    navArrow: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: '#f0f4f8',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
    },
    navLabel: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: '#0f172a',
    },
    navChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        backgroundColor: '#f0f4f8',
        borderRadius: moderateScale(8),
        paddingVertical: verticalScale(5),
        paddingHorizontal: scale(10),
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    navChipText: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: BRAND,
    },
    contentBodyContainer: {
        height: verticalScale(230),
        justifyContent: 'center',
    },
    dayGridContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    dayLabelsRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: verticalScale(8),
    },
    dayLabel: {
        width: '14.28%',
        textAlign: 'center',
        fontSize: moderateScale(11.5),
        fontWeight: '700',
        color: '#94a3b8',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
    dayCell: {
        width: '14.28%',
        height: verticalScale(34),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(2),
    },
    dayInner: {
        width: scale(30),
        height: scale(30),
        borderRadius: scale(15),
        alignItems: 'center',
        justifyContent: 'center',
    },
    daySelected: {
        backgroundColor: BRAND,
    },
    dayToday: {
        backgroundColor: '#e8f0f5',
        borderWidth: 1.5,
        borderColor: BRAND,
    },
    dayText: {
        fontSize: moderateScale(12.5),
        fontWeight: '600',
        color: '#0f172a',
    },
    dayTextSelected: {
        color: '#ffffff',
        fontWeight: '700',
    },
    dayTextToday: {
        color: BRAND,
        fontWeight: '700',
    },
    dayTextDisabled: {
        color: '#cbd5e1',
    },
    pickerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: scale(6),
        paddingVertical: verticalScale(4),
    },
    pickerCell: {
        width: '31.3%',
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: verticalScale(2),
    },
    pickerCellActive: {
        backgroundColor: BRAND,
        borderColor: BRAND,
    },
    pickerCellDisabled: {
        backgroundColor: '#f1f5f9',
        borderColor: '#f1f5f9',
    },
    pickerCellText: {
        fontSize: moderateScale(12.5),
        fontWeight: '600',
        color: '#334155',
    },
    pickerCellTextActive: {
        color: '#ffffff',
    },
    pickerCellTextDisabled: {
        color: '#cbd5e1',
    },
});

export default DatePicker;