import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { useServices } from '../../src/context/ServiceContext';
import { RiohachaMap } from '../../src/components/map/RiohachaMap';
import { StatusStepper } from '../../src/components/tracking/StatusStepper';
import { Badge } from '../../src/components/ui/Badge';
import { ServiceChatModal } from '../../src/components/chat/ServiceChatModal';
import { UserAvatar } from '../../src/components/ui/UserAvatar';

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role, switchRole } = useAuth();
  const { getRequestById, updateRequestStatus, cancelRequest, stepProviderLocation } = useServices();

  const [chatVisible, setChatVisible] = useState(false);

  const request = getRequestById(id || '') || {
    id: 'REQ-DEMO',
    service: {
      id: 'SRV-01',
      title: 'Reparación y Mantenimiento de Computadores',
      category: 'Tecnología',
      description: 'Servicio técnico especializado a domicilio',
      price: 85000,
      priceFormatted: '$85.000 COP',
      estimatedDuration: '2 horas',
      provider: {
        id: 'PROV-01',
        name: 'Carlos Mendoza',
        profession: 'Técnico Especialista en Cómputo',
        rating: 4.9,
        completedJobs: 142,
        phone: '+57 312 876 5432',
        avatar: 'CM',
        latitude: 11.5380,
        longitude: -72.9150,
        neighborhood: 'Barrio Coquivacoa, Riohacha',
      },
      distanceKm: 1.2,
      rating: 4.9,
      reviewCount: 48,
      imageUrl: 'hardware-chip-outline',
      includedTasks: [],
    },
    client: {
      id: 'USR-CLIENT-01',
      email: 'cliente@test.com',
      name: 'Laura Vanessa Gómez',
      role: 'CLIENT' as const,
      phone: '+57 300 456 7890',
      avatar: 'LG',
      address: 'Calle 7 # 12-45, Barrio Centro, Riohacha',
      latitude: 11.5445,
      longitude: -72.9070,
    },
    provider: {
      id: 'USR-PROV-01',
      email: 'prestador@test.com',
      name: 'Carlos Mendoza',
      role: 'PROVIDER' as const,
      phone: '+57 312 876 5432',
      avatar: 'CM',
      address: 'Carrera 15 # 22-10, Barrio Coquivacoa, Riohacha',
      latitude: 11.5380,
      longitude: -72.9150,
    },
    status: 'ON_THE_WAY' as const,
    createdAt: 'Hoy, 02:15 PM',
    updatedAt: 'Hace 5 min',
    clientLocation: {
      latitude: 11.5445,
      longitude: -72.9070,
      label: 'Calle 7 # 12-45, Barrio Centro, Riohacha',
    },
    providerCurrentLocation: {
      latitude: 11.5410,
      longitude: -72.9110,
      label: 'En desplazamiento por Carrera 10, Riohacha',
    },
    estimatedDistanceKm: 0.8,
    estimatedArrivalMinutes: 5,
    notes: 'Computador portátil sin encendido de pantalla.',
  };

  const handleAdvanceState = () => {
    switch (request.status) {
      case 'PENDING':
        updateRequestStatus(request.id, 'ACCEPTED');
        break;
      case 'ACCEPTED':
        updateRequestStatus(request.id, 'ON_THE_WAY');
        break;
      case 'ON_THE_WAY':
        updateRequestStatus(request.id, 'IN_PROGRESS');
        break;
      case 'IN_PROGRESS':
        updateRequestStatus(request.id, 'COMPLETED');
        break;
      default:
        break;
    }
  };

  const isFinalized = request.status === 'COMPLETED' || request.status === 'CANCELLED';

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
          <Text style={styles.navTitle}>Seguimiento en Vivo</Text>
          <Text style={styles.navSubtitle}>Riohacha, La Guajira</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.navChatBtn, pressed && styles.btnPressed]}
          onPress={() => setChatVisible(true)}
          hitSlop={8}
        >
          <Ionicons name="chatbubble-ellipses" size={18} color="#2563EB" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Header Banner */}
        <View style={styles.topStatusCard}>
          <View style={styles.statusHeaderRow}>
            <View style={styles.serviceTitleCol}>
              <Text style={styles.serviceOrderTitle}>{request.service.title}</Text>
              <Text style={styles.orderIdText}>
                Orden: {request.id} • {request.createdAt}
              </Text>
            </View>
            <Badge status={request.status} size="sm" />
          </View>

          <View style={styles.priceAndEtaRow}>
            <View style={styles.feeBox}>
              <Text style={styles.feeLabel}>Monto Acordado:</Text>
              <Text style={styles.feeValue}>{request.service.priceFormatted}</Text>
            </View>

            <View style={styles.feeBox}>
              <Text style={styles.feeLabel}>Distancia Aprox:</Text>
              <Text style={styles.distValue}>{request.estimatedDistanceKm} km</Text>
            </View>
          </View>
        </View>

        {/* Counterparty Profile Card */}
        <View style={styles.userCard}>
          <UserAvatar
            avatar={role === 'CLIENT' ? request.provider.avatar : request.client.avatar}
            name={role === 'CLIENT' ? request.provider.name : request.client.name}
            size={46}
            borderRadius={16}
            role={role === 'CLIENT' ? 'PROVIDER' : 'CLIENT'}
          />

          <View style={styles.userInfoCol}>
            <Text style={styles.userRoleLabel}>
              {role === 'CLIENT' ? 'Prestador Asignado' : 'Cliente Solicitante'}
            </Text>
            <Text style={styles.userName}>
              {role === 'CLIENT' ? request.provider.name : request.client.name}
            </Text>
            <Text style={styles.userPhone}>
              {role === 'CLIENT' ? request.provider.phone : request.client.phone}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.callBadge, pressed && styles.btnPressed]}
            onPress={() =>
              Alert.alert(
                'Llamada Telefónica',
                `Conectando con ${
                  role === 'CLIENT' ? request.provider.name : request.client.name
                } (${role === 'CLIENT' ? request.provider.phone : request.client.phone})`,
                [{ text: 'Finalizar' }]
              )
            }
            hitSlop={8}
          >
            <Ionicons name="call" size={16} color="#2563EB" />
          </Pressable>
        </View>

        {/* Chat de Comunicación Directa Card */}
        <Pressable
          style={({ pressed }) => [
            styles.chatActionCard,
            pressed && styles.btnPressed,
          ]}
          onPress={() => setChatVisible(true)}
        >
          <View style={styles.chatIconCircle}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#2563EB" />
          </View>
          <View style={styles.chatTextsCol}>
            <View style={styles.chatTitleRow}>
              <Text style={styles.chatCardTitle}>
                Chat con{' '}
                {role === 'CLIENT'
                  ? request.provider.name.split(' ')[0]
                  : request.client.name.split(' ')[0]}
              </Text>
              <View style={styles.chatOnlinePill}>
                <View style={styles.chatOnlineDot} />
                <Text style={styles.chatOnlineText}>En línea</Text>
              </View>
            </View>
            <Text style={styles.chatCardPreview} numberOfLines={1}>
              &quot;Entendido. Ya voy en camino hacia tu ubicación en Riohacha.&quot;
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#2563EB" />
        </Pressable>

        {/* Mapa Funcional de Riohacha */}
        <View style={styles.mapCard}>
          <Text style={styles.cardTitle}>Ruta y Desplazamiento en Riohacha</Text>
          <Text style={styles.mapSubtitle}>
            {request.status === 'ON_THE_WAY'
              ? 'El prestador se encuentra en camino. Puedes simular el paso GPS o ver la ruta.'
              : 'Posición geográfica de origen y destino en Riohacha.'}
          </Text>

          <RiohachaMap
            clientLocation={request.clientLocation}
            providerLocation={request.providerCurrentLocation}
            status={request.status}
            distanceKm={request.estimatedDistanceKm}
            etaMinutes={request.estimatedArrivalMinutes}
            onSimulateStep={() => stepProviderLocation(request.id)}
            onOpenChat={() => setChatVisible(true)}
          />
        </View>

        {/* Línea de Progreso (Stepper) */}
        <View style={styles.stepperCard}>
          <Text style={styles.cardTitle}>Progreso Operativo</Text>
          <StatusStepper currentStatus={request.status} />
        </View>

        {/* Role Evaluation Helper */}
        <View style={styles.roleHintBox}>
          <Ionicons name="information-circle-outline" size={18} color="#2563EB" />
          <Text style={styles.roleHintText}>
            Visualizando como <Text style={styles.boldText}>{role}</Text>.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.quickSwitchBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={switchRole}
          >
            <Text style={styles.quickSwitchBtnText}>
              Ver como {role === 'CLIENT' ? 'PRESTADOR' : 'CLIENTE'}
            </Text>
          </Pressable>
        </View>

        {/* Control Panel for Provider or Client Actions */}
        <View style={styles.actionPanelCard}>
          <Text style={styles.cardTitle}>
            {role === 'PROVIDER'
              ? 'Controles del Prestador (Cambiar Estado)'
              : 'Acciones del Cliente'}
          </Text>

          {role === 'PROVIDER' ? (
            <View style={styles.providerControls}>
              {request.status === 'PENDING' && (
                <View style={styles.btnRow}>
                  <Pressable
                    style={[styles.halfBtn, styles.dangerBtn]}
                    onPress={() => cancelRequest(request.id)}
                  >
                    <Ionicons name="close" size={16} color="#E11D48" />
                    <Text style={styles.dangerBtnText}>Rechazar</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.halfBtn, styles.primaryBtn]}
                    onPress={handleAdvanceState}
                  >
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Aceptar</Text>
                  </Pressable>
                </View>
              )}

              {request.status === 'ACCEPTED' && (
                <Pressable
                  style={styles.fullPrimaryBtn}
                  onPress={handleAdvanceState}
                >
                  <LinearGradient
                    colors={['#2563EB', '#4F46E5']}
                    style={styles.btnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="navigate" size={16} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>
                      Marcar &quot;En Camino&quot; (Iniciar Desplazamiento GPS)
                    </Text>
                  </LinearGradient>
                </Pressable>
              )}

              {request.status === 'ON_THE_WAY' && (
                <Pressable
                  style={styles.fullPrimaryBtn}
                  onPress={handleAdvanceState}
                >
                  <LinearGradient
                    colors={['#2563EB', '#4F46E5']}
                    style={styles.btnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="construct" size={16} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>
                      Marcar &quot;Iniciar Servicio en Domicilio&quot;
                    </Text>
                  </LinearGradient>
                </Pressable>
              )}

              {request.status === 'IN_PROGRESS' && (
                <Pressable
                  style={styles.fullPrimaryBtn}
                  onPress={handleAdvanceState}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.btnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>
                      Marcar &quot;Finalizar Servicio&quot; (Completado)
                    </Text>
                  </LinearGradient>
                </Pressable>
              )}

              {isFinalized && (
                <View style={styles.completedNotice}>
                  <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                  <Text style={styles.completedNoticeText}>
                    Este servicio ha concluido su ciclo ({request.status}).
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.clientControls}>
              {request.status === 'PENDING' && (
                <Pressable
                  style={styles.cancelOrderBtn}
                  onPress={() => cancelRequest(request.id)}
                >
                  <Ionicons name="close" size={16} color="#E11D48" />
                  <Text style={styles.cancelOrderText}>Cancelar Solicitud</Text>
                </Pressable>
              )}

              {isFinalized ? (
                <Pressable
                  style={styles.fullPrimaryBtn}
                  onPress={() => router.replace('/(tabs)')}
                >
                  <LinearGradient
                    colors={['#2563EB', '#4F46E5']}
                    style={styles.btnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.primaryBtnText}>Volver al Inicio</Text>
                  </LinearGradient>
                </Pressable>
              ) : (
                <Text style={styles.clientWaitingNotice}>
                  {request.status === 'ON_THE_WAY'
                    ? 'El técnico va en camino hacia tu dirección. Observa su desplazamiento en el mapa arriba.'
                    : 'Tu solicitud está siendo atendida en tiempo real.'}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Service Chat Modal */}
      <ServiceChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        counterpartName={role === 'CLIENT' ? request.provider.name : request.client.name}
        counterpartRole={role === 'CLIENT' ? 'Técnico Prestador' : 'Cliente'}
        counterpartAvatar={role === 'CLIENT' ? request.provider.avatar : request.client.avatar}
        currentRole={role}
        serviceTitle={request.service.title}
      />
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
  navChatBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  scrollContent: {
    paddingBottom: 40,
    gap: 12,
  },
  topStatusCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceTitleCol: {
    flex: 1,
    marginRight: 10,
  },
  serviceOrderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  orderIdText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  priceAndEtaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  feeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  feeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  feeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  distValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  userAvatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  userInfoCol: {
    flex: 1,
  },
  userRoleLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  userPhone: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  callBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 12,
  },
  chatIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatTextsCol: {
    flex: 1,
  },
  chatTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  chatCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  chatOnlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    gap: 3,
  },
  chatOnlineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  chatOnlineText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
  },
  chatCardPreview: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
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
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  mapSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  stepperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  roleHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 8,
  },
  roleHintText: {
    fontSize: 12,
    color: '#1D4ED8',
    flex: 1,
  },
  boldText: {
    fontWeight: '800',
  },
  quickSwitchBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  quickSwitchBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  actionPanelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  providerControls: {
    gap: 10,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 12,
    gap: 6,
  },
  dangerBtn: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  dangerBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  fullPrimaryBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnGradient: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
  },
  completedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  completedNoticeText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '700',
    flex: 1,
  },
  clientControls: {
    gap: 8,
  },
  cancelOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    height: 44,
    borderRadius: 12,
    gap: 6,
  },
  cancelOrderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
  },
  clientWaitingNotice: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
  },
});
