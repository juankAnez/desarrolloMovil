import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/Badge';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onTogglePin: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// 6. [useCallback + React.memo]
// Al envolver el componente en React.memo, este solo se re-renderiza
// si sus props cambian. Los handlers provienen de useCallback en useTasks.
const TaskCardComponent: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onTogglePin,
  onEdit,
  onDelete,
}) => {
  const { colors } = useApp();

  const getNextStatus = (current: TaskStatus): TaskStatus => {
    if (current === 'TODO') return 'IN_PROGRESS';
    if (current === 'IN_PROGRESS') return 'COMPLETED';
    return 'TODO';
  };

  const isCompleted = task.status === 'COMPLETED';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: task.isPinned ? colors.primary : colors.border,
          borderWidth: task.isPinned ? 1.5 : 1,
        },
      ]}
    >
      {/* Barra superior: Proyecto, Pinned y Badges */}
      <View style={styles.topRow}>
        <View style={styles.projectInfo}>
          <Text
            style={[styles.projectName, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {task.project}
          </Text>
          <Text style={[styles.taskId, { color: colors.textMuted }]}>
            #{task.id}
          </Text>
        </View>

        <View style={styles.badgesRow}>
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </View>
      </View>

      {/* Título y descripción */}
      <View style={styles.body}>
        <Text
          style={[
            styles.title,
            {
              color: isCompleted ? colors.textMuted : colors.text,
              textDecorationLine: isCompleted ? 'line-through' : 'none',
            },
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {task.description ? (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}
      </View>

      {/* Footer: Responsable, Fecha y Botones de Acción */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.assigneeRow}>
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: colors.cardSubtle },
            ]}
          >
            <Ionicons name="person" size={12} color={colors.primary} />
          </View>
          <Text
            style={[styles.assigneeName, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {task.assignedTo.name}
          </Text>
        </View>

        {/* Acciones */}
        <View style={styles.actionsRow}>
          {/* Alternar Fijado (Pin) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onTogglePin(task.id)}
            style={[
              styles.actionBtn,
              { backgroundColor: task.isPinned ? '#EEF2FF' : colors.cardSubtle },
            ]}
            accessibilityLabel="Fijar tarea"
          >
            <Ionicons
              name={task.isPinned ? 'pin' : 'pin-outline'}
              size={14}
              color={task.isPinned ? '#4F46E5' : colors.textMuted}
            />
          </TouchableOpacity>

          {/* Cambiar Estado Rápido */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onStatusChange(task.id, getNextStatus(task.status))}
            style={[styles.actionBtn, { backgroundColor: colors.cardSubtle }]}
            accessibilityLabel="Cambiar estado"
          >
            <Ionicons
              name="refresh-outline"
              size={14}
              color={colors.primary}
            />
          </TouchableOpacity>

          {/* Editar Tarea */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onEdit(task)}
            style={[styles.actionBtn, { backgroundColor: colors.cardSubtle }]}
            accessibilityLabel="Editar tarea"
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Eliminar Tarea */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onDelete(task)}
            style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]}
            accessibilityLabel="Eliminar tarea"
          >
            <Ionicons name="trash-outline" size={14} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const TaskCard = React.memo(TaskCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  projectName: {
    fontSize: 11,
    fontWeight: '700',
    maxWidth: 130,
  },
  taskId: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  body: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  avatarPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assigneeName: {
    fontSize: 11,
    fontWeight: '500',
    maxWidth: 100,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
