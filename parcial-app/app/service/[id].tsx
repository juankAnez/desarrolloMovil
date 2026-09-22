import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_SERVICES } from '../../src/data/mockServices';
import { useServices } from '../../src/context/ServiceContext';
import { RiohachaMap } from '../../src/components/map/RiohachaMap';
import { UserAvatar } from '../../src/components/ui/UserAvatar';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { createRequest } = useServices();

  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const service = MOCK_SERVICES.find((s) => s.id === id) || MOCK_SERVICES[0];

  const handleRequestService = () => {
    setLoading(true);
    setTimeout(() => {
      const newReq = createRequest(service, notes);
      setLoading(false);
      // Navigate to Tracking
      router.push(`/tracking/${newReq.id}`);
    }, 500);
  };

  return (
    <View style={styles.screen}>
      {/* Top Navbar */}
      <View style={styles.navBar}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </Pressable>

        <View style={styles.navTitleBox}>
          <Text style={styles.navTitle}>Detalle del Servicio</Text>
          <Text style={styles.navSubtitle}>Riohacha, La Guajira</Text>
        </View>

        <View style={styles.navRightPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Service Card Header */}
        <View style={styles.headerCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{service.category}</Text>
          </View>

          <Text style={styles.serviceTitle}>{service.title}</Text>

          <View style={styles.ratingAndDistRow}>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingScore}>{service.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({service.reviewCount} opiniones verificadas)</Text>
            </View>

            <View style={styles.distanceBadge}>
              <Ionicons name="location-outline" size={13} color="#64748B" />
              <Text style={styles.distanceText}>{service.distanceKm} km</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tarifa base estimada:</Text>
            <Text style={styles.priceValue}>{service.priceFormatted}</Text>
          </View>
        </View>

        {/* Provider Profile Info Card */}
        <View style={styles.card}>
          <View style={styles.providerHeader}>
            <UserAvatar
              avatar={service.provider.avatar}
              name={service.provider.name}
              size={48}
              borderRadius={16}
              role="PROVIDER"
            />

            <View style={styles.providerInfoCol}>
              <Text style={styles.providerName}>{service.provider.name}</Text>
              <Text style={styles.providerProfession}>{service.provider.profession}</Text>
              <Text style={styles.providerLocation} numberOfLines={1}>
                {service.provider.neighborhood}
              </Text>
            </View>

            <View style={styles.verifiedTag}>
              <Ionicons name="checkmark-circle" size={13} color="#059669" />
              <Text style={styles.verifiedText}>Verificado</Text>
            </View>
          </View>

          <View style={styles.providerStatsRow}>
            <View style={styles.providerStatItem}>
              <Text style={styles.providerStatNumber}>{service.provider.completedJobs}</Text>
              <Text style={styles.providerStatLabel}>Trabajos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.providerStatItem}>
              <Text style={styles.providerStatNumber}>100%</Text>
              <Text style={styles.providerStatLabel}>Cumplimiento</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.providerStatItem}>
              <Text style={styles.providerStatNumber}>{service.estimatedDuration}</Text>
              <Text style={styles.providerStatLabel}>Duración</Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Descripción del Servicio</Text>
          <Text style={styles.descriptionText}>{service.description}</Text>
        </View>

        {/* Included Tasks */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>¿Qué incluye este servicio?</Text>
          <View style={styles.tasksList}>
            {service.includedTasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <Ionicons name="checkmark-circle" size={16} color="#2563EB" />
                <Text style={styles.taskText}>{task}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cobertura y Mapa Riohacha */}
        <View style={styles.mapCard}>
          <Text style={styles.cardTitle}>Punto de Cobertura en Riohacha</Text>
          <Text style={styles.mapSub}>
            Ubicación del prestador y cálculo de ruta hacia tu domicilio
          </Text>

          <RiohachaMap
            clientLocation={{
              latitude: 11.5445,
              longitude: -72.9070,
              label: 'Calle 7 # 12-45, Barrio Centro, Riohacha',
            }}
            providerLocation={{
              latitude: service.provider.latitude,
              longitude: service.provider.longitude,
              label: service.provider.neighborhood,
            }}
            status="PENDING"
            distanceKm={service.distanceKm}
            etaMinutes={Math.round(service.distanceKm * 6)}
          />
        </View>

        {/* Optional Notes Input */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Instrucciones o Detalles para el Prestador</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Ej: Por favor traer herramienta especial, el timbre no funciona..."
            placeholderTextColor="#94A3B8"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* CTA Solicitar Button */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.btnPressed,
              loading && styles.btnDisabled,
            ]}
            onPress={handleRequestService}
            disabled={loading}
          >
            <LinearGradient
              colors={['#2563EB', '#4F46E5']}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.ctaButtonText}>
                {loading ? 'Creando Solicitud...' : 'Solicitar Servicio Ahora'}
              </Text>
              <Ionicons name="send" size={15} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
          <Text style={styles.ctaDisclaimer}>
            Al solicitar el servicio, se notificará al prestador y podrás seguir su desplazamiento en tiempo real con GPS.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 44,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitleBox: {
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  navSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  navRightPlaceholder: {
    width: 36,
  },
  scrollContent: {
    paddingBottom: 40,
    gap: 12,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 26,
    marginBottom: 10,
  },
  ratingAndDistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingStar: {
    color: '#F59E0B',
    fontSize: 14,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  reviewCount: {
    fontSize: 12,
    color: '#94A3B8',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2563EB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  providerInfoCol: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  providerProfession: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 1,
  },
  providerLocation: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  providerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  providerStatItem: {
    alignItems: 'center',
  },
  providerStatNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  providerStatLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  descriptionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  tasksList: {
    gap: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  taskText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 18,
  },
  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  mapSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  notesInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 72,
    textAlignVertical: 'top',
  },
  ctaContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    gap: 8,
  },
  ctaButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaGradient: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ctaDisclaimer: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
