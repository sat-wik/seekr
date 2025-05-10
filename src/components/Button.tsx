import React, { useRef } from 'react';
import {
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
  Pressable,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

type ButtonProps = {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const getButtonStyle = () => {
    const baseStyle = {
      ...styles.button,
      ...styles[`${variant}Button`],
      ...styles[`${size}Button`],
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...styles.disabledButton,
      };
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = {
      ...styles.text,
      ...styles[`${variant}Text`],
      ...styles[`${size}Text`],
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...styles.disabledText,
      };
    }

    return baseStyle;
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          getButtonStyle(),
          style,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? colors.text.inverse : colors.neutral[600]}
            size="small"
          />
        ) : (
          <>
            {leftIcon && <>{leftIcon}</>}
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            {rightIcon && <>{rightIcon}</>}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    padding: spacing[3],
    minWidth: 120,
    shadowColor: colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: colors.neutral[800],
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: colors.neutral[100],
    borderWidth: 0,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  smButton: {
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[3],
    minHeight: 28,
  },
  mdButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    minHeight: 36,
  },
  lgButton: {
    paddingVertical: spacing[2.5],
    paddingHorizontal: spacing[5],
    minHeight: 44,
  },
  disabledButton: {
    backgroundColor: colors.neutral[100],
    borderColor: colors.neutral[200],
    shadowColor: 'transparent',
  },
  text: {
    fontWeight: typography.fontWeight.medium as '500',
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.normal,
  },
  primaryText: {
    color: colors.text.inverse,
  },
  secondaryText: {
    color: colors.neutral[800],
  },
  outlineText: {
    color: colors.neutral[800],
  },
  ghostText: {
    color: colors.neutral[800],
  },
  smText: {
    fontSize: typography.fontSize.sm,
  },
  mdText: {
    fontSize: typography.fontSize.base,
  },
  lgText: {
    fontSize: typography.fontSize.lg,
  },
  disabledText: {
    color: colors.neutral[400],
  },
});

export default Button; 
