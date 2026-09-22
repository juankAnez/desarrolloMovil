import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

interface ProjectHighlightsProps {
  projectSummaries: Map<
    string,
    { total: number; completed: number; inProgress: number; todo: number }
  >;
  onSelectProject: (projectName: string) => void;
  onViewProjects: () => void;
}

export const ProjectHighlights: React.FC<ProjectHighlightsProps> = ({
  projectSummaries,
  onSelectProject,
  onViewProjects,
}) => {
  const { colors, projects } = useApp();

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
          <Ionicons name="folder-outline" size={18} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Proyectos Activos
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={onViewProjects}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            Gestionar →
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {projects.map((proj) => {
          const stats = projectSummaries.get(proj.name) || {
            total: 0,
            completed: 0,
            inProgress: 0,
            todo: 0,
          };
          const percent =
            stats.total > 0
              ? Math.round((stats.completed / stats.total) * 100)
              : 0;

          return (
            <TouchableOpacity
              key={proj.id}
              activeOpacity={0.7}
              onPress={() => onSelectProject(proj.name)}
              style={[
                styles.projectItem,
                {
                  backgroundColor: colors.cardSubtle,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.topLine}>
                <Text
                  style={[styles.projectName, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {proj.name}
                </Text>
                <Text style={[styles.percentText, { color: colors.primary }]}>
                  {percent}%
                </Text>
              </View>

              {/* Barra de progreso */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${percent}%`,
                      backgroundColor: proj.color || colors.primary,
                    },
                  ]}
                />
              </View>

              <View style={styles.metaRow}>
                <Text style={[styles.countText, { color: colors.textMuted }]}>
                  {stats.completed}/{stats.total} tareas listas
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={colors.textMuted}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
  list: {
    gap: 10,
  },
  projectItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  projectName: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: {
    fontSize: 11,
  },
});
