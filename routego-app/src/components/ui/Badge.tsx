import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { AppColors, Radius } from '@/constants/colors';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral' | 'purple';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  dot?: boolean;
}

export function Badge({
  label,
  variant = 'neutral',
  size = 'md',
  icon,
  style,
  textStyle,
  dot = false,
}: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: AppColors.successLight, text: AppColors.successDark, dot: AppColors.success };
      case 'warning':
        return { bg: AppColors.warningLight, text: AppColors.warningDark, dot: AppColors.warning };
      case 'danger':
        return { bg: AppColors.dangerLight, text: AppColors.dangerDark, dot: AppColors.danger };
      case 'info':
        return { bg: AppColors.infoLight, text: AppColors.infoDark, dot: AppColors.info };
      case 'primary':
        return { bg: '#E0E7FF', text: AppColors.primary, dot: AppColors.primary };
      case 'purple':
        return { bg: AppColors.purpleLight, text: '#6D28D9', dot: AppColors.purple };
      case 'neutral':
      default:
        return { bg: AppColors.surfaceSubtle, text: AppColors.textSecondary, dot: AppColors.textMuted };
    }
  };

  const { bg, text, dot: dotColor } = getColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg },
        isSm ? styles.badgeSm : styles.badgeMd,
        style,
      ]}
    >
      {dot && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          { color: text },
          isSm ? styles.textSm : styles.textMd,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  iconContainer: {
    marginRight: 2,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 12,
  },
});
