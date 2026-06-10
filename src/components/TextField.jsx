import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';

const BRAND = '#2e4c60';
const BORDER_DEFAULT = '#dde3ea';
const BORDER_FOCUS = BRAND;
const LABEL_BLUR = '#94a3b8';
const LABEL_FOCUS = BRAND;
const ERROR_COLOR = '#e05c5c';

const TextField = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error = '',
  maxLength,
  icon = null,          // Feather icon name (optional left icon)
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animVal = useRef(new Animated.Value(value ? 1 : 0)).current;

  const hasValue = Boolean(value);
  const isLifted = isFocused || hasValue;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: isLifted ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue]);

  const labelTop = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [verticalScale(14), -verticalScale(9)],
  });
  const labelFontSize = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [moderateScale(13), moderateScale(11)],
  });
  const labelColor = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [LABEL_BLUR, error ? ERROR_COLOR : LABEL_FOCUS],
  });

  const borderColor = error ? ERROR_COLOR : isFocused ? BORDER_FOCUS : BORDER_DEFAULT;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputContainer, { borderColor }]}>
        {/* Optional left icon */}
        {icon && (
          <Icon
            name={icon}
            size={moderateScale(16)}
            color={isFocused ? BRAND : '#94a3b8'}
            style={styles.leftIcon}
          />
        )}

        {/* Floating label */}
        <Animated.Text
          allowFontScaling={false}
          style={[
            styles.label,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: labelColor,
              left: icon ? scale(38) : scale(12),
              backgroundColor: isLifted ? '#ffffff' : 'transparent',
            },
          ]}
        >
          {label}
        </Animated.Text>

        {/* Text Input */}
        <TextInput
          allowFontScaling={false}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          maxLength={maxLength}
          style={[
            styles.input,
            { paddingLeft: icon ? scale(15) : scale(10) },
          ]}
          placeholderTextColor="transparent"
        />

        {/* Password eye toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(p => !p)}
            style={styles.eyeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon
              name={showPassword ? 'eye' : 'eye-off'}
              size={moderateScale(17)}
              color="#94a3b8"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {!!error && (
        <View style={styles.errorRow}>
          <Icon name="alert-circle" size={moderateScale(12)} color={ERROR_COLOR} />
          <Animated.Text allowFontScaling={false} style={styles.errorText}>{error}</Animated.Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: verticalScale(18),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.4,
    borderRadius: moderateScale(14),
    backgroundColor: '#ffffff',
    paddingRight: scale(12),
    minHeight: verticalScale(50),
    position: 'relative',
  },
  label: {
    position: 'absolute',
    zIndex: 10,
    paddingHorizontal: scale(4),
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  input: {
    flex: 1,
    paddingVertical: verticalScale(13),
    paddingRight: scale(8),
    fontSize: moderateScale(14),
    color: '#1e293b',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  leftIcon: {
    marginLeft: scale(12),
  },
  eyeBtn: {
    padding: scale(4),
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(5),
    marginLeft: scale(4),
    gap: scale(4),
  },
  errorText: {
    fontSize: moderateScale(11),
    color: '#e05c5c',
    fontWeight: '500',
  },
});

export default TextField;