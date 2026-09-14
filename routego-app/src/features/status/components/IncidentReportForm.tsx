import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, Radius, Shadows } from '@/constants/colors';
import { CustomButton } from '@/components/CustomButton';

export function IncidentReportForm() {
  const [selectedType, setSelectedType] = useState('Demora / Retraso');
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const incidentTypes = [
    'Demora / Retraso',
    'Unidad con sobrecupo',
    'Falla en validador',
    'A/C no funciona',
    'Objeto extraviado',
  ];

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setComments('');
    }, 4000);
  };

  if (isSubmitted) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-done-circle" size={44} color={AppColors.success} />
        <Text style={styles.successTitle}>¡Reporte Recibido!</Text>
        <Text style={styles.successText}>
          Tu novedad ha sido transmitida al Centro de Control de RouteGo. Gracias por ayudarnos a mejorar el servicio universitario.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="megaphone-outline" size={18} color={AppColors.primary} />
        <Text style={styles.title}>Reportar Incidencia en Ruta</Text>
      </View>

      <Text style={styles.label}>Tipo de novedad:</Text>
      <View style={styles.chipsRow}>
        {incidentTypes.map((type) => {
          const isSelected = selectedType === type;
          return (
            <Pressable
              key={type}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {type}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Detalle o parada (opcional):</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Bus RG-402 con retraso en Biblioteca..."
        placeholderTextColor={AppColors.textMuted}
        value={comments}
        onChangeText={setComments}
        multiline
        numberOfLines={3}
      />

      <CustomButton
        title="Enviar Reporte a Monitoreo"
        onPress={handleSubmit}
        variant="primary"
        icon={<Ionicons name="send" size={16} color="#FFFFFF" />}
        style={styles.submitBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    ...Shadows.sm,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textSecondary,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: AppColors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  chipSelected: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: AppColors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: 10,
    fontSize: 13,
    color: AppColors.text,
    borderWidth: 1,
    borderColor: AppColors.border,
    minHeight: 64,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  submitBtn: {
    width: '100%',
  },
  successContainer: {
    backgroundColor: AppColors.successLight,
    borderRadius: Radius.lg,
    padding: 20,
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.successDark,
    marginTop: 8,
    marginBottom: 4,
  },
  successText: {
    fontSize: 13,
    color: '#065F46',
    textAlign: 'center',
    lineHeight: 18,
  },
});
