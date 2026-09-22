import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/projects/ProjectCard';

interface ProjectsPageProps {
  projectSummaries: Map<
    string,
    { total: number; completed: number; inProgress: number; todo: number }
  >;
  onFilterByProject: (projectName: string) => void;
  onOpenCreateModal: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projectSummaries,
  onFilterByProject,
  onOpenCreateModal,
}) => {
  const { colors, projects, theme } = useApp();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Proyectos Activos
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {projects.length} iniciativas en desarrollo
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenCreateModal}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Nueva Tarea</Text>
        </TouchableOpacity>
      </View>

      {/* Banner de Hooks en Proyectos */}
      <View
        style={[
          styles.hookNotice,
          {
            backgroundColor: theme === 'dark' ? '#1E1B4B' : '#EEF2FF',
            borderColor: theme === 'dark' ? '#3730A3' : '#C7D2FE',
          },
        ]}
      >
        <Ionicons name="pie-chart-outline" size={14} color="#6366F1" />
        <Text
          style={[
            styles.hookNoticeText,
            { color: theme === 'dark' ? '#C7D2FE' : '#4338CA' },
          ]}
        >
          Las métricas por proyecto se calculan mediante{' '}
          <Text style={{ fontWeight: '700' }}>useMemo</Text> agrupando las tareas en tiempo real.
        </Text>
      </View>

      {/* Lista de proyectos */}
      <View style={styles.list}>
        {projects.map((project) => {
          const stats = projectSummaries.get(project.name) || {
            total: 0,
            completed: 0,
            inProgress: 0,
            todo: 0,
          };

          return (
            <ProjectCard
              key={project.id}
              project={project}
              stats={stats}
              onFilterByProject={onFilterByProject}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
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
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  hookNoticeText: {
    fontSize: 11,
    flex: 1,
  },
  list: {
    gap: 12,
  },
});
