// components/PermissionPrimer.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { PermissionState } from '@/types/geo';

interface Props {
  title: string;
  description: string;
  state: PermissionState;
  onRequest: () => void;
  onOpenSettings: () => void;
}

export function PermissionPrimer({
  title,
  description,
  state,
  onRequest,
  onOpenSettings,
}: Props) {
  const isBlocked = state === 'blocked';

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons
          name={isBlocked ? 'alert-circle-outline' : 'camera-outline'}
          size={48}
          color={isBlocked ? '#EF4444' : '#10B981'}
        />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>
        {isBlocked
          ? 'Desactivaste este permiso de forma permanente. Puedes habilitarlo manualmente desde los Ajustes del sistema.'
          : description}
      </Text>

      <Pressable
        onPress={isBlocked ? onOpenSettings : onRequest}
        style={({ pressed }) => [
          styles.button,
          isBlocked ? styles.buttonBlocked : styles.buttonPrimary,
          pressed && styles.buttonPressed,
        ]}
        accessibilityRole="button"
      >
        <Ionicons
          name={isBlocked ? 'settings-outline' : 'shield-checkmark-outline'}
          size={18}
          color="#0A0A0A"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.buttonText}>
          {isBlocked ? 'Abrir Ajustes' : 'Permitir acceso'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  description: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    color: '#D4D4D8',
    maxWidth: 320,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 12,
  },
  buttonPrimary: {
    backgroundColor: '#10B981',
  },
  buttonBlocked: {
    backgroundColor: '#F59E0B',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#09090B',
  },
});
