import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  colorType?: 'primary' | 'success' | 'warning' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colorType = 'primary',
}) => {
  const { colors, theme } = useApp();

  let accentColor = colors.primary;
  let bgTint = colors.primaryLight;

  if (colorType === 'success') {
    accentColor = colors.success;
    bgTint = colors.successLight;
  } else if (colorType === 'warning') {
    accentColor = colors.warning;
    bgTint = colors.warningLight;
  } else if (colorType === 'info') {
    accentColor = '#3B82F6';
    bgTint = theme === 'dark' ? '#1E3A8A' : '#EFF6FF';
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
        <View style={[styles.iconBox, { backgroundColor: bgTint }]}>
          <Ionicons name={icon} size={18} color={accentColor} />
        </View>
      </View>

      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
});
