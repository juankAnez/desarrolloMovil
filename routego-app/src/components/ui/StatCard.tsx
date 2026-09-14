import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { AppColors, Shadows, Radius } from '@/constants/colors';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  iconBgColor = AppColors.accentLight,
  onPress,
  style,
}: StatCardProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      style={({ pressed }: { pressed?: boolean }) => [
        styles.card,
        style,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        {icon && (
          <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
            {icon}
          </View>
        )}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtext && <Text style={styles.subtext} numberOfLines={1}>{subtext}</Text>}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    ...Shadows.sm,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '600',
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.text,
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
});
