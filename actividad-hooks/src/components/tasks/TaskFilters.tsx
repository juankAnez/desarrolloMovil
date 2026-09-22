import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  projectFilter: string;
  onProjectChange: (project: string) => void;
  onResetFilters: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  projectFilter,
  onProjectChange,
  onResetFilters,
}) => {
  const { colors, projects, searchFocusTrigger } = useApp();

  // 5. [useRef] Referencia al TextInput para enfocar programáticamente
  const searchInputRef = useRef<TextInput>(null);

  // 2. [useEffect] Cuando cambia searchFocusTrigger, enfocar el TextInput
  useEffect(() => {
    if (searchFocusTrigger > 0) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [searchFocusTrigger]);

  const STATUSES = [
    { key: 'ALL', label: 'Todos' },
    { key: 'TODO', label: 'Pendientes' },
    { key: 'IN_PROGRESS', label: 'En progreso' },
    { key: 'COMPLETED', label: 'Completadas' },
  ];

  const PRIORITIES = [
    { key: 'ALL', label: 'Cualquier prioridad' },
    { key: 'HIGH', label: 'Alta' },
    { key: 'MEDIUM', label: 'Media' },
    { key: 'LOW', label: 'Baja' },
  ];

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    projectFilter !== 'ALL';

  return (
    <View style={styles.container}>
      {/* Campo de búsqueda con useRef */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          ref={searchInputRef}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Buscar por título, proyecto o persona..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.text }]}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros por Estado (Pills horizontales) */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterSectionLabel, { color: colors.textSecondary }]}>
          Estado:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}
        >
          {STATUSES.map((item) => {
            const isSelected = statusFilter === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.7}
                onPress={() => onStatusChange(item.key)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filtros por Prioridad */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterSectionLabel, { color: colors.textSecondary }]}>
          Prioridad:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}
        >
          {PRIORITIES.map((item) => {
            const isSelected = priorityFilter === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.7}
                onPress={() => onPriorityChange(item.key)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filtro por Proyecto */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterSectionLabel, { color: colors.textSecondary }]}>
          Proyecto:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onProjectChange('ALL')}
            style={[
              styles.pill,
              {
                backgroundColor: projectFilter === 'ALL' ? colors.primary : colors.card,
                borderColor: projectFilter === 'ALL' ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                {
                  color: projectFilter === 'ALL' ? '#FFFFFF' : colors.textSecondary,
                  fontWeight: projectFilter === 'ALL' ? '700' : '500',
                },
              ]}
            >
              Todos los proyectos
            </Text>
          </TouchableOpacity>

          {projects.map((proj) => {
            const isSelected = projectFilter === proj.name;
            return (
              <TouchableOpacity
                key={proj.id}
                activeOpacity={0.7}
                onPress={() => onProjectChange(proj.name)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {proj.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Botón limpiar filtros si hay alguno activo */}
      {hasActiveFilters && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onResetFilters}
          style={styles.resetRow}
        >
          <Ionicons name="filter-outline" size={14} color="#EF4444" />
          <Text style={styles.resetText}>Limpiar todos los filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 2,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    width: 68,
  },
  pillsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 11,
  },
  resetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  resetText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
});
