import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationTab } from '../../types';
import { useApp } from '../../context/AppContext';

interface BottomTabsProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  tasksBadgeCount?: number;
}

interface TabItem {
  key: NavigationTab;
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    activeIcon: 'grid',
    inactiveIcon: 'grid-outline',
  },
  {
    key: 'tasks',
    label: 'Tareas',
    activeIcon: 'checkbox',
    inactiveIcon: 'checkbox-outline',
  },
  {
    key: 'projects',
    label: 'Proyectos',
    activeIcon: 'folder',
    inactiveIcon: 'folder-outline',
  },
  {
    key: 'profile',
    label: 'Perfil',
    activeIcon: 'person',
    inactiveIcon: 'person-outline',
  },
];

export const BottomTabs: React.FC<BottomTabsProps> = ({
  activeTab,
  onTabChange,
  tasksBadgeCount = 0,
}) => {
  const { colors } = useApp();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            onPress={() => onTabChange(tab.key)}
            style={styles.tabButton}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.inactiveIcon}
                size={22}
                color={isActive ? colors.primary : colors.textMuted}
              />
              {tab.key === 'tasks' && tasksBadgeCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeText}>
                    {tasksBadgeCount > 99 ? '99+' : tasksBadgeCount}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? colors.primary : colors.textMuted,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 3,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 11,
  },
});
