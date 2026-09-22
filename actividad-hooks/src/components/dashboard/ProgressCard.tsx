import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskStatistics } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProgressCardProps {
  statistics: TaskStatistics;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ statistics }) => {
  const { colors, theme } = useApp();

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
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textSecondary }]}>
            Progreso Global de Tareas
          </Text>
          <Text style={[styles.bigPercent, { color: colors.text }]}>
            {statistics.completionRate}%
          </Text>
        </View>

        <View
          style={[
            styles.hookPill,
            {
              backgroundColor: theme === 'dark' ? '#1E1B4B' : '#EEF2FF',
              borderColor: theme === 'dark' ? '#3730A3' : '#C7D2FE',
            },
          ]}
        >
          <Ionicons name="flash-outline" size={12} color="#6366F1" />
          <Text style={styles.hookText}>useMemo</Text>
        </View>
      </View>

      {/* Barra de progreso */}
      <View style={[styles.progressBarBg, { backgroundColor: colors.cardSubtle }]}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${Math.min(100, Math.max(0, statistics.completionRate))}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>

      <View style={styles.footerRow}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>
            Completadas
          </Text>
          <Text style={[styles.metricVal, { color: colors.success }]}>
            {statistics.completed} de {statistics.total}
          </Text>
        </View>

        {statistics.highPriorityPending > 0 && (
          <View style={styles.alertPill}>
            <Ionicons name="flame" size={13} color="#EF4444" />
            <Text style={styles.alertText}>
              {statistics.highPriorityPending} prioridad alta pendientes
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  bigPercent: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  hookPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  hookText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366F1',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricItem: {
    flexDirection: 'column',
  },
  metricLabel: {
    fontSize: 11,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  alertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  alertText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
});
