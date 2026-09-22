import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';

interface ConfirmDialogProps {
  isOpen: boolean;
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  task,
  onConfirm,
  onCancel,
}) => {
  const { colors, theme } = useApp();

  if (!isOpen || !task) return null;

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.header}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: theme === 'dark' ? '#451A1A' : '#FEE2E2',
                  borderColor: theme === 'dark' ? '#7F1D1D' : '#FECACA',
                },
              ]}
            >
              <Ionicons name="warning-outline" size={24} color="#EF4444" />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.text }]}>
                ¿Eliminar esta tarea?
              </Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Esta acción no se puede deshacer.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.taskPreview,
              {
                backgroundColor: colors.cardSubtle,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[styles.taskTitle, { color: colors.text }]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            <Text style={[styles.taskMeta, { color: colors.textSecondary }]}>
              Proyecto:{' '}
              <Text style={{ fontWeight: '700', color: colors.primary }}>
                {task.project}
              </Text>{' '}
              • ID: {task.id}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCancel}
              style={[
                styles.btn,
                styles.cancelBtn,
                {
                  backgroundColor: colors.cardSubtle,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onConfirm}
              style={[styles.btn, styles.deleteBtn]}
            >
              <Ionicons name="trash" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  taskPreview: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskMeta: {
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  cancelBtn: {
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#DC2626',
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
