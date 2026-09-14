import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppColors, Radius } from '@/constants/colors';

interface StudentSwitcherProps {
  currentId: string;
}

export function StudentSwitcher({ currentId }: StudentSwitcherProps) {
  const router = useRouter();
  const [customId, setCustomId] = useState('');
  const [showInput, setShowInput] = useState(false);

  const predefinedStudents = [
    { id: 'ST-202688', label: 'Juan Pérez (Sistemas)' },
    { id: 'ST-202412', label: 'María Castro (Medicina)' },
    { id: 'ST-202570', label: 'Daniel Morales (Diseño)' },
  ];

  const handleSelect = (id: string) => {
    if (id !== currentId) {
      router.push(`/student/${id}`);
    }
  };

  const handleCustomSubmit = () => {
    if (customId.trim()) {
      router.push(`/student/${customId.trim().toUpperCase()}`);
      setCustomId('');
      setShowInput(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.labelRow}>
          <Ionicons name="swap-horizontal" size={16} color={AppColors.primary} />
          <Text style={styles.headerTitle}>Probar Otro Estudiante (Ruta Dinámica)</Text>
        </View>
        <Pressable onPress={() => setShowInput(!showInput)} hitSlop={6}>
          <Text style={styles.customToggleText}>
            {showInput ? 'Cancelar' : '+ ID Manual'}
          </Text>
        </Pressable>
      </View>

      {/* Preset pills */}
      <View style={styles.pillsRow}>
        {predefinedStudents.map((item) => {
          const isSelected = item.id === currentId;
          return (
            <Pressable
              key={item.id}
              style={[styles.pill, isSelected && styles.pillSelected]}
              onPress={() => handleSelect(item.id)}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                {item.id}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Optional custom ID input */}
      {showInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ej: ST-202999"
            placeholderTextColor={AppColors.textMuted}
            value={customId}
            onChangeText={setCustomId}
            autoCapitalize="characters"
          />
          <Pressable style={styles.goBtn} onPress={handleCustomSubmit}>
            <Text style={styles.goBtnText}>Cargar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    padding: 14,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  customToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.accent,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: AppColors.surfaceSubtle,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  pillSelected: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 38,
    backgroundColor: AppColors.surfaceSubtle,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    fontSize: 13,
    color: AppColors.text,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  goBtn: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  goBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
