import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors, Shadows } from '@/constants/colors';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 10);
  const tabHeight = 58 + safeBottom;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: AppColors.textMuted,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: AppColors.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: safeBottom,
          paddingTop: 8,
          ...Shadows.md,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
          paddingBottom: 2,
        },
      }}
    >
      {/* Pestaña 1: Inicio */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* Pestaña 2: Rutas de Shuttles */}
      <Tabs.Screen
        name="routes"
        options={{
          title: 'Rutas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'bus' : 'bus-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
