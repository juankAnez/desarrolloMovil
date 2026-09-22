import React from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Colors, Radius, Shadows } from '../constants/colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'warning' | 'outline' | 'danger';
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function CustomButton({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  icon,
  disabled = false,
}: CustomButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { btn: styles.btnSecondary, text: styles.textSecondary };
      case 'warning':
        return { btn: styles.btnWarning, text: styles.textWarning };
      case 'danger':
        return { btn: styles.btnDanger, text: styles.textDanger };
      case 'outline':
        return { btn: styles.btnOutline, text: styles.textOutline };
      case 'primary':
      default:
        return { btn: styles.btnPrimary, text: styles.textPrimary };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.btnBase,
        vStyles.btn,
        disabled && styles.btnDisabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      <Text style={[styles.textBase, vStyles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btnBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: Radius.md,
    gap: 8,
    ...Shadows.sm,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  textBase: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
  },
  textPrimary: {
    color: Colors.textInverse,
  },
  btnSecondary: {
    backgroundColor: Colors.secondary,
  },
  textSecondary: {
    color: Colors.textInverse,
  },
  btnWarning: {
    backgroundColor: Colors.warning,
  },
  textWarning: {
    color: Colors.textInverse,
  },
  btnDanger: {
    backgroundColor: Colors.danger,
  },
  textDanger: {
    color: Colors.textInverse,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  textOutline: {
    color: Colors.primary,
  },
});
