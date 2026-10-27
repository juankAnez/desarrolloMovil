import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { useServices } from '../../src/context/ServiceContext';
import { MOCK_SERVICES } from '../../src/data/mockServices';
import { ServiceCategory } from '../../src/types/service';
import { AppHeader } from '../../src/components/layout/AppHeader';
import { CategoryPills } from '../../src/components/service/CategoryPills';
import { ServiceCard } from '../../src/components/service/ServiceCard';
import { Badge } from '../../src/components/ui/Badge';
import { UserAvatar } from '../../src/components/ui/UserAvatar';

export default function HomeScreen() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();
  const { requests, updateRequestStatus } = useServices();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Estado de disponibilidad del prestador
  const [isOnline, setIsOnline] = useState(true);

  // Estados de filtro para el Cliente
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Todos');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [offeredServicesState, setOfferedServicesState] = useState<Record<string, boolean>>({
    'SRV-01': true,
    'SRV-02': true,
    'SRV-03': true,
  });

  // Animación de pulso para badges
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.45,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1100,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0.2,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.75,
            duration: 1100,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim, pulseOpacity]);

  // Filtrado de servicios para la vista de Cliente
  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter((item) => {
      if (selectedCategory !== 'Todos' && item.category !== selectedCategory) {
        return false;
      }
      if (maxPrice !== null && item.price > maxPrice) {
        return false;
      }
      if (minRating !== null && item.rating < minRating) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchProv = item.provider.name.toLowerCase().includes(query);
        const matchCat = item.category.toLowerCase().includes(query);
        return matchTitle || matchDesc || matchProv || matchCat;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, maxPrice, minRating]);

  // Solicitudes del Prestador
  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const activeRequests = requests.filter(
    (r) => r.status === 'ACCEPTED' || r.status === 'ON_THE_WAY' || r.status === 'IN_PROGRESS'
  );

  const handleReject = (id: string) => {
    Alert.alert(
      'Rechazar Solicitud',
      '¿Estás seguro de que deseas rechazar este servicio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: () => updateRequestStatus(id, 'CANCELLED'),
        },
      ]
    );
  };

  const handleAccept = (id: string) => {
    updateRequestStatus(id, 'ACCEPTED');
    router.push(`/tracking/${id}`);
  };

  const toggleOfferedService = (id: string) => {
    setOfferedServicesState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.screen}>
      {/* HEADER UNIFICADO */}
      <AppHeader
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          role === 'CLIENT' ? styles.clientScrollContent : styles.providerScrollContent
        }
      >
        {role === 'CLIENT' ? (
          // ==============================================================
          // ==================== VISTA CLIENTE ===========================
          // ==============================================================
          <>
            {/* Search Section */}
            <View style={styles.searchSection}>
              <View style={styles.searchInputWrapper}>
                <Ionicons
                  name="search-outline"
                  size={17}
                  color="#94A3B8"
                  style={styles.searchLeftIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar servicio (ej. computadores, aseo, luz)..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <View style={styles.filterButtonInSearch}>
                  <Ionicons name="filter-outline" size={14} color="#475569" />
                </View>
              </View>
            </View>

            {/* Categories Carousel */}
            <CategoryPills
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Quick Pill Filters */}
            <View style={styles.pillFiltersRow}>
              <Pressable
                style={[
                  styles.quickPill,
                  maxPrice === 90000 && styles.quickPillActive,
                ]}
                onPress={() => setMaxPrice(maxPrice === 90000 ? null : 90000)}
              >
                <Ionicons
                  name="pricetag-outline"
                  size={12}
                  color={maxPrice === 90000 ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.quickPillText,
                    maxPrice === 90000 && styles.quickPillTextActive,
                  ]}
                >
                  Hasta $90.000 COP
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.quickPill,
                  styles.quickPillAmber,
                  minRating === 4.9 && styles.quickPillActive,
                ]}
                onPress={() => setMinRating(minRating === 4.9 ? null : 4.9)}
              >
                <Text style={styles.starIconText}>★</Text>
                <Text
                  style={[
                    styles.quickPillTextAmber,
                    minRating === 4.9 && styles.quickPillTextActive,
                  ]}
                >
                  4.9+ Estrellas
                </Text>
              </Pressable>

              {(maxPrice !== null || minRating !== null || selectedCategory !== 'Todos' || searchQuery !== '') && (
                <Pressable
                  style={styles.clearBtn}
                  onPress={() => {
                    setMaxPrice(null);
                    setMinRating(null);
                    setSelectedCategory('Todos');
                    setSearchQuery('');
                  }}
                >
                  <Ionicons name="close-circle-outline" size={13} color="#2563EB" />
                  <Text style={styles.clearBtnText}>Limpiar</Text>
                </Pressable>
              )}
            </View>

            {/* Results Summary Row */}
            <View style={styles.resultsSummaryRow}>
              <Text style={styles.resultsSummaryCount}>
                {filteredServices.length} servicios disponibles en Riohacha
              </Text>
              <View style={styles.sortLink}>
                <Text style={styles.sortLinkText}>Más cercanos</Text>
                <Ionicons name="chevron-down" size={11} color="#2563EB" />
              </View>
            </View>

            {/* Services List Feed */}
            <View style={styles.servicesFeed}>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onPress={() => router.push(`/service/${service.id}`)}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={44} color="#94A3B8" />
                  <Text style={styles.emptyTitle}>No se encontraron servicios</Text>
                  <Text style={styles.emptyText}>
                    Intenta cambiar la categoría o los filtros de búsqueda.
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          // ==============================================================
          // ==================== VISTA PRESTADOR =========================
          // ==============================================================
          <>
            {/* BEGIN: ProviderKPIs */}
            <View style={styles.kpiGrid}>
              {/* Card 1: Pendientes */}
              <View style={styles.kpiCardAmber}>
                <View style={styles.kpiTopRow}>
                  <View style={styles.kpiIconBoxAmber}>
                    <Ionicons name="notifications" size={15} color="#D97706" />
                  </View>
                  <Text style={styles.kpiBadgeAmber}>PEND.</Text>
                </View>
                <View>
                  <Text style={styles.kpiNumber}>{pendingRequests.length}</Text>
                  <Text style={styles.kpiSub}>Nuevas solicitudes</Text>
                </View>
                <View style={styles.kpiGlowAmber} />
              </View>

              {/* Card 2: En Curso */}
              <View style={styles.kpiCardBlue}>
                <View style={styles.kpiTopRow}>
                  <View style={styles.kpiIconBoxBlue}>
                    <Ionicons name="navigate" size={15} color="#2563EB" />
                  </View>
                  <Text style={styles.kpiBadgeBlue}>ACTIVO</Text>
                </View>
                <View>
                  <Text style={styles.kpiNumber}>{activeRequests.length}</Text>
                  <Text style={styles.kpiSub}>En desarrollo</Text>
                </View>
                <View style={styles.kpiGlowBlue} />
              </View>

              {/* Card 3: Calificación */}
              <View style={styles.kpiCardSlate}>
                <View style={styles.kpiTopRow}>
                  <View style={styles.kpiIconBoxYellow}>
                    <Ionicons name="star" size={15} color="#F59E0B" />
                  </View>
                  <Text style={styles.kpiBadgeSlate}>SCORE</Text>
                </View>
                <View>
                  <Text style={styles.kpiNumber}>4.9</Text>
                  <Text style={styles.kpiSub}>142 valoradas</Text>
                </View>
              </View>
            </View>
            {/* END: ProviderKPIs */}

            {/* BEGIN: PendingRequestsSection */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleGroup}>
                  <Text style={styles.sectionTitle}>Solicitudes Pendientes</Text>
                  <View style={styles.counterBadge}>
                    <Text style={styles.counterBadgeText}>
                      {pendingRequests.length}
                    </Text>
                  </View>
                </View>

                {/* Pulse Badge "Por responder" */}
                <View style={styles.respondingBadge}>
                  <Animated.View
                    style={[
                      styles.respondingDot,
                      {
                        opacity: pulseOpacity,
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  />
                  <Text style={styles.respondingBadgeText}>Por responder</Text>
                </View>
              </View>

              {/* Main Card: Solicitud Activa */}
              {pendingRequests.length > 0 ? (
                pendingRequests.map((req) => (
                  <View key={req.id} style={styles.pendingCard}>
                    {/* Client & Price Row */}
                    <View style={styles.pendingTopRow}>
                      <View style={styles.clientInfoGroup}>
                        <UserAvatar
                          avatar={req.client.avatar}
                          name={req.client.name}
                          size={42}
                          borderRadius={14}
                          role="CLIENT"
                        />

                        <View style={styles.clientTextDetails}>
                          <Text style={styles.clientName}>{req.client.name}</Text>
                          <View style={styles.clientAddressRow}>
                            <Ionicons
                              name="location-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text
                              style={styles.clientAddressText}
                              numberOfLines={1}
                            >
                              {req.clientLocation.label}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Total Estimado */}
                      <View style={styles.priceCol}>
                        <Text style={styles.priceEstimateLabel}>Total Est.</Text>
                        <Text style={styles.priceAmount}>
                          {req.service.priceFormatted.replace(' COP', '')}{' '}
                          <Text style={styles.priceCurrency}>COP</Text>
                        </Text>
                      </View>
                    </View>

                    {/* Service Content */}
                    <View style={styles.serviceContentBox}>
                      <View style={styles.serviceTitleRow}>
                        <View style={styles.serviceDot} />
                        <Text style={styles.serviceTitleText}>
                          {req.service.title}
                        </Text>
                      </View>

                      {/* Client Quote Bubble */}
                      <View style={styles.quoteBubble}>
                        <Ionicons
                          name="chatbubble-ellipses-outline"
                          size={15}
                          color="#94A3B8"
                          style={styles.quoteIcon}
                        />
                        <Text style={styles.quoteText}>
                          &quot;{req.notes || 'Revisión urgente solicitada por el cliente.'}&quot;
                        </Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionsGrid}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.rejectButton,
                          pressed && styles.buttonPressed,
                        ]}
                        onPress={() => handleReject(req.id)}
                      >
                        <Ionicons name="close" size={16} color="#E11D48" />
                        <Text style={styles.rejectButtonText}>Rechazar</Text>
                      </Pressable>

                      <Pressable
                        style={({ pressed }) => [
                          styles.acceptButton,
                          pressed && styles.buttonPressed,
                        ]}
                        onPress={() => handleAccept(req.id)}
                      >
                        <Ionicons name="checkmark" size={17} color="#FFFFFF" />
                        <Text style={styles.acceptButtonText}>Aceptar Solicitud</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyPendingCard}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={36}
                    color="#10B981"
                  />
                  <Text style={styles.emptyPendingTitle}>
                    ¡Bandeja al día!
                  </Text>
                  <Text style={styles.emptyPendingSubtitle}>
                    No tienes solicitudes pendientes por responder en este momento.
                  </Text>
                </View>
              )}
            </View>
            {/* END: PendingRequestsSection */}

            {/* BEGIN: ActiveServicesSection */}
            {activeRequests.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.sectionTitleGroup}>
                    <Text style={styles.sectionTitle}>Servicios Activos en Curso</Text>
                    <View style={[styles.counterBadge, { backgroundColor: '#DBEAFE' }]}>
                      <Text style={[styles.counterBadgeText, { color: '#1D4ED8' }]}>
                        {activeRequests.length}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.activePillCount}>
                    {activeRequests.length} activo
                  </Text>
                </View>

                {activeRequests.map((req) => (
                  <Pressable
                    key={req.id}
                    style={({ pressed }) => [
                      styles.activeCard,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => router.push(`/tracking/${req.id}`)}
                  >
                    <View style={styles.activeTopRow}>
                      <View style={styles.statusPingBadge}>
                        <Animated.View
                          style={[
                            styles.statusPingDot,
                            {
                              opacity: pulseOpacity,
                              transform: [{ scale: pulseAnim }],
                            },
                          ]}
                        />
                        <Text style={styles.statusPingText}>En Camino</Text>
                      </View>
                      <View style={styles.distBadge}>
                        <Ionicons name="time-outline" size={13} color="#64748B" />
                        <Text style={styles.distText}>
                          A {req.estimatedDistanceKm} km de destino
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.activeTitle}>{req.service.title}</Text>
                    <Text style={styles.activeClientSub}>
                      Cliente: <Text style={styles.activeClientName}>{req.client.name}</Text>
                    </Text>

                    <View style={styles.activeFooter}>
                      <Text style={styles.activeStepInfo}>
                        Paso 2 de 4: Desplazamiento
                      </Text>
                      <View style={styles.activeFooterRight}>
                        <Text style={styles.activeFooterAction}>
                          Ver Ruta y Cambiar Estado
                        </Text>
                        <Ionicons name="arrow-forward" size={13} color="#2563EB" />
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
            {/* END: ActiveServicesSection */}

            {/* BEGIN: OfferedServicesSection */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Servicios que Ofreces</Text>
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      'Nuevo Servicio',
                      'La publicación de nuevos servicios estará disponible en la conexión backend.',
                      [{ text: 'Entendido' }]
                    )
                  }
                >
                  <Text style={styles.addServiceLink}>+ Agregar nuevo</Text>
                </Pressable>
              </View>

              {MOCK_SERVICES.slice(0, 3).map((srv) => {
                const isActive = offeredServicesState[srv.id] ?? true;
                return (
                  <View key={srv.id} style={styles.offeredItem}>
                    <View style={styles.offeredLeft}>
                      <Switch
                        value={isActive}
                        onValueChange={() => toggleOfferedService(srv.id)}
                        trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                        thumbColor="#FFFFFF"
                      />
                      <View style={styles.offeredDetails}>
                        <Text style={styles.offeredTitle} numberOfLines={1}>
                          {srv.title}
                        </Text>
                        <Text style={styles.offeredCat}>
                          {srv.category} &amp; Especialidad
                        </Text>
                      </View>
                    </View>
                    <View style={styles.offeredRight}>
                      <Text style={styles.offeredPriceNumber}>
                        {srv.priceFormatted.replace(' COP', '')}
                      </Text>
                      <Text style={styles.offeredPriceCop}>COP</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {/* END: OfferedServicesSection */}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  clientScrollContent: {
    paddingBottom: 36,
  },
  providerScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 20,
  },

  /* CLIENT SEARCH SECTION */
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchLeftIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  filterButtonInSearch: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },

  /* PILL FILTERS */
  pillFiltersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
    flexWrap: 'wrap',
  },
  quickPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 5,
  },
  quickPillAmber: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  quickPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  starIconText: {
    color: '#F59E0B',
    fontSize: 12,
  },
  quickPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  quickPillTextAmber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  quickPillTextActive: {
    color: '#FFFFFF',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* RESULTS SUMMARY */
  resultsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  resultsSummaryCount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sortLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  sortLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  servicesFeed: {
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },

  /* PROVIDER STYLES */
  kpiGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiCardAmber: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    justifyContent: 'space-between',
    height: 98,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  kpiCardBlue: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    justifyContent: 'space-between',
    height: 98,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  kpiCardSlate: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    justifyContent: 'space-between',
    height: 98,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  kpiTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiIconBoxAmber: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiBadgeAmber: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  kpiIconBoxBlue: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiBadgeBlue: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  kpiIconBoxYellow: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#FEFCE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiBadgeSlate: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  kpiSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  kpiGlowAmber: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  kpiGlowBlue: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },

  /* SECTION WRAPPER */
  sectionContainer: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  counterBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  respondingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  respondingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  respondingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },

  /* MAIN PENDING CARD */
  pendingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  pendingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  clientInfoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  clientAvatarGradient: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  clientAvatarInitials: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  clientTextDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  clientAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  clientAddressText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceEstimateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  priceAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2563EB',
  },
  priceCurrency: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  serviceContentBox: {
    paddingVertical: 12,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  serviceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  serviceTitleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  quoteBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 10,
    marginTop: 8,
    gap: 8,
  },
  quoteIcon: {
    marginTop: 1,
  },
  quoteText: {
    fontSize: 12,
    color: '#475569',
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 17,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 4,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingVertical: 11,
    borderRadius: 14,
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E11D48',
  },
  acceptButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 11,
    borderRadius: 14,
    gap: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  emptyPendingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  emptyPendingTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  emptyPendingSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },

  /* ACTIVE SERVICES IN COURSE */
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
    gap: 8,
  },
  activePillCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  activeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  statusPingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4F46E5',
  },
  statusPingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
  },
  distBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  activeClientSub: {
    fontSize: 12,
    color: '#64748B',
  },
  activeClientName: {
    fontWeight: '700',
    color: '#334155',
  },
  activeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  activeStepInfo: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeFooterAction: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },

  /* OFFERED SERVICES SECTION */
  addServiceLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  offeredItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  offeredLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  offeredDetails: {
    flex: 1,
  },
  offeredTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  offeredCat: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  offeredRight: {
    alignItems: 'flex-end',
  },
  offeredPriceNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  offeredPriceCop: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
});
