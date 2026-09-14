import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceAlert } from '../types';
import { AppColors, Radius } from '@/constants/colors';
import { Badge } from '@/components/ui/Badge';

interface ServiceAlertCardProps {
  alert: ServiceAlert;
}

export function ServiceAlertCard({ alert }: ServiceAlertCardProps) {
  const getSeverityConfig = () => {
    switch (alert.severity) {
      case 'warning':
        return {
          icon: 'warning' as const,
          iconColor: AppColors.warningDark,
          bgColor: AppColors.warningLight,
          borderColor: '#FDE68A',
        };
      case 'critical':
        return {
          icon: 'alert-circle' as const,
          iconColor: AppColors.danger,
          bgColor: AppColors.dangerLight,
          borderColor: '#FECACA',
        };
      case 'info':
      default:
        return {
          icon: 'information-circle' as const,
          iconColor: AppColors.infoDark,
          bgColor: AppColors.infoLight,
          borderColor: '#BFDBFE',
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <View style={[styles.card, { borderColor: config.borderColor, backgroundColor: AppColors.surface }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name={config.icon} size={18} color={config.iconColor} />
          <Text style={styles.title}>{alert.title}</Text>
        </View>
        <Text style={styles.timeText}>{alert.timestamp}</Text>
      </View>

      <Text style={styles.description}>{alert.description}</Text>

      {alert.affectedRouteCode && (
        <View style={styles.footer}>
          <Text style={styles.affectedLabel}>Línea afectada:</Text>
          <Badge label={alert.affectedRouteCode} variant="warning" size="sm" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.text,
    flex: 1,
  },
  timeText: {
    fontSize: 11,
    color: AppColors.textMuted,
  },
  description: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
  },
  affectedLabel: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
});
