import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskStatus } from '../types';
import { useApp } from '../context/AppContext';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskCard } from '../components/tasks/TaskCard';
import { EmptyState } from '../components/common/EmptyState';

interface TasksPageProps {
  tasks: Task[];
  filteredTasks: Task[];
  searchQuery: string;
  onSearchChange: (text: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  projectFilter: string;
  onProjectChange: (project: string) => void;
  onResetFilters: () => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (task: Task) => void;
  onOpenDeleteModal: (task: Task) => void;
  onTaskStatusChange: (id: string, newStatus: TaskStatus) => void;
  onTogglePin: (id: string) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  filteredTasks,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  projectFilter,
  onProjectChange,
  onResetFilters,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onTaskStatusChange,
  onTogglePin,
}) => {
  const { colors, theme } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Título de la vista */}
            <View style={styles.headerRow}>
              <View>
                <Text style={[styles.pageTitle, { color: colors.text }]}>
                  Gestor de Tareas
                </Text>
                <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
                  Mostrando {filteredTasks.length} tareas sincronizadas
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onOpenCreateModal}
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addBtnText}>Nueva</Text>
              </TouchableOpacity>
            </View>

            {/* Banner de Hooks en Tareas */}
            <View
              style={[
                styles.hookNotice,
                {
                  backgroundColor: theme === 'dark' ? '#1E1B4B' : '#EEF2FF',
                  borderColor: theme === 'dark' ? '#3730A3' : '#C7D2FE',
                },
              ]}
            >
              <Ionicons name="hardware-chip-outline" size={14} color="#6366F1" />
              <Text
                style={[
                  styles.hookNoticeText,
                  { color: theme === 'dark' ? '#C7D2FE' : '#4338CA' },
                ]}
              >
                <Text style={{ fontWeight: '700' }}>Filtros con useMemo</Text> +{' '}
                <Text style={{ fontWeight: '700' }}>useCallback + React.memo</Text> para tarjetas.
              </Text>
            </View>

            {/* Filtros de búsqueda, estado, prioridad y proyecto (incluye useRef) */}
            <TaskFilters
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              statusFilter={statusFilter}
              onStatusChange={onStatusChange}
              priorityFilter={priorityFilter}
              onPriorityChange={onPriorityChange}
              projectFilter={projectFilter}
              onProjectChange={onProjectChange}
              onResetFilters={onResetFilters}
            />
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onStatusChange={onTaskStatusChange}
            onTogglePin={onTogglePin}
            onEdit={onOpenEditModal}
            onDelete={onOpenDeleteModal}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No se encontraron tareas"
            description="Intenta cambiar los filtros seleccionados o crea una nueva tarea para este proyecto."
            actionLabel="Crear tarea ahora"
            onAction={onOpenCreateModal}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 12,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  hookNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  hookNoticeText: {
    fontSize: 11,
    flex: 1,
  },
});
