// app/_layout.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { db } from '@/db/client';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function RootNavigation() {
  const { user, loading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Guard de enrutamiento complementario para sincronizar el historial
  useEffect(() => {
    if (authLoading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'registro';

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, authLoading, segments]);

  if (authLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Verificando credenciales seguras en SecureStore...</Text>
      </View>
    );
  }

  const isAuthenticated = Boolean(user);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
        }}
      >
        {/* Sin sesión solo existen Login y Registro (Stack.Protected) */}
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="registro" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Con sesión solo existen Principal y Formulario (Stack.Protected) */}
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="producto"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack.Protected>
      </Stack>
    </>
  );
}

function DatabaseMigrator({ children }: { children: React.ReactNode }) {
  // Aplicación automática de migraciones de SQLite con Drizzle ORM
  const { success, error } = useMigrations(db!, migrations);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error al iniciar base de datos local</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Preparando base de datos SQLite y migraciones...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const content = (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );

  // En Android / iOS y Web con SharedArrayBuffer se ejecutan las migraciones Drizzle
  if (db) {
    return <DatabaseMigrator>{content}</DatabaseMigrator>;
  }

  // En navegadores web sin aislamiento se entra directamente sin pantalla de bloqueo
  return content;
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
