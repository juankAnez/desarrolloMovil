import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, Radius, Shadows } from '@/constants/colors';
import { FleetKPIGauge } from '@/features/status/components/FleetKPIGauge';
import { ServiceAlertCard } from '@/features/status/components/ServiceAlertCard';
import { IncidentReportForm } from '@/features/status/components/IncidentReportForm';
import { MOCK_FLEET_KPI, MOCK_ALERTS, EMERGENCY_CONTACTS } from '@/features/status/statusData';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      {/* Top Modal Header */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Estado del Servicio 🚐</Text>
          <Text style={styles.subtitle}>Monitoreo en vivo de la red universitaria</Text>
        </View>

        <Pressable
          style={styles.closeBtn}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Ionicons name="close" size={22} color={AppColors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Navigation architectural note badge */}
        <View style={styles.modalNotice}>
          <Ionicons name="layers-outline" size={16} color={AppColors.warningDark} />
          <Text style={styles.modalNoticeText}>
            Esta pantalla fue lanzada mediante <Text style={styles.bold}>presentation: &apos;modal&apos;</Text> en Expo Router.
          </Text>
        </View>

        {/* Live Network Fleet Gauge */}
        <FleetKPIGauge kpi={MOCK_FLEET_KPI} />

        {/* Alerts and Notices Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Alertas y Comunicados Activos</Text>
          <Text style={styles.alertCountBadge}>{MOCK_ALERTS.length} vigentes</Text>
        </View>

        <View style={styles.alertsList}>
          {MOCK_ALERTS.map((alert) => (
            <ServiceAlertCard key={alert.id} alert={alert} />
          ))}
        </View>

        {/* Emergency / Support Contacts */}
        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>Líneas de Atención y Emergencia</Text>
          <View style={styles.contactsCard}>
            {EMERGENCY_CONTACTS.map((contact, index) => {
              const isLast = index === EMERGENCY_CONTACTS.length - 1;
              return (
                <View
                  key={contact.id}
                  style={[styles.contactItem, !isLast && styles.contactItemBorder]}
                >
                  <View style={styles.contactIconBox}>
                    <Ionicons
                      name={contact.icon as keyof typeof Ionicons.glyphMap}
                      size={18}
                      color={AppColors.primary}
                    />
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRole}>{contact.role}</Text>
                  </View>
                  <View style={styles.phoneTag}>
                    <Ionicons name="call" size={12} color={AppColors.accent} />
                    <Text style={styles.phoneText}>{contact.phone}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Interactive Student Report Form */}
        <IncidentReportForm />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.text,
  },
  subtitle: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  modalNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.warningLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.md,
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  modalNoticeText: {
    fontSize: 12,
    color: '#78350F',
    flex: 1,
  },
  bold: {
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  alertCountBadge: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  alertsList: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  contactsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  contactsCard: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: 14,
    marginTop: 8,
    ...Shadows.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  contactItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  contactIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.text,
  },
  contactRole: {
    fontSize: 11,
    color: AppColors.textSecondary,
    marginTop: 1,
  },
  phoneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AppColors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  phoneText: {
    fontSize: 11,
    color: AppColors.accent,
    fontWeight: '700',
  },
});
