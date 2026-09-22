import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { useServices } from '../../src/context/ServiceContext';

export default function TabsLayout() {
  const { role } = useAuth();
  const { requests } = useServices();
  const insets = useSafeAreaInsets();

  const activeCount = requests.filter(
    (r) => r.status !== 'COMPLETED' && r.status !== 'CANCELLED'
  ).length;

  // Calculamos el espacio inferior seguro para que la barra de navegación del sistema no tape el texto
  const safeBottom = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 10);
  const tabHeight = 60 + safeBottom;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: safeBottom,
          paddingTop: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 8,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
          paddingBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: role === 'CLIENT' ? 'Explorar' : 'Actividad',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                role === 'CLIENT'
                  ? focused
                    ? 'search'
                    : 'search-outline'
                  : focused
                  ? 'flash'
                  : 'flash-outline'
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="requests"
        options={{
          title: role === 'CLIENT' ? 'Mis Pedidos' : 'Solicitudes',
          tabBarBadge: activeCount > 0 ? activeCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#2563EB',
            fontSize: 10,
            fontWeight: '900',
            color: '#FFFFFF',
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                role === 'CLIENT'
                  ? focused
                    ? 'receipt'
                    : 'receipt-outline'
                  : focused
                  ? 'briefcase'
                  : 'briefcase-outline'
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
