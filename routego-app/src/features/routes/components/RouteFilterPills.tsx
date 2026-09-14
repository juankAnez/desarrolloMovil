import React from 'react';
import { ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { AppColors, Radius } from '@/constants/colors';

export type RouteFilterType = 'todas' | 'activas' | 'demoradas' | 'favoritas';

interface RouteFilterPillsProps {
  selectedFilter: RouteFilterType;
  onSelectFilter: (filter: RouteFilterType) => void;
  counts: {
    todas: number;
    activas: number;
    demoradas: number;
    favoritas: number;
  };
}

export function RouteFilterPills({
  selectedFilter,
  onSelectFilter,
  counts,
}: RouteFilterPillsProps) {
  const filters: { id: RouteFilterType; label: string; count: number }[] = [
    { id: 'todas', label: 'Todas', count: counts.todas },
    { id: 'activas', label: 'Activas', count: counts.activas },
    { id: 'demoradas', label: 'Demoradas', count: counts.demoradas },
    { id: 'favoritas', label: 'Favoritas', count: counts.favoritas },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {filters.map((f) => {
        const isSelected = selectedFilter === f.id;
        return (
          <Pressable
            key={f.id}
            style={[styles.pill, isSelected && styles.pillSelected]}
            onPress={() => onSelectFilter(f.id)}
          >
            <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
              {f.label}
            </Text>
            <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>
              {f.count}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    marginVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 6,
  },
  pillSelected: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textMuted,
    backgroundColor: AppColors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
  },
  badgeTextSelected: {
    color: AppColors.primary,
    backgroundColor: '#FFFFFF',
  },
});
