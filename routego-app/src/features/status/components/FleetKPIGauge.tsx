import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FleetKPI } from '../types';
import { AppColors, Radius, Shadows } from '@/constants/colors';
import { Badge } from '@/components/ui/Badge';

interface FleetKPIGaugeProps {
  kpi: FleetKPI;
}

export function FleetKPIGauge({ kpi }: FleetKPIGaugeProps) {
  const getConditionVariant = () => {
    switch (kpi.systemCondition) {
      case 'Normal':
        return 'success' as const;
      case 'Retrasos Menores':
        return 'warning' as const;
      default:
        return 'danger' as const;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top condition banner */}
      <View style={styles.statusHeader}>
        <View style={styles.statusTitleRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusTitle}>Estado de la Red de Transporte</Text>
        </View>
        <Badge
          label={kpi.systemCondition}
          variant={getConditionVariant()}
          size="sm"
          dot
        />
      </View>

      {/* Grid of metrics */}
      <View style={styles.grid}>
        <View style={styles.metricCard}>
          <View style={[styles.iconBox, { backgroundColor: AppColors.successLight }]}>
            <Ionicons name="speedometer-outline" size={18} color={AppColors.success} />
          </View>
          <Text style={styles.metricValue}>{kpi.onTimePercentage}%</Text>
          <Text style={styles.metricLabel}>Puntualidad</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.iconBox, { backgroundColor: AppColors.accentLight }]}>
            <Ionicons name="bus-outline" size={18} color={AppColors.accent} />
          </View>
          <Text style={styles.metricValue}>
            {kpi.activeBuses} / {kpi.totalBuses}
          </Text>
          <Text style={styles.metricLabel}>Buses en Línea</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.iconBox, { backgroundColor: AppColors.warningLight }]}>
            <Ionicons name="time-outline" size={18} color={AppColors.warningDark} />
          </View>
          <Text style={styles.metricValue}>{kpi.avgWaitMinutes} min</Text>
          <Text style={styles.metricLabel}>Espera Media</Text>
        </View>
      </View>

      <Text style={styles.updatedText}>Actualizado: {kpi.lastUpdated}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    ...Shadows.sm,
    marginBottom: 14,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.success,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.text,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: AppColors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.text,
    letterSpacing: -0.3,
  },
  metricLabel: {
    fontSize: 10,
    color: AppColors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  updatedText: {
    fontSize: 11,
    color: AppColors.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
});
