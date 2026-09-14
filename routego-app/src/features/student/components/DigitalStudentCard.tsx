import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StudentProfile } from '../types';
import { AppColors, Radius, Shadows } from '@/constants/colors';

interface DigitalStudentCardProps {
  student: StudentProfile;
  onScanSuccess?: () => void;
}

export function DigitalStudentCard({ student, onScanSuccess }: DigitalStudentCardProps) {
  const [isValidated, setIsValidated] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleValidatePass = () => {
    setIsValidated(true);
    onScanSuccess?.();
    setTimeout(() => {
      setIsValidated(false);
    }, 4000);
  };

  return (
    <View style={styles.cardWrapper}>
      {/* Physical-style Smart Transit Card */}
      <View style={styles.cardContainer}>
        {/* Top Header Row */}
        <View style={styles.cardHeader}>
          <View style={styles.brandRow}>
            <Ionicons name="bus" size={20} color="#60A5FA" />
            <Text style={styles.brandTitle}>RouteGo</Text>
            <View style={styles.brandDivider} />
            <Text style={styles.brandSubtitle}>Pase Universitario</Text>
          </View>
          <MaterialCommunityIcons name="contactless-payment" size={26} color="#93C5FD" />
        </View>

        {/* Smartcard Chip Simulation */}
        <View style={styles.chipRow}>
          <View style={styles.chipGraphic}>
            <View style={styles.chipInnerLineH} />
            <View style={styles.chipInnerLineV} />
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusPillText}>{student.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Student Identification Details */}
        <View style={styles.studentInfoRow}>
          <View style={[styles.avatarCircle, { backgroundColor: student.avatarColor }]}>
            <Text style={styles.avatarInitials}>{student.avatarInitials}</Text>
          </View>

          <View style={styles.studentDetailsCol}>
            <Text style={styles.studentName} numberOfLines={1}>
              {student.fullName}
            </Text>
            <Text style={styles.studentIdCode}>ID: {student.id}</Text>
            <Text style={styles.studentCareer} numberOfLines={1}>
              {student.career}
            </Text>
            <Text style={styles.studentFaculty} numberOfLines={1}>
              {student.faculty}
            </Text>
          </View>
        </View>

        {/* Card Footer with Validity & Semester */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.footerLabel}>SEMESTRE</Text>
            <Text style={styles.footerValue}>{student.semester}</Text>
          </View>
          <View>
            <Text style={styles.footerLabel}>VÁLIDO HASTA</Text>
            <Text style={styles.footerValue}>{student.validUntil}</Text>
          </View>
          <View style={styles.balanceContainer}>
            <Text style={styles.footerLabel}>VIAJES MES</Text>
            <Text style={styles.tripsValue}>{student.monthlyTripsTaken}</Text>
          </View>
        </View>
      </View>

      {/* Interactive Boarding Pass QR / NFC Bar */}
      <View style={styles.validationSection}>
        {isValidated ? (
          <View style={styles.validationSuccessBox}>
            <Ionicons name="checkmark-circle" size={32} color={AppColors.success} />
            <View style={styles.validationSuccessTextCol}>
              <Text style={styles.validationSuccessTitle}>¡Abordaje Autorizado!</Text>
              <Text style={styles.validationSuccessSub}>
                Pase validado para unidades RouteGo. ¡Buen viaje!
              </Text>
            </View>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.validateBtn,
              pressed && styles.validateBtnPressed,
            ]}
            onPress={handleValidatePass}
          >
            <Ionicons name="qr-code-outline" size={22} color="#FFFFFF" />
            <View style={styles.validateBtnTextCol}>
              <Text style={styles.validateBtnTitle}>Aproximar al Validador del Shuttle</Text>
              <Text style={styles.validateBtnSub}>Toca aquí para simular escaneo NFC / QR</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#93C5FD" />
          </Pressable>
        )}

        {/* QR Code Collapsible View */}
        <Pressable
          style={styles.qrToggleBtn}
          onPress={() => setShowQR(!showQR)}
        >
          <Text style={styles.qrToggleText}>
            {showQR ? 'Ocultar Código QR Digital' : 'Mostrar Código QR para escáner óptico'}
          </Text>
          <Ionicons
            name={showQR ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={AppColors.accent}
          />
        </Pressable>

        {showQR && (
          <View style={styles.qrDisplayBox}>
            <View style={styles.simulatedQRContainer}>
              {/* Simulated visual QR code block */}
              <View style={styles.qrCornerTopLeft} />
              <View style={styles.qrCornerTopRight} />
              <View style={styles.qrCornerBottomLeft} />
              <View style={styles.qrCenterGraphic}>
                <Ionicons name="bus" size={32} color={AppColors.primary} />
                <Text style={styles.qrCodeIdText}>{student.id}</Text>
              </View>
            </View>
            <Text style={styles.qrHelperText}>
              Presenta esta pantalla frente a la cámara lectora en la puerta del autobús.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  cardContainer: {
    backgroundColor: '#000666',
    borderRadius: Radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E3A8A',
    ...Shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  brandSubtitle: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chipGraphic: {
    width: 36,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
    position: 'relative',
    overflow: 'hidden',
  },
  chipInnerLineH: {
    position: 'absolute',
    top: '48%',
    width: '100%',
    height: 1,
    backgroundColor: '#B45309',
  },
  chipInnerLineV: {
    position: 'absolute',
    left: '48%',
    height: '100%',
    width: 1,
    backgroundColor: '#B45309',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.success,
  },
  statusPillText: {
    color: '#6EE7B7',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  studentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#93C5FD',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  studentDetailsCol: {
    flex: 1,
  },
  studentName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
  },
  studentIdCode: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  studentCareer: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '500',
  },
  studentFaculty: {
    color: '#94A3B8',
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  footerLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  footerValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  tripsValue: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '800',
  },
  validationSection: {
    marginTop: 14,
  },
  validateBtn: {
    backgroundColor: '#0F172A',
    borderRadius: Radius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
    ...Shadows.sm,
  },
  validateBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  validateBtnTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  validateBtnTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  validateBtnSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  validationSuccessBox: {
    backgroundColor: AppColors.successLight,
    borderRadius: Radius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 12,
  },
  validationSuccessTextCol: {
    flex: 1,
  },
  validationSuccessTitle: {
    color: AppColors.successDark,
    fontSize: 14,
    fontWeight: '800',
  },
  validationSuccessSub: {
    color: '#065F46',
    fontSize: 12,
    marginTop: 2,
  },
  qrToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  qrToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.accent,
  },
  qrDisplayBox: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
    ...Shadows.sm,
  },
  simulatedQRContainer: {
    width: 170,
    height: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: AppColors.borderDark,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  qrCornerTopLeft: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderWidth: 5,
    borderColor: AppColors.primary,
    borderRadius: 4,
  },
  qrCornerTopRight: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderWidth: 5,
    borderColor: AppColors.primary,
    borderRadius: 4,
  },
  qrCornerBottomLeft: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 32,
    height: 32,
    borderWidth: 5,
    borderColor: AppColors.primary,
    borderRadius: 4,
  },
  qrCenterGraphic: {
    alignItems: 'center',
  },
  qrCodeIdText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.primary,
    marginTop: 4,
  },
  qrHelperText: {
    fontSize: 11,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
});
