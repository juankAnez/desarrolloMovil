import React from 'react';
import { ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceCategory } from '../../types/service';

interface CategoryPillsProps {
  selectedCategory: ServiceCategory;
  onSelectCategory: (category: ServiceCategory) => void;
}

export function CategoryPills({ selectedCategory, onSelectCategory }: CategoryPillsProps) {
  const categories: {
    id: ServiceCategory;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    activeIconColor: string;
    inactiveIconColor: string;
  }[] = [
    {
      id: 'Todos',
      label: 'Todos',
      icon: 'grid-outline',
      activeIconColor: '#FFFFFF',
      inactiveIconColor: '#2563EB',
    },
    {
      id: 'Tecnología',
      label: 'Tecnología',
      icon: 'laptop-outline',
      activeIconColor: '#FFFFFF',
      inactiveIconColor: '#2563EB',
    },
    {
      id: 'Hogar',
      label: 'Hogar',
      icon: 'home-outline',
      activeIconColor: '#FFFFFF',
      inactiveIconColor: '#059669',
    },
    {
      id: 'Electricidad',
      label: 'Electricidad',
      icon: 'flash-outline',
      activeIconColor: '#FFFFFF',
      inactiveIconColor: '#D97706',
    },
    {
      id: 'Plomería',
      label: 'Plomería',
      icon: 'water-outline',
      activeIconColor: '#FFFFFF',
      inactiveIconColor: '#0891B2',
    },
    {
      id: 'Educación',
      label: 'Educación',
      icon: 'school-outline',
      activeIconColor: '#FFFFFF',
      inactiveIconColor: '#86198F',
    },
    {
      id: 'Diseño',
      label: 'Diseño',
      icon: 'color-palette-outline',
      activeIconColor: '#FFFFFF',
      inactiveIconColor: '#BE185D',
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((item) => {
        const isSelected = selectedCategory === item.id;
        return (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.pill,
              isSelected ? styles.pillSelected : styles.pillUnselected,
              pressed && styles.pillPressed,
            ]}
            onPress={() => onSelectCategory(item.id)}
          >
            <Ionicons
              name={item.icon}
              size={14}
              color={isSelected ? item.activeIconColor : item.inactiveIconColor}
            />
            <Text
              style={[
                styles.pillText,
                isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  pillSelected: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  pillUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  pillTextUnselected: {
    color: '#334155',
  },
});
