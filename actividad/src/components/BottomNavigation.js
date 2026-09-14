// BottomNavigation PRO - Floating pill + indicador animado
import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: 'home-variant-outline', activeIcon: 'home-variant' },
    { id: 'create', label: 'Crear', icon: 'plus-circle-outline', activeIcon: 'plus-circle' },
    { id: 'progress', label: 'Progreso', icon: 'chart-bar', activeIcon: 'chart-bar' },
  ];

  return (
    <View
      style={{
        backgroundColor: colors.backgroundLight,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        paddingTop: spacing.sm,
        paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
        paddingHorizontal: spacing.md,
        ...shadows.lg,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: borderRadius.full,
                  backgroundColor: isActive ? colors.primary : 'transparent',
                  minWidth: 80,
                  ... (isActive ? shadows.glow : {}),
                  borderWidth: isActive ? 0 : 1,
                  borderColor: 'transparent',
                }}
              >
                <MaterialCommunityIcons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={22}
                  color={isActive ? colors.textWhite : colors.textTertiary}
                />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? colors.textWhite : colors.textSecondary,
                    marginTop: 3,
                    letterSpacing: 0.2,
                  }}
                >
                  {tab.label}
                </Text>
              </View>

              {/* Dot indicador para inactivo sutil */}
              {!isActive && (
                <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: 'transparent', marginTop: 4 }} />
              )}
              {isActive && (
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary, marginTop: 6, opacity: 0 }} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavigation;
