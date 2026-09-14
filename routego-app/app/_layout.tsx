import { Stack } from 'expo-router';
import { AppColors } from '@/constants/colors';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: AppColors.primary,
        headerTitleStyle: {
          fontWeight: '800',
          color: AppColors.text,
          fontSize: 17,
        },
        headerShadowVisible: false,
      }}
    >
      {/* 1. Grupo de Pestañas Inferiores */}
      <Stack.Screen name="(tabs)" />

      {/* 2. Ruta Dinámica con cabecera nativa activa */}
      <Stack.Screen
        name="student/[id]"
        options={{
          headerShown: true,
          title: 'Carnet Digital de Transporte',
          headerBackTitle: 'Atrás',
        }}
      />

      {/* 3. Pantalla lanzada como Ventana Modal */}
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Centro de Estado y Alertas',
        }}
      />
    </Stack>
  );
}
