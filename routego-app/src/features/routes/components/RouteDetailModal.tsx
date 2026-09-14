import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShuttleRoute } from '../types';
import { Badge } from '@/components/ui/Badge';
import { CustomButton } from '@/components/CustomButton';
import { AppColors, Radius, Shadows } from '@/constants/colors';

interface RouteDetailModalProps {
  route: ShuttleRoute | null;
  visible: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (routeId: string) => void;
}

export function RouteDetailModal({
  route,
  visible,
  onClose,
  isFavorite = false,
  onToggleFavorite,
}: RouteDetailModalProps) {
  const [trackingActive, setTrackingActive] = useState(false);

  if (!route) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Header handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.routeBadgeGroup}>
              <View style={[styles.codeBadge, { backgroundColor: route.color }]}>
                <Text style={styles.codeText}>{route.code}</Text>
              </View>
              <View>
                <Text style={styles.routeName}>{route.name}</Text>
                <Text style={styles.routeDestination}>Hacia: {route.destination}</Text>
              </View>
            </View>

            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
              <Ionicons name="close" size={22} color={AppColors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Live Status Header */}
            <View style={styles.statusRow}>
              <Badge
                label={route.status}
                variant={route.status === 'Activo' ? 'success' : route.status === 'Demorado' ? 'warning' : 'neutral'}
                dot
              />
              <Text style={styles.statusDetailText}>
                {route.status === 'Activo'
                  ? `Próxima unidad en ${route.etaMinutes} min`
                  : route.statusNote || 'Servicio detenido temporalmente'}
              </Text>
            </View>

            {/* Quick Metrics 3-Col */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Ionicons name="time-outline" size={18} color={AppColors.accent} />
                <Text style={styles.metricVal}>{route.frequencyMinutes}m</Text>
                <Text style={styles.metricLbl}>Frecuencia</Text>
              </View>

              <View style={styles.metricBox}>
                <Ionicons name="people-outline" size={18} color={AppColors.success} />
                <Text style={styles.metricVal}>{route.availableSeats}</Text>
                <Text style={styles.metricLbl}>Libres ({route.capacityPercentage}%)</Text>
              </View>

              <View style={styles.metricBox}>
                <Ionicons name="bus-outline" size={18} color={AppColors.primary} />
                <Text style={styles.metricVal}>{route.activeBuses}</Text>
                <Text style={styles.metricLbl}>En Circulación</Text>
              </View>
            </View>

            {/* Driver & Vehicle Information */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>Unidad Asignada y Conductor</Text>
              <View style={styles.driverCard}>
                <View style={styles.driverAvatar}>
                  <Ionicons name="person" size={22} color={AppColors.primary} />
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{route.driverName}</Text>
                  <View style={styles.driverMeta}>
                    <Text style={styles.driverRating}>★ 4.9</Text>
                    <Text style={styles.driverDot}>•</Text>
                    <Text style={styles.busPlate}>Placa: {route.busPlate}</Text>
                  </View>
                </View>
                <View style={styles.busModelTag}>
                  <Text style={styles.busModelText}>Shuttle Eco</Text>
                </View>
              </View>
            </View>

            {/* Amenities */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>Servicios a Bordo</Text>
              <View style={styles.amenitiesGrid}>
                <View style={[styles.amenityItem, route.amenities.ac && styles.amenityActive]}>
                  <Ionicons
                    name="snow"
                    size={16}
                    color={route.amenities.ac ? AppColors.accent : AppColors.textMuted}
                  />
                  <Text style={[styles.amenityLabel, route.amenities.ac && styles.amenityLabelActive]}>
                    Aire Acondicionado
                  </Text>
                </View>

                <View style={[styles.amenityItem, route.amenities.wifi && styles.amenityActive]}>
                  <Ionicons
                    name="wifi"
                    size={16}
                    color={route.amenities.wifi ? AppColors.accent : AppColors.textMuted}
                  />
                  <Text style={[styles.amenityLabel, route.amenities.wifi && styles.amenityLabelActive]}>
                    Wi-Fi Gratuito
                  </Text>
                </View>

                <View style={[styles.amenityItem, route.amenities.accessible && styles.amenityActive]}>
                  <Ionicons
                    name="body"
                    size={16}
                    color={route.amenities.accessible ? AppColors.accent : AppColors.textMuted}
                  />
                  <Text style={[styles.amenityLabel, route.amenities.accessible && styles.amenityLabelActive]}>
                    Acceso Silla Ruedas
                  </Text>
                </View>
              </View>
            </View>

            {/* Full Stops Timeline */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>Secuencia de Paradas ({route.stops.length})</Text>
              <View style={styles.stopsList}>
                {route.stops.map((stop, i) => {
                  const isLast = i === route.stops.length - 1;
                  return (
                    <View key={stop.id} style={styles.timelineRow}>
                      <View style={styles.timelineIndicatorCol}>
                        <View
                          style={[
                            styles.nodeCircle,
                            stop.isCurrent && styles.nodeCircleCurrent,
                            stop.isPassed && styles.nodeCirclePassed,
                          ]}
                        >
                          {stop.isPassed && (
                            <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                          )}
                        </View>
                        {!isLast && <View style={styles.connectorLine} />}
                      </View>
                      <View style={styles.stopDetails}>
                        <View style={styles.stopNameRow}>
                          <Text
                            style={[
                              styles.stopTitle,
                              stop.isCurrent && styles.stopTitleCurrent,
                            ]}
                          >
                            {stop.name}
                          </Text>
                          {stop.isCurrent && (
                            <Badge label="En camino" variant="info" size="sm" />
                          )}
                        </View>
                        <Text style={styles.stopTimeText}>Horario: {stop.estimatedTime}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Schedule Note */}
            {route.scheduleNote && (
              <View style={styles.scheduleNoteBox}>
                <Ionicons name="calendar-outline" size={16} color={AppColors.textSecondary} />
                <Text style={styles.scheduleNoteText}>{route.scheduleNote}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <CustomButton
                title={trackingActive ? 'Siguiendo en Tiempo Real ✓' : 'Seguir Shuttle en Vivo'}
                variant={trackingActive ? 'secondary' : 'primary'}
                icon={
                  <Ionicons
                    name={trackingActive ? 'checkmark-circle' : 'navigate-circle'}
                    size={18}
                    color={trackingActive ? AppColors.primary : '#FFFFFF'}
                  />
                }
                onPress={() => setTrackingActive(!trackingActive)}
                style={styles.fullBtn}
              />

              <CustomButton
                title={isFavorite ? 'Quitar de Favoritas' : 'Fijar en Mis Rutas Habituales'}
                variant="outline"
                icon={
                  <Ionicons
                    name={isFavorite ? 'star' : 'star-outline'}
                    size={16}
                    color={AppColors.primary}
                  />
                }
                onPress={() => onToggleFavorite?.(route.id)}
                style={styles.fullBtn}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '90%',
    paddingBottom: 20,
    ...Shadows.lg,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: AppColors.borderDark,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  routeBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  codeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
  codeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.text,
  },
  routeDestination: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: AppColors.surfaceSubtle,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    gap: 18,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: AppColors.surfaceSubtle,
    padding: 12,
    borderRadius: Radius.md,
  },
  statusDetailText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: AppColors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.text,
    marginVertical: 4,
  },
  metricLbl: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  cardSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surfaceSubtle,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 12,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.text,
  },
  driverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  driverRating: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.warningDark,
  },
  driverDot: {
    color: AppColors.textMuted,
    fontSize: 10,
  },
  busPlate: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  busModelTag: {
    backgroundColor: AppColors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  busModelText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  amenityItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: AppColors.surfaceSubtle,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 6,
  },
  amenityActive: {
    borderColor: AppColors.accentBorder,
    backgroundColor: AppColors.accentLight,
  },
  amenityLabel: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  amenityLabelActive: {
    color: AppColors.accent,
  },
  stopsList: {
    backgroundColor: AppColors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 46,
  },
  timelineIndicatorCol: {
    alignItems: 'center',
    width: 22,
    marginRight: 12,
  },
  nodeCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: AppColors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
  nodeCircleCurrent: {
    backgroundColor: AppColors.accent,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: AppColors.accentLight,
  },
  nodeCirclePassed: {
    backgroundColor: AppColors.success,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: AppColors.border,
    marginVertical: 2,
  },
  stopDetails: {
    flex: 1,
    paddingBottom: 10,
  },
  stopNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stopTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text,
  },
  stopTitleCurrent: {
    color: AppColors.accent,
    fontWeight: '700',
  },
  stopTimeText: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginTop: 2,
  },
  scheduleNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: Radius.md,
    backgroundColor: AppColors.surfaceSubtle,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  scheduleNoteText: {
    fontSize: 12,
    color: AppColors.textSecondary,
    flex: 1,
  },
  actionButtons: {
    gap: 10,
    marginTop: 6,
  },
  fullBtn: {
    width: '100%',
  },
});
