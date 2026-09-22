import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt'>, taskId?: string) => void;
  editingTask: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
}) => {
  const { colors, theme, projects, user } = useApp();

  // 1. [useState] Estado local del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('Plataforma Educativa');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [error, setError] = useState('');

  // 5. [useRef] Referencia para enfocar automáticamente el TextInput de Título
  const titleInputRef = useRef<TextInput>(null);

  // 2. [useEffect] Sincronizar datos al abrir o editar
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description);
        setProject(editingTask.project);
        setPriority(editingTask.priority);
        setStatus(editingTask.status);
      } else {
        setTitle('');
        setDescription('');
        setProject(projects[0]?.name || 'Plataforma Educativa');
        setPriority('MEDIUM');
        setStatus('TODO');
      }
      setError('');

      // 5. [useRef] Disparo de auto-focus al abrir el modal
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen, editingTask, projects]);

  const handleSave = () => {
    if (!title.trim()) {
      setError('El título de la tarea es obligatorio.');
      titleInputRef.current?.focus();
      return;
    }

    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        project,
        priority,
        status,
        assignedTo: editingTask
          ? editingTask.assignedTo
          : { name: user.name, avatar: user.avatar, role: user.role },
        dueDate: editingTask
          ? editingTask.dueDate
          : new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        isPinned: editingTask ? editingTask.isPinned : false,
      },
      editingTask ? editingTask.id : undefined
    );
  };

  const PRIORITIES: { key: TaskPriority; label: string; color: string }[] = [
    { key: 'LOW', label: 'Baja', color: '#64748B' },
    { key: 'MEDIUM', label: 'Media', color: '#D97706' },
    { key: 'HIGH', label: 'Alta', color: '#DC2626' },
  ];

  const STATUSES: { key: TaskStatus; label: string }[] = [
    { key: 'TODO', label: 'Pendiente' },
    { key: 'IN_PROGRESS', label: 'En progreso' },
    { key: 'COMPLETED', label: 'Completada' },
  ];

  if (!isOpen) return null;

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header del modal */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerTitleWrap}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
              </Text>
              <View
                style={[
                  styles.hookBadge,
                  { backgroundColor: theme === 'dark' ? '#1E1B4B' : '#EEF2FF' },
                ]}
              >
                <Ionicons name="sparkles" size={11} color="#6366F1" />
                <Text style={styles.hookBadgeText}>useRef Auto-Focus</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.formBody}>
            {/* Título */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Título de la tarea <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                ref={titleInputRef}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (error) setError('');
                }}
                placeholder="Ej: Diseñar componentes UI"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.cardSubtle,
                    borderColor: error ? '#EF4444' : colors.border,
                    color: colors.text,
                  },
                ]}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            {/* Descripción */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Descripción (opcional)
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Detalla los requisitos o notas importantes..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: colors.cardSubtle,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
              />
            </View>

            {/* Proyecto */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Proyecto asignado
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalSelect}
              >
                {projects.map((proj) => {
                  const isSelected = project === proj.name;
                  return (
                    <TouchableOpacity
                      key={proj.id}
                      activeOpacity={0.7}
                      onPress={() => setProject(proj.name)}
                      style={[
                        styles.selectOption,
                        {
                          backgroundColor: isSelected
                            ? colors.primary
                            : colors.cardSubtle,
                          borderColor: isSelected
                            ? colors.primary
                            : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.selectOptionText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.text,
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

            {/* Prioridad */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Nivel de Prioridad
              </Text>
              <View style={styles.rowOptions}>
                {PRIORITIES.map((p) => {
                  const isSelected = priority === p.key;
                  return (
                    <TouchableOpacity
                      key={p.key}
                      activeOpacity={0.7}
                      onPress={() => setPriority(p.key)}
                      style={[
                        styles.priorityButton,
                        {
                          backgroundColor: isSelected
                            ? p.color
                            : colors.cardSubtle,
                          borderColor: isSelected ? p.color : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityButtonText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Estado */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Estado inicial
              </Text>
              <View style={styles.rowOptions}>
                {STATUSES.map((s) => {
                  const isSelected = status === s.key;
                  return (
                    <TouchableOpacity
                      key={s.key}
                      activeOpacity={0.7}
                      onPress={() => setStatus(s.key)}
                      style={[
                        styles.priorityButton,
                        {
                          backgroundColor: isSelected
                            ? colors.primary
                            : colors.cardSubtle,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityButtonText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Botones de acción footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={[
                styles.btn,
                styles.cancelBtn,
                { backgroundColor: colors.cardSubtle, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSave}
              style={[styles.btn, styles.saveBtn, { backgroundColor: colors.primary }]}
            >
              <Ionicons
                name="checkmark"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.saveBtnText}>
                {editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  hookBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  hookBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366F1',
  },
  formBody: {
    marginTop: 12,
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  horizontalSelect: {
    flexDirection: 'row',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectOptionText: {
    fontSize: 12,
  },
  rowOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityButtonText: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  cancelBtn: {
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {},
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
