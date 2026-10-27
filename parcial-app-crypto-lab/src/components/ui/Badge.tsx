import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { RequestStatus } from '../../types/request';
import { Colors, Radius } from '../../constants/colors';

interface BadgeProps {
  status: RequestStatus | string;
  label?: string;
  style?: ViewStyle;
  size?: 'sm' | 'md';
}

export function Badge({ status, label, style, size = 'md' }: BadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'PENDING':
        return {
          bg: Colors.warningLight,
          text: '#B45309',
          dot: Colors.warning,
          defaultLabel: 'Pendiente',
        };
      case 'ACCEPTED':
        return {
          bg: '#E0E7FF',
          text: '#3730A3',
          dot: Colors.primary,
          defaultLabel: 'Aceptado',
        };
      case 'ON_THE_WAY':
        return {
          bg: '#EDE9FE',
          text: '#5B21B6',
          dot: '#7C3AED',
          defaultLabel: 'En Camino',
        };
      case 'IN_PROGRESS':
        return {
          bg: Colors.primaryLight,
          text: Colors.primaryDark,
          dot: Colors.primary,
          defaultLabel: 'En Progreso',
        };
      case 'COMPLETED':
        return {
          bg: Colors.accentLight,
          text: '#065F46',
          dot: Colors.accent,
          defaultLabel: 'Completado',
        };
      case 'CANCELLED':
        return {
          bg: Colors.dangerLight,
          text: '#991B1B',
          dot: Colors.danger,
          defaultLabel: 'Cancelado',
        };
      default:
        return {
          bg: Colors.surfaceSubtle,
          text: Colors.textSecondary,
          dot: Colors.textMuted,
          defaultLabel: label || status,
        };
    }
  };

  const config = getBadgeConfig();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        isSm ? styles.badgeSm : styles.badgeMd,
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text
        style={[
          styles.text,
          { color: config.text },
          isSm ? styles.textSm : styles.textMd,
        ]}
      >
        {label || config.defaultLabel}
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
    gap: 6,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textSm: {
    fontSize: 10,
  },
  textMd: {
    fontSize: 12,
  },
});
