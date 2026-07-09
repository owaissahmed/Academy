import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';

const BRAND = '#2e4c60';
const BORDER_DEFAULT = '#dde3ea';
const BORDER_FOCUS = BRAND;

/**
 * SearchBar
 *
 * Props:
 * - value            : string (controlled value, required)
 * - onChangeText      : (text: string) => void  → fires on every keystroke
 * - onSearch          : (text: string) => void  → fires after `debounceMs` of no typing
 *                        (skip this prop if you just want instant filtering)
 * - debounceMs        : number, default 400  → only matters if onSearch is passed
 * - placeholder       : string, default "Search"
 * - autoFocus         : bool, default false
 * - onClear           : () => void  → called when the X button is pressed (optional,
 *                        in addition to clearing the text internally)
 * - containerStyle    : extra style for outer wrapper (optional)
 */
const SearchBar = ({
    value,
    onChangeText,
    onSearch,
    debounceMs = 400,
    placeholder = 'Search',
    autoFocus = false,
    onClear,
    containerStyle,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const debounceRef = useRef(null);

    const hasValue = Boolean(value);

    // debounce -> onSearch
    useEffect(() => {
        if (!onSearch) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearch(value);
        }, debounceMs);

        return () => clearTimeout(debounceRef.current);
    }, [value]);

    const handleClear = () => {
        onChangeText('');
        if (onClear) onClear();
    };

    const borderColor = isFocused ? BORDER_FOCUS : BORDER_DEFAULT;

    return (
        <View style={[styles.wrapper, containerStyle]}>
            <View style={[styles.inputContainer, { borderColor }]}>
                <Icon
                    name="search"
                    size={moderateScale(16)}
                    color={isFocused ? BRAND : '#94a3b8'}
                    style={styles.leftIcon}
                />

                <TextInput
                    allowFontScaling={false}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    placeholderTextColor="#94a3b8"
                    autoFocus={autoFocus}
                    autoCapitalize="none"
                    returnKeyType="search"
                    style={styles.input}
                />

                {hasValue && (
                    <TouchableOpacity
                        onPress={handleClear}
                        style={styles.clearBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Icon name="x-circle" size={moderateScale(16)} color="#94a3b8" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: verticalScale(14),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.4,
        borderRadius: moderateScale(14),
        backgroundColor: '#ffffff',
        paddingHorizontal: scale(12),
        minHeight: verticalScale(46),
    },
    leftIcon: {
        marginRight: scale(8),
    },
    input: {
        flex: 1,
        paddingVertical: verticalScale(10),
        fontSize: moderateScale(14),
        color: '#1e293b',
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
    clearBtn: {
        padding: scale(4),
        marginLeft: scale(6),
    },
});

export default SearchBar;