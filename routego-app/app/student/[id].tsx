import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, Radius } from '@/constants/colors';
import { getStudentById, MOCK_TRIPS } from '@/features/student/studentData';
import { DigitalStudentCard } from '@/features/student/components/DigitalStudentCard';
import { StudentSwitcher } from '@/features/student/components/StudentSwitcher';
import { TripHistoryList } from '@/features/student/components/TripHistoryList';
import { StatCard } from '@/components/ui/StatCard';

export default function StudentDetailScreen() {
  // Captura el parámetro [id] dinámico desde la URL de Expo Router
  const { id } = useLocalSearchParams<{ id: string }>();
  const studentId = (Array.isArray(id) ? id[0] : id) || 'ST-202688';
  const student = getStudentById(studentId);

  const [tripsCount, setTripsCount] = useState(student.monthlyTripsTaken);

  const handleScanSuccess = () => {
    setTripsCount((prev) => prev + 1);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dynamic Route Parameter Explanation Badge */}
        <View style={styles.paramNoticeBanner}>
          <Ionicons name="git-network-outline" size={16} color={AppColors.accent} />
          <View style={styles.paramNoticeTextCol}>
            <Text style={styles.paramNoticeTitle}>
              Parámetro Dinámico Detectado: <Text style={styles.paramBold}>[id] = &quot;{studentId}&quot;</Text>
            </Text>
            <Text style={styles.paramNoticeSub}>
              Ruta activa: /student/{studentId} (manejada por app/student/[id].tsx)
            </Text>
          </View>
        </View>

        {/* Digital Student Transit Pass */}
        <DigitalStudentCard
          student={{ ...student, monthlyTripsTaken: tripsCount }}
          onScanSuccess={handleScanSuccess}
        />

        {/* Dynamic Switcher for testing other Student IDs */}
        <StudentSwitcher currentId={studentId} />

        {/* Student Travel Metrics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Balance y Estadísticas del Estudiante</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="Viajes en el Mes"
              value={tripsCount}
              subtext="Pase ilimitado activo"
              icon={<Ionicons name="bus" size={16} color={AppColors.primary} />}
              style={styles.statCardHalf}
            />

            <StatCard
              label="Saldo Monedero"
              value={student.walletBalance}
              subtext="Tarifa preferencial"
              icon={<Ionicons name="wallet" size={16} color={AppColors.success} />}
              iconBgColor={AppColors.successLight}
              style={styles.statCardHalf}
            />

            <StatCard
              label="Ruta Habitual"
              value={student.favoriteRoute}
              subtext="Llegada más frecuente"
              icon={<Ionicons name="navigate" size={16} color={AppColors.accent} />}
              iconBgColor={AppColors.accentLight}
              style={styles.statCardHalf}
            />

            <StatCard
              label="Vigencia Matrícula"
              value={student.validUntil}
              subtext="Estado al día"
              icon={<Ionicons name="shield-checkmark" size={16} color={AppColors.purple} />}
              iconBgColor={AppColors.purpleLight}
              style={styles.statCardHalf}
            />
          </View>
        </View>

        {/* Recent Trips Log */}
        <TripHistoryList trips={MOCK_TRIPS} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 36,
  },
  paramNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.accentLight,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: AppColors.accentBorder,
    gap: 10,
  },
  paramNoticeTextCol: {
    flex: 1,
  },
  paramNoticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primary,
  },
  paramBold: {
    fontWeight: '900',
    color: AppColors.accent,
  },
  paramNoticeSub: {
    fontSize: 11,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  statsSection: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCardHalf: {
    width: '48.5%',
  },
});
