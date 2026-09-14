import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, Radius, Shadows } from '@/constants/colors';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { MOCK_ROUTES } from '@/features/routes/routesData';
import { MOCK_FLEET_KPI, MOCK_ALERTS } from '@/features/status/statusData';
import { RouteDetailModal } from '@/features/routes/components/RouteDetailModal';
import { ShuttleRoute } from '@/features/routes/types';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<ShuttleRoute | null>(null);
  const [showQuickBoardingModal, setShowQuickBoardingModal] = useState(false);

  const activeRoutes = MOCK_ROUTES.filter((r) => r.status === 'Activo');
  const delayedRoutes = MOCK_ROUTES.filter((r) => r.status === 'Demorado');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.primary]}
          />
        }
      >
        {/* Top App Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greetingTitle}>¡Hola, Juan Carlos! 👋</Text>
            <Text style={styles.greetingSub}>Bienvenido a RouteGo Transporte</Text>
          </View>

          {/* Quick Profile Avatar Shortcut (Programmatic Navigation to ST-202688) */}
          <Pressable
            style={styles.avatarButton}
            onPress={() => router.push('/student/ST-202688')}
            hitSlop={8}
          >
            <Text style={styles.avatarText}>JP</Text>
            <View style={styles.onlineBadge} />
          </Pressable>
        </View>

        {/* Hero Card: Next Shuttle Arrival & Network Overview */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroLiveDot} />
              <Text style={styles.heroBadgeText}>SERVICIO EN TIEMPO REAL</Text>
            </View>
            <Link href="/modal" asChild>
              <Pressable style={styles.heroStatusBtn}>
                <Ionicons name="information-circle-outline" size={16} color="#93C5FD" />
                <Text style={styles.heroStatusBtnText}>Alertas</Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.heroMain}>
            <Text style={styles.heroNextLabel}>Próximo bus hacia tu destino:</Text>
            <Text style={styles.heroRouteName}>Ruta Norte (R-01)</Text>
            <Text style={styles.heroDestination}>Destino: Campus Principal • Puerta 3</Text>
          </View>

          <View style={styles.heroFooter}>
            <View style={styles.heroCountdownBox}>
              <Ionicons name="time" size={18} color="#FFFFFF" />
              <Text style={styles.heroCountdownText}>Llega en 4 min</Text>
            </View>

            <Pressable
              style={styles.heroActionButton}
              onPress={() => setSelectedRoute(MOCK_ROUTES[0])}
            >
              <Text style={styles.heroActionButtonText}>Ver Ruta</Text>
              <Ionicons name="arrow-forward" size={14} color={AppColors.primary} />
            </Pressable>
          </View>
        </View>

        {/* Live Network Statistics Row */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Métricas de la Red Universitaria</Text>
            <Text style={styles.liveTag}>En Vivo</Text>
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              label="Flota Activa"
              value={`${MOCK_FLEET_KPI.activeBuses}/${MOCK_FLEET_KPI.totalBuses}`}
              subtext="Buses operando"
              icon={<Ionicons name="bus" size={16} color={AppColors.primary} />}
              style={styles.statCardHalf}
            />

            <StatCard
              label="Puntualidad"
              value={`${MOCK_FLEET_KPI.onTimePercentage}%`}
              subtext="Red estable"
              icon={<Ionicons name="speedometer" size={16} color={AppColors.success} />}
              iconBgColor={AppColors.successLight}
              style={styles.statCardHalf}
            />

            <StatCard
              label="Espera Media"
              value={`${MOCK_FLEET_KPI.avgWaitMinutes} min`}
              subtext="Frecuencia alta"
              icon={<Ionicons name="timer" size={16} color={AppColors.accent} />}
              iconBgColor={AppColors.accentLight}
              style={styles.statCardHalf}
            />

            <StatCard
              label="Mis Viajes"
              value="38"
              subtext="Este semestre"
              icon={<Ionicons name="card" size={16} color={AppColors.purple} />}
              iconBgColor={AppColors.purpleLight}
              onPress={() => router.push('/student/ST-202688')}
              style={styles.statCardHalf}
            />
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

          <View style={styles.actionTilesRow}>
            {/* 1. Carnet Estudiante (Programmatic Navigation) */}
            <Pressable
              style={({ pressed }) => [
                styles.actionTile,
                pressed && styles.actionTilePressed,
              ]}
              onPress={() => router.push('/student/ST-202688')}
            >
              <View style={[styles.tileIconBox, { backgroundColor: '#E0E7FF' }]}>
                <Ionicons name="id-card" size={24} color={AppColors.primary} />
              </View>
              <Text style={styles.tileTitle}>Mi Carnet Digital</Text>
              <Text style={styles.tileSub}>Pase ST-202688</Text>
            </Pressable>

            {/* 2. Ver Estado / Alertas (Modal Navigation with Link) */}
            <Link href="/modal" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.actionTile,
                  pressed && styles.actionTilePressed,
                ]}
              >
                <View style={[styles.tileIconBox, { backgroundColor: AppColors.warningLight }]}>
                  <Ionicons name="alert-circle" size={24} color={AppColors.warningDark} />
                </View>
                <Text style={styles.tileTitle}>Estado del Servicio</Text>
                <Text style={styles.tileSub}>Modal de alertas</Text>
              </Pressable>
            </Link>

            {/* 3. Explorar Rutas (Tab Navigation) */}
            <Pressable
              style={({ pressed }) => [
                styles.actionTile,
                pressed && styles.actionTilePressed,
              ]}
              onPress={() => router.push('/routes')}
            >
              <View style={[styles.tileIconBox, { backgroundColor: AppColors.accentLight }]}>
                <Ionicons name="navigate" size={24} color={AppColors.accent} />
              </View>
              <Text style={styles.tileTitle}>Todas las Rutas</Text>
              <Text style={styles.tileSub}>{MOCK_ROUTES.length} circuitos</Text>
            </Pressable>

            {/* 4. Simulación de Abordaje */}
            <Pressable
              style={({ pressed }) => [
                styles.actionTile,
                pressed && styles.actionTilePressed,
              ]}
              onPress={() => setShowQuickBoardingModal(true)}
            >
              <View style={[styles.tileIconBox, { backgroundColor: AppColors.successLight }]}>
                <Ionicons name="qr-code" size={24} color={AppColors.success} />
              </View>
              <Text style={styles.tileTitle}>Validar Abordaje</Text>
              <Text style={styles.tileSub}>Escaneo exprés</Text>
            </Pressable>
          </View>
        </View>

        {/* Live Service Alert Banner */}
        {MOCK_ALERTS.length > 0 && (
          <Link href="/modal" asChild>
            <Pressable style={styles.alertBanner}>
              <Ionicons name="warning" size={20} color={AppColors.warningDark} />
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertBannerTitle}>{MOCK_ALERTS[0].title}</Text>
                <Text style={styles.alertBannerSub} numberOfLines={1}>
                  {MOCK_ALERTS[0].description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={AppColors.warningDark} />
            </Pressable>
          </Link>
        )}

        {/* Upcoming Departures Section */}
        <View style={styles.departuresSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas Salidas</Text>
            <Pressable onPress={() => router.push('/routes')}>
              <Text style={styles.seeAllText}>Ver todas →</Text>
            </Pressable>
          </View>

          {MOCK_ROUTES.slice(0, 3).map((route) => (
            <Pressable
              key={route.id}
              style={styles.departureCard}
              onPress={() => setSelectedRoute(route)}
            >
              <View style={[styles.departureCode, { backgroundColor: route.color }]}>
                <Text style={styles.departureCodeText}>{route.code}</Text>
              </View>

              <View style={styles.departureDetails}>
                <Text style={styles.departureName}>{route.name}</Text>
                <Text style={styles.departureDest} numberOfLines={1}>
                  Destino: {route.destination}
                </Text>
              </View>

              <View style={styles.departureMeta}>
                {route.status === 'Activo' ? (
                  <View style={styles.etaPill}>
                    <Text style={styles.etaMinutesText}>{route.etaMinutes} min</Text>
                  </View>
                ) : (
                  <Badge label={route.status} variant="warning" size="sm" />
                )}
                <Text style={styles.departureSeats}>{route.availableSeats} libres</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Route Detail Modal */}
      <RouteDetailModal
        route={selectedRoute}
        visible={!!selectedRoute}
        onClose={() => setSelectedRoute(null)}
      />

      {/* Quick Boarding Simulator Modal */}
      {showQuickBoardingModal && (
        <View style={styles.quickBoardingOverlay}>
          <View style={styles.quickBoardingCard}>
            <Ionicons name="checkmark-circle" size={56} color={AppColors.success} />
            <Text style={styles.quickBoardingTitle}>¡Abordaje Confirmado!</Text>
            <Text style={styles.quickBoardingStudent}>Estudiante: Juan Carlos Pérez</Text>
            <Text style={styles.quickBoardingId}>Pase ST-202688 • Tarifa Universitaria</Text>
            <View style={styles.quickBoardingBadge}>
              <Text style={styles.quickBoardingBadgeText}>Unidad RG-402 • Ruta Norte</Text>
            </View>
            <Pressable
              style={styles.quickBoardingCloseBtn}
              onPress={() => setShowQuickBoardingModal(false)}
            >
              <Text style={styles.quickBoardingCloseText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.text,
  },
  greetingSub: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Shadows.sm,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppColors.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroCard: {
    backgroundColor: '#000666',
    borderRadius: Radius.xl,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#1E3A8A',
    ...Shadows.md,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    gap: 6,
  },
  heroLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: AppColors.success,
  },
  heroBadgeText: {
    color: '#6EE7B7',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  heroStatusBtnText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  heroMain: {
    marginBottom: 16,
  },
  heroNextLabel: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroRouteName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroDestination: {
    color: '#CBD5E1',
    fontSize: 13,
    marginTop: 4,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroCountdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroCountdownText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  heroActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    gap: 6,
  },
  heroActionButtonText: {
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  statsSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.text,
  },
  liveTag: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.success,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCardHalf: {
    width: '48.5%',
  },
  actionsSection: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  actionTilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  actionTile: {
    width: '48.5%',
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    ...Shadows.sm,
  },
  actionTilePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  tileIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 2,
  },
  tileSub: {
    fontSize: 11,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.warningLight,
    marginHorizontal: 16,
    marginTop: 18,
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 12,
    ...Shadows.sm,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.warningDark,
    marginBottom: 2,
  },
  alertBannerSub: {
    fontSize: 11,
    color: '#78350F',
  },
  departuresSection: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.accent,
  },
  departureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 12,
    ...Shadows.sm,
  },
  departureCode: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
  departureCodeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  departureDetails: {
    flex: 1,
  },
  departureName: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 2,
  },
  departureDest: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  departureMeta: {
    alignItems: 'flex-end',
  },
  etaPill: {
    backgroundColor: AppColors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginBottom: 4,
  },
  etaMinutesText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.accent,
  },
  departureSeats: {
    fontSize: 11,
    color: AppColors.textMuted,
  },
  quickBoardingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  quickBoardingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...Shadows.lg,
  },
  quickBoardingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  quickBoardingStudent: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.primary,
    marginBottom: 2,
  },
  quickBoardingId: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginBottom: 12,
  },
  quickBoardingBadge: {
    backgroundColor: AppColors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 18,
  },
  quickBoardingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  quickBoardingCloseBtn: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: Radius.md,
    width: '100%',
    alignItems: 'center',
  },
  quickBoardingCloseText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
