import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskPriority, TaskStatus } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <View style={[styles.badge, styles.completedBadge]}>
          <View style={[styles.dot, styles.completedDot]} />
          <Text style={[styles.badgeText, styles.completedText]}>Completada</Text>
        </View>
      );
    case 'IN_PROGRESS':
      return (
        <View style={[styles.badge, styles.inProgressBadge]}>
          <View style={[styles.dot, styles.inProgressDot]} />
          <Text style={[styles.badgeText, styles.inProgressText]}>En progreso</Text>
        </View>
      );
    case 'TODO':
    default:
      return (
        <View style={[styles.badge, styles.todoBadge]}>
          <View style={[styles.dot, styles.todoDot]} />
          <Text style={[styles.badgeText, styles.todoText]}>Pendiente</Text>
        </View>
      );
  }
};

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'HIGH':
      return (
        <View style={[styles.priorityBadge, styles.highPriorityBadge]}>
          <Text style={[styles.priorityText, styles.highPriorityText]}>Alta</Text>
        </View>
      );
    case 'MEDIUM':
      return (
        <View style={[styles.priorityBadge, styles.mediumPriorityBadge]}>
          <Text style={[styles.priorityText, styles.mediumPriorityText]}>Media</Text>
        </View>
      );
    case 'LOW':
    default:
      return (
        <View style={[styles.priorityBadge, styles.lowPriorityBadge]}>
          <Text style={[styles.priorityText, styles.lowPriorityText]}>Baja</Text>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  completedBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  completedDot: {
    backgroundColor: '#10B981',
  },
  completedText: {
    color: '#047857',
  },
  inProgressBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  inProgressDot: {
    backgroundColor: '#3B82F6',
  },
  inProgressText: {
    color: '#1D4ED8',
  },
  todoBadge: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  todoDot: {
    backgroundColor: '#F59E0B',
  },
  todoText: {
    color: '#B45309',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
  },
  highPriorityBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  highPriorityText: {
    color: '#DC2626',
  },
  mediumPriorityBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  mediumPriorityText: {
    color: '#D97706',
  },
  lowPriorityBadge: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lowPriorityText: {
    color: '#64748B',
  },
});
