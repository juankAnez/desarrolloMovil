// app/_layout.tsx
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { db } from '@/db/client';
import { seedAlbums } from '@/db/seed';

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (success) {
      seedAlbums()
        .catch((err) => console.warn('Error sembrando álbumes iniciales:', err))
        .finally(() => setSeeded(true));
    }
  }, [success]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error al preparar la base de datos local</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  // Ninguna pantalla se monta antes de que la base esté migrada
  if (!success || !seeded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Iniciando base de datos SQLite y GeoCam...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="foto/[id]"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Detalle de Fotografía',
            headerTintColor: '#10B981',
            headerStyle: { backgroundColor: '#18181B' },
            headerTitleStyle: { color: '#FFFFFF', fontWeight: 'bold' },
          }}
        />
        <Stack.Screen name="+not-found" options={{ title: 'No encontrado' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#09090B',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#A1A1AA',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09090B',
    gap: 12,
  },
  loadingText: {
    color: '#E4E4E7',
    fontSize: 14,
    fontWeight: '500',
  },
});
