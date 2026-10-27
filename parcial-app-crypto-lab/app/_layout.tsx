import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { ServiceProvider } from '../src/context/ServiceContext';
import { Colors } from '../src/constants/colors';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: Colors.surface,
            },
            headerTintColor: Colors.primary,
            headerTitleStyle: {
              fontWeight: '800',
              color: Colors.text,
              fontSize: 17,
            },
            headerShadowVisible: false,
          }}
        >
          {/* Pantalla de Inicio de Sesión */}
          <Stack.Screen name="login" options={{ headerShown: false }} />

          {/* Navegación por pestañas principales */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Vista 2: Detalle del Servicio */}
          <Stack.Screen
            name="service/[id]"
            options={{
              headerShown: true,
              title: 'Detalle del Servicio',
              headerBackTitle: 'Atrás',
            }}
          />

          {/* Vista 3: Seguimiento del Servicio en Vivo */}
          <Stack.Screen
            name="tracking/[id]"
            options={{
              headerShown: true,
              title: 'Seguimiento en Vivo',
              headerBackTitle: 'Atrás',
            }}
          />

          {/* Modal */}
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Información y Filtros',
            }}
          />

          {/* 404 */}
          <Stack.Screen
            name="+not-found"
            options={{
              headerShown: true,
              title: 'Página no encontrada',
            }}
          />
        </Stack>
      </ServiceProvider>
    </AuthProvider>
  );
}
