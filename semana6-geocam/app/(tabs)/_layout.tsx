// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGeoPhotos } from '@/context/GeoPhotosContext';
import { useShake } from '@/hooks/useShake';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { photos, clearAll } = useGeoPhotos();

  // R4: Integración del Custom Hook useShake
  useShake(() => {
    if (photos.length === 0) {
      Alert.alert(
        'Sensor de Movimiento (Acelerómetro)',
        '¡Agitaste el teléfono! No tienes fotos para eliminar en este momento.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    Alert.alert(
      '¿Eliminar todas las fotos?',
      `Detectamos un movimiento brusco (agitado). ¿Deseas borrar las ${photos.length} fotos registradas en GeoCam?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, borrar todo',
          style: 'destructive',
          onPress: () => clearAll(),
        },
      ]
    );
  });

  const safeBottom = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#71717A',
        tabBarStyle: {
          backgroundColor: '#09090B',
          borderTopColor: '#27272A',
          borderTopWidth: 1,
          height: 60 + safeBottom,
          paddingBottom: safeBottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="geocam"
        options={{
          title: 'GeoCam',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'camera' : 'camera-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarBadge: photos.length > 0 ? photos.length : undefined,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
