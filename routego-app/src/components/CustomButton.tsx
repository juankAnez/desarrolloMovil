import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { AppColors, Radius, Shadows } from '@/constants/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'warning' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function CustomButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: CustomButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: styles.btnSecondary,
          text: styles.textSecondary,
          spinner: AppColors.primary,
        };
      case 'warning':
        return {
          container: styles.btnWarning,
          text: styles.textWarning,
          spinner: '#FFFFFF',
        };
      case 'outline':
        return {
          container: styles.btnOutline,
          text: styles.textOutline,
          spinner: AppColors.primary,
        };
      case 'danger':
        return {
          container: styles.btnDanger,
          text: styles.textDanger,
          spinner: '#FFFFFF',
        };
      case 'ghost':
        return {
          container: styles.btnGhost,
          text: styles.textGhost,
          spinner: AppColors.primary,
        };
      case 'primary':
      default:
        return {
          container: styles.btnPrimary,
          text: styles.textPrimary,
          spinner: '#FFFFFF',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.sizeSm,
          text: styles.textSizeSm,
        };
      case 'lg':
        return {
          container: styles.sizeLg,
          text: styles.textSizeLg,
        };
      case 'md':
      default:
        return {
          container: styles.sizeMd,
          text: styles.textSizeMd,
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        vStyles.container,
        sStyles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vStyles.spinner} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[styles.baseText, vStyles.text, sStyles.text, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.5,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },

  // Sizes
  sizeSm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  textSizeSm: {
    fontSize: 13,
  },
  sizeMd: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    minHeight: 46,
  },
  textSizeMd: {
    fontSize: 14,
  },
  sizeLg: {
    paddingHorizontal: 24,
    paddingVertical: 15,
    minHeight: 54,
  },
  textSizeLg: {
    fontSize: 16,
  },

  // Variants
  btnPrimary: {
    backgroundColor: AppColors.primary,
    ...Shadows.sm,
  },
  textPrimary: {
    color: '#FFFFFF',
  },

  btnSecondary: {
    backgroundColor: AppColors.surfaceSubtle,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  textSecondary: {
    color: AppColors.primary,
  },

  btnWarning: {
    backgroundColor: AppColors.warning,
    ...Shadows.sm,
  },
  textWarning: {
    color: '#FFFFFF',
  },

  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  textOutline: {
    color: AppColors.primary,
  },

  btnDanger: {
    backgroundColor: AppColors.danger,
    ...Shadows.sm,
  },
  textDanger: {
    color: '#FFFFFF',
  },

  btnGhost: {
    backgroundColor: 'transparent',
  },
  textGhost: {
    color: AppColors.accent,
  },
});
