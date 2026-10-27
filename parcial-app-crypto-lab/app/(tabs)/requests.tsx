import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { useServices } from '../../src/context/ServiceContext';
import { AppHeader } from '../../src/components/layout/AppHeader';
import { Badge } from '../../src/components/ui/Badge';
import { UserAvatar } from '../../src/components/ui/UserAvatar';

type FilterType = 'all' | 'active' | 'completed';

export default function RequestsScreen() {
  const router = useRouter();
  const { role } = useAuth();
  const { requests } = useServices();

  const [activeTab, setActiveTab] = useState<FilterType>('all');

  const activeCount = requests.filter(
    (r) => r.status !== 'COMPLETED' && r.status !== 'CANCELLED'
  ).length;

  const filtered = useMemo(() => {
    return requests.filter((req) => {
      if (activeTab === 'active') {
        return req.status !== 'COMPLETED' && req.status !== 'CANCELLED';
      }
      if (activeTab === 'completed') {
        return req.status === 'COMPLETED' || req.status === 'CANCELLED';
      }
      return true;
    });
  }, [requests, activeTab]);

  return (
    <View style={styles.screen}>
      <AppHeader showGreeting={false} />

      {/* Top Banner & Filter Segmented Tabs */}
      <View style={styles.topBanner}>
        <Text style={styles.pageTitle}>
          {role === 'CLIENT' ? 'Mis Pedidos de Servicio' : 'Historial de Servicios'}
        </Text>
        <Text style={styles.pageSubtitle}>
          {role === 'CLIENT'
            ? 'Monitorea el estado y ubicación del prestador en tiempo real'
            : 'Gestiona los servicios asignados y su avance en Riohacha'}
        </Text>

        {/* Filter Segmented Pills */}
        <View style={styles.segmentedFilter}>
          <Pressable
            style={[styles.segmentBtn, activeTab === 'all' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text
              style={[
                styles.segmentBtnText,
                activeTab === 'all' && styles.segmentBtnTextActive,
              ]}
            >
              Todas ({requests.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.segmentBtn, activeTab === 'active' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.segmentBtnText,
                activeTab === 'active' && styles.segmentBtnTextActive,
              ]}
            >
              Activas ({activeCount})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.segmentBtn, activeTab === 'completed' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.segmentBtnText,
                activeTab === 'completed' && styles.segmentBtnTextActive,
              ]}
            >
              Finalizadas
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length > 0 ? (
          filtered.map((req) => (
            <Pressable
              key={req.id}
              style={({ pressed }) => [
                styles.requestCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push(`/tracking/${req.id}`)}
            >
              {/* Card Header: Service name & Status */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleDetailsCol}>
                  <Text style={styles.serviceName}>{req.service.title}</Text>
                  <Text style={styles.dateIdText}>
                    {req.createdAt} • ID: {req.id}
                  </Text>
                </View>
                <Badge status={req.status} size="sm" />
              </View>

              {/* Counterparty Row */}
              <View style={styles.counterpartyCard}>
                <UserAvatar
                  avatar={role === 'CLIENT' ? req.provider.avatar : req.client.avatar}
                  name={role === 'CLIENT' ? req.provider.name : req.client.name}
                  size={36}
                  borderRadius={12}
                  role={role === 'CLIENT' ? 'PROVIDER' : 'CLIENT'}
                />

                <View style={styles.counterpartyInfo}>
                  <Text style={styles.counterpartyRoleLabel}>
                    {role === 'CLIENT' ? 'Prestador asignado:' : 'Cliente solicitante:'}
                  </Text>
                  <Text style={styles.counterpartyName}>
                    {role === 'CLIENT' ? req.provider.name : req.client.name}
                  </Text>
                </View>

                <View style={styles.priceCol}>
                  <Text style={styles.priceTag}>{req.service.priceFormatted}</Text>
                </View>
              </View>

              {/* Location Row */}
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={13} color="#64748B" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {req.clientLocation.label}
                </Text>
              </View>

              {/* Card Footer: Action */}
              <View style={styles.cardFooter}>
                <View style={styles.trackingHint}>
                  <Ionicons
                    name={
                      req.status === 'ON_THE_WAY'
                        ? 'navigate-circle'
                        : 'map-outline'
                    }
                    size={15}
                    color="#2563EB"
                  />
                  <Text style={styles.trackingHintText}>
                    {req.status === 'ON_THE_WAY'
                      ? 'En camino (GPS en vivo) • Ver mapa y chat'
                      : 'Ver seguimiento GPS y chat'}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={14} color="#2563EB" />
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={44} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No hay solicitudes en esta sección</Text>
            <Text style={styles.emptySubtitle}>
              Las solicitudes creadas o recibidas aparecerán listadas aquí.
            </Text>
          </View>
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
  topBanner: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pageTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  segmentedFilter: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentBtnTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
  listScrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleDetailsCol: {
    flex: 1,
    marginRight: 10,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  dateIdText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  counterpartyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 10,
    marginBottom: 10,
  },
  counterpartyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterpartyAvatarText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  counterpartyInfo: {
    flex: 1,
  },
  counterpartyRoleLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  counterpartyName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceTag: {
    fontSize: 13,
    fontWeight: '900',
    color: '#2563EB',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  trackingHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trackingHintText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
