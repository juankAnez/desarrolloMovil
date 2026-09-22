import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProjectCardProps {
  project: Project;
  stats: { total: number; completed: number; inProgress: number; todo: number };
  onFilterByProject: (projectName: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  stats,
  onFilterByProject,
}) => {
  const { colors } = useApp();

  const completionPercent =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

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
      {/* Barra superior de color del proyecto */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: project.color || colors.primary },
        ]}
      />

      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.titleWrap}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {project.name}
            </Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{project.category}</Text>
            </View>
          </View>

          <Text style={[styles.percent, { color: colors.primary }]}>
            {completionPercent}%
          </Text>
        </View>

        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {project.description}
        </Text>

        {/* Barra de progreso */}
        <View style={[styles.progressTrack, { backgroundColor: colors.cardSubtle }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${completionPercent}%`,
                backgroundColor: project.color || colors.primary,
              },
            ]}
          />
        </View>

        {/* Métricas del proyecto */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.text }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>
              Total
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.primary }]}>
              {stats.inProgress}
            </Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>
              En curso
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.success }]}>
              {stats.completed}
            </Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>
              Listas
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.warning }]}>
              {stats.todo}
            </Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>
              Pendientes
            </Text>
          </View>
        </View>

        {/* Botón Ver Tareas */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onFilterByProject(project.name)}
          style={[
            styles.actionButton,
            { backgroundColor: colors.cardSubtle, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.actionBtnText, { color: colors.primary }]}>
            Ver {stats.total} tareas de este proyecto
          </Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  percent: {
    fontSize: 16,
    fontWeight: '800',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '700',
  },
  statLbl: {
    fontSize: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
