import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RequestStatus } from '../../types/request';
import { Colors } from '../../constants/colors';

interface StatusStepperProps {
  currentStatus: RequestStatus;
}

interface StepItem {
  key: RequestStatus;
  label: string;
  sublabel: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export function StatusStepper({ currentStatus }: StatusStepperProps) {
  const steps: StepItem[] = [
    { key: 'PENDING', label: 'Solicitado', sublabel: 'Esperando respuesta', icon: 'document-text-outline' },
    { key: 'ACCEPTED', label: 'Aceptado', sublabel: 'Prestador asignado', icon: 'checkmark-circle-outline' },
    { key: 'ON_THE_WAY', label: 'En Camino', sublabel: 'Desplazamiento a tu ubicación', icon: 'navigate-outline' },
    { key: 'IN_PROGRESS', label: 'En Servicio', sublabel: 'Trabajo en ejecución', icon: 'construct-outline' },
    { key: 'COMPLETED', label: 'Completado', sublabel: 'Servicio finalizado con éxito', icon: 'ribbon-outline' },
  ];

  const statusOrder: RequestStatus[] = ['PENDING', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  if (currentStatus === 'CANCELLED') {
    return (
      <View style={styles.cancelledBox}>
        <Ionicons name="close-circle" size={28} color={Colors.danger} />
        <View style={styles.cancelledTextCol}>
          <Text style={styles.cancelledTitle}>Servicio Cancelado</Text>
          <Text style={styles.cancelledSub}>La solicitud no pudo completarse.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isPassed = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <View key={step.key} style={styles.stepRow}>
            {/* Indicator column with icon circle and vertical connector line */}
            <View style={styles.indicatorCol}>
              <View
                style={[
                  styles.circle,
                  isPassed && styles.circlePassed,
                  isCurrent && styles.circleCurrent,
                ]}
              >
                <Ionicons
                  name={isPassed ? 'checkmark' : step.icon}
                  size={15}
                  color={isPassed || isCurrent ? '#FFFFFF' : Colors.textMuted}
                />
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    isPassed && styles.connectorPassed,
                  ]}
                />
              )}
            </View>

            {/* Content text */}
            <View style={[styles.contentCol, !isLast && styles.contentColBorder]}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.stepLabel,
                    isCurrent && styles.stepLabelCurrent,
                    isPassed && styles.stepLabelPassed,
                  ]}
                >
                  {step.label}
                </Text>
                {isCurrent && (
                  <View style={styles.activePill}>
                    <View style={styles.activePulse} />
                    <Text style={styles.activePillText}>Activo</Text>
                  </View>
                )}
              </View>
              <Text style={styles.stepSublabel}>{step.sublabel}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 48,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 32,
    marginRight: 12,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlePassed: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  circleCurrent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  connectorPassed: {
    backgroundColor: Colors.accent,
  },
  contentCol: {
    flex: 1,
    paddingBottom: 16,
  },
  contentColBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stepLabelCurrent: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  stepLabelPassed: {
    fontWeight: '700',
    color: Colors.text,
  },
  stepSublabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  activePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  cancelledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerLight,
    padding: 14,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelledTextCol: {
    flex: 1,
  },
  cancelledTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.danger,
  },
  cancelledSub: {
    fontSize: 12,
    color: '#7F1D1D',
  },
});
