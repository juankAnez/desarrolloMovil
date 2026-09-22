import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/Badge';

interface RecentTasksProps {
  tasks: Task[];
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onViewAll: () => void;
}

export const RecentTasks: React.FC<RecentTasksProps> = ({
  tasks,
  onStatusChange,
  onViewAll,
}) => {
  const { colors } = useApp();
  const recent = tasks.slice(0, 5);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="time-outline" size={18} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Tareas Recientes
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={onViewAll}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            Ver todas →
          </Text>
        </TouchableOpacity>
      </View>

      {recent.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          No hay tareas registradas aún.
        </Text>
      ) : (
        <View style={styles.list}>
          {recent.map((task, index) => {
            const isCompleted = task.status === 'COMPLETED';

            return (
              <View
                key={task.id}
                style={[
                  styles.taskItem,
                  index < recent.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                {/* Botón rápido completar */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    onStatusChange(
                      task.id,
                      isCompleted ? 'TODO' : 'COMPLETED'
                    )
                  }
                  style={[
                    styles.checkButton,
                    {
                      borderColor: isCompleted ? colors.success : colors.borderStrong,
                      backgroundColor: isCompleted ? colors.success : 'transparent',
                    },
                  ]}
                >
                  {isCompleted && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </TouchableOpacity>

                {/* Info tarea */}
                <View style={styles.taskInfo}>
                  <Text
                    style={[
                      styles.taskTitle,
                      {
                        color: isCompleted ? colors.textMuted : colors.text,
                        textDecorationLine: isCompleted ? 'line-through' : 'none',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {task.title}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text
                      style={[styles.projectName, { color: colors.textSecondary }]}
                    >
                      {task.project}
                    </Text>
                    <PriorityBadge priority={task.priority} />
                  </View>
                </View>

                {/* Badge Estado */}
                <StatusBadge status={task.status} />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
  list: {
    gap: 2,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  checkButton: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  projectName: {
    fontSize: 11,
  },
});
