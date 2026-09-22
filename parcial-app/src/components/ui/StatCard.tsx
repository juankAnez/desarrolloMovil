import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows } from '../../constants/colors';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  style?: ViewStyle;
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  iconBgColor = Colors.primaryLight,
  style,
}: StatCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        {icon && <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>{icon}</View>}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
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
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  subtext: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 3,
  },
});
