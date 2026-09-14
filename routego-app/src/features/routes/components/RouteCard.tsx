import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShuttleRoute } from '../types';
import { Badge } from '@/components/ui/Badge';
import { AppColors, Radius, Shadows } from '@/constants/colors';

interface RouteCardProps {
  route: ShuttleRoute;
  isFavorite?: boolean;
  onToggleFavorite?: (routeId: string) => void;
  onSelectRoute?: (route: ShuttleRoute) => void;
}

export function RouteCard({
  route,
  isFavorite = false,
  onToggleFavorite,
  onSelectRoute,
}: RouteCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusBadgeVariant = (status: ShuttleRoute['status']) => {
    switch (status) {
      case 'Activo':
        return 'success' as const;
      case 'Demorado':
        return 'warning' as const;
      case 'Inactivo':
      default:
        return 'neutral' as const;
    }
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage > 80) return AppColors.danger;
    if (percentage > 55) return AppColors.warning;
    return AppColors.success;
  };

  return (
    <View style={styles.card}>
      {/* Top Bar with Route Code, Title, and Favorite */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.codeBadge, { backgroundColor: route.color }]}>
            <Text style={styles.codeText}>{route.code}</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.routeName}>{route.name}</Text>
            <View style={styles.destinationRow}>
              <Ionicons name="location-outline" size={13} color={AppColors.textMuted} />
              <Text style={styles.destinationText} numberOfLines={1}>
                {route.origin} → {route.destination}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          hitSlop={10}
          onPress={() => onToggleFavorite?.(route.id)}
          style={styles.favButton}
        >
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={22}
            color={isFavorite ? AppColors.warning : AppColors.textMuted}
          />
        </Pressable>
      </View>

      {/* Status & ETA Row */}
      <View style={styles.statusRow}>
        <Badge
          label={route.status}
          variant={getStatusBadgeVariant(route.status)}
          dot
          size="sm"
        />

        {route.status === 'Activo' && (
          <View style={styles.etaBadge}>
            <Ionicons name="time-outline" size={13} color={AppColors.accent} />
            <Text style={styles.etaText}>Llega en {route.etaMinutes} min</Text>
          </View>
        )}

        {route.status === 'Demorado' && (
          <View style={[styles.etaBadge, styles.etaDelayed]}>
            <Ionicons name="alert-circle-outline" size={13} color={AppColors.warningDark} />
            <Text style={styles.etaDelayedText}>Demorado ({route.etaMinutes} min)</Text>
          </View>
        )}

        {route.status === 'Inactivo' && (
          <View style={[styles.etaBadge, styles.etaInactive]}>
            <Ionicons name="moon-outline" size={13} color={AppColors.textMuted} />
            <Text style={styles.etaInactiveText}>Próximo turno 18:30</Text>
          </View>
        )}

        <View style={styles.spacer} />

        <View style={styles.frequencyTag}>
          <Ionicons name="repeat-outline" size={12} color={AppColors.textMuted} />
          <Text style={styles.frequencyText}>c/{route.frequencyMinutes}m</Text>
        </View>
      </View>

      {/* Delay note banner if present */}
      {route.statusNote && (
        <View style={styles.noteBanner}>
          <Ionicons name="information-circle" size={14} color={AppColors.warningDark} />
          <Text style={styles.noteText}>{route.statusNote}</Text>
        </View>
      )}

      {/* Capacity & Occupancy Bar */}
      {route.status !== 'Inactivo' && (
        <View style={styles.capacitySection}>
          <View style={styles.capacityHeader}>
            <View style={styles.capacityLabelRow}>
              <Ionicons name="people-outline" size={13} color={AppColors.textSecondary} />
              <Text style={styles.capacityLabel}>Ocupación estimada</Text>
            </View>
            <Text style={styles.seatsText}>
              <Text style={{ fontWeight: '700', color: getCapacityColor(route.capacityPercentage) }}>
                {route.availableSeats}
              </Text>{' '}
              asientos libres de {route.totalSeats}
            </Text>
          </View>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${route.capacityPercentage}%`,
                  backgroundColor: getCapacityColor(route.capacityPercentage),
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Amenities & Active buses */}
      <View style={styles.amenitiesRow}>
        <View style={styles.amenityIcons}>
          {route.amenities.ac && (
            <View style={styles.amenityPill}>
              <Ionicons name="snow-outline" size={12} color={AppColors.textSecondary} />
              <Text style={styles.amenityText}>A/C</Text>
            </View>
          )}
          {route.amenities.wifi && (
            <View style={styles.amenityPill}>
              <Ionicons name="wifi-outline" size={12} color={AppColors.textSecondary} />
              <Text style={styles.amenityText}>Wi-Fi</Text>
            </View>
          )}
          {route.amenities.accessible && (
            <View style={styles.amenityPill}>
              <Ionicons name="body-outline" size={12} color={AppColors.textSecondary} />
              <Text style={styles.amenityText}>Accesible</Text>
            </View>
          )}
        </View>

        <View style={styles.activeBusesTag}>
          <Ionicons name="bus-outline" size={13} color={AppColors.primary} />
          <Text style={styles.activeBusesText}>
            {route.activeBuses} {route.activeBuses === 1 ? 'bus activo' : 'buses activos'}
          </Text>
        </View>
      </View>

      {/* Expandable Stops Timeline */}
      {expanded && (
        <View style={styles.stopsTimeline}>
          <Text style={styles.stopsTitle}>Paradas y Recorrido:</Text>
          {route.stops.map((stop, index) => {
            const isLast = index === route.stops.length - 1;
            return (
              <View key={stop.id} style={styles.timelineItem}>
                <View style={styles.timelineNodeCol}>
                  <View
                    style={[
                      styles.timelineNode,
                      stop.isCurrent && styles.timelineNodeCurrent,
                      stop.isPassed && styles.timelineNodePassed,
                    ]}
                  />
                  {!isLast && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.stopNameRow}>
                    <Text
                      style={[
                        styles.stopName,
                        stop.isCurrent && styles.stopNameCurrent,
                      ]}
                    >
                      {stop.name}
                    </Text>
                    {stop.isCurrent && (
                      <Badge label="Próxima" variant="info" size="sm" />
                    )}
                  </View>
                  <Text style={styles.stopTime}>Estimado: {stop.estimatedTime}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Card Actions Footer */}
      <View style={styles.footer}>
        <Pressable
          style={styles.expandButton}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.expandButtonText}>
            {expanded ? 'Ocultar paradas' : `Ver paradas (${route.stops.length})`}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={AppColors.accent}
          />
        </Pressable>

        <Pressable
          style={styles.detailButton}
          onPress={() => onSelectRoute?.(route)}
        >
          <Text style={styles.detailButtonText}>Detalle</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  codeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  headerTextContainer: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 2,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  destinationText: {
    fontSize: 12,
    color: AppColors.textSecondary,
    flex: 1,
  },
  favButton: {
    padding: 4,
    marginLeft: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.accent,
  },
  etaDelayed: {
    backgroundColor: AppColors.warningLight,
  },
  etaDelayedText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.warningDark,
  },
  etaInactive: {
    backgroundColor: AppColors.surfaceSubtle,
  },
  etaInactiveText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textMuted,
  },
  spacer: {
    flex: 1,
  },
  frequencyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  frequencyText: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  noteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.warningLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    marginBottom: 12,
    gap: 6,
  },
  noteText: {
    fontSize: 12,
    color: AppColors.warningDark,
    flex: 1,
    fontWeight: '500',
  },
  capacitySection: {
    marginBottom: 12,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  capacityLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capacityLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  seatsText: {
    fontSize: 11,
    color: AppColors.textSecondary,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: AppColors.surfaceSubtle,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  amenitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
    marginBottom: 10,
  },
  amenityIcons: {
    flexDirection: 'row',
    gap: 6,
  },
  amenityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surfaceSubtle,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    gap: 4,
  },
  amenityText: {
    fontSize: 10,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  activeBusesTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeBusesText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.primary,
  },
  stopsTimeline: {
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
    paddingLeft: 4,
  },
  stopsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 38,
  },
  timelineNodeCol: {
    alignItems: 'center',
    width: 20,
    marginRight: 10,
  },
  timelineNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.borderDark,
    marginTop: 3,
  },
  timelineNodeCurrent: {
    backgroundColor: AppColors.accent,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: AppColors.accentLight,
  },
  timelineNodePassed: {
    backgroundColor: AppColors.success,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: AppColors.border,
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  stopNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stopName: {
    fontSize: 13,
    fontWeight: '500',
    color: AppColors.text,
  },
  stopNameCurrent: {
    fontWeight: '700',
    color: AppColors.accent,
  },
  stopTime: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  expandButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.accent,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
    gap: 5,
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
