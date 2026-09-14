import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TripRecord } from '../types';
import { AppColors, Radius } from '@/constants/colors';
import { Badge } from '@/components/ui/Badge';

interface TripHistoryListProps {
  trips: TripRecord[];
}

export function TripHistoryList({ trips }: TripHistoryListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="time-outline" size={16} color={AppColors.primary} />
          <Text style={styles.title}>Historial de Viajes Recientes</Text>
        </View>
        <Text style={styles.tripsCount}>{trips.length} registros</Text>
      </View>

      <View style={styles.listContainer}>
        {trips.map((trip, index) => {
          const isLast = index === trips.length - 1;
          return (
            <View
              key={trip.id}
              style={[styles.tripItem, !isLast && styles.tripItemBorder]}
            >
              <View style={styles.busIconContainer}>
                <Ionicons name="bus" size={18} color={AppColors.accent} />
              </View>

              <View style={styles.tripContent}>
                <View style={styles.tripTopRow}>
                  <Text style={styles.routeName}>{trip.routeName}</Text>
                  <Badge label={trip.status} variant="success" size="sm" />
                </View>

                <View style={styles.tripMetaRow}>
                  <Ionicons name="pin-outline" size={12} color={AppColors.textMuted} />
                  <Text style={styles.stopText} numberOfLines={1}>
                    Subió en: {trip.stopBoarded}
                  </Text>
                </View>

                <View style={styles.tripBottomRow}>
                  <Text style={styles.timeText}>
                    {trip.date} • {trip.time}
                  </Text>
                  <Text style={styles.plateText}>Unidad {trip.busPlate}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tripsCount: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  listContainer: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: 14,
  },
  tripItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  tripItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  busIconContainer: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: AppColors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  tripContent: {
    flex: 1,
  },
  tripTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  routeName: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.text,
    flex: 1,
    marginRight: 6,
  },
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  stopText: {
    fontSize: 11,
    color: AppColors.textSecondary,
    flex: 1,
  },
  tripBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    color: AppColors.textMuted,
  },
  plateText: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
});
