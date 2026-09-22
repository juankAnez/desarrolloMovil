import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskStatistics, TaskStatus } from '../types';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/dashboard/StatCard';
import { ProgressCard } from '../components/dashboard/ProgressCard';
import { RecentTasks } from '../components/dashboard/RecentTasks';
import { ProjectHighlights } from '../components/dashboard/ProjectHighlights';

interface DashboardPageProps {
  tasks: Task[];
  statistics: TaskStatistics;
  projectSummaries: Map<
    string,
    { total: number; completed: number; inProgress: number; todo: number }
  >;
  onOpenCreateModal: () => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onFilterByProject: (projectName: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  tasks,
  statistics,
  projectSummaries,
  onOpenCreateModal,
  onStatusChange,
  onFilterByProject,
}) => {
  const { user, colors, setActiveTab, theme } = useApp();

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner de Bienvenida */}
      <View style={styles.welcomeSection}>
        <Text style={[styles.dateText, { color: colors.textMuted }]}>
          {today.charAt(0).toUpperCase() + today.slice(1)}
        </Text>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>
          Hola, {user.name} 👋
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
          Aquí tienes el resumen operativo de tus proyectos en tiempo real.
        </Text>
      </View>

      {/* Banner Académico Explicativo de Hooks */}
      <View
        style={[
          styles.academicBanner,
          {
            backgroundColor: theme === 'dark' ? '#1E1B4B' : '#EEF2FF',
            borderColor: theme === 'dark' ? '#3730A3' : '#C7D2FE',
          },
        ]}
      >
        <View style={styles.academicHeader}>
          <Ionicons name="school-outline" size={16} color="#4F46E5" />
          <Text style={styles.academicTitle}>Demostración de React Hooks</Text>
        </View>
        <Text
          style={[
            styles.academicDesc,
            { color: theme === 'dark' ? '#C7D2FE' : '#4338CA' },
          ]}
        >
          • <Text style={{ fontWeight: '700' }}>useContext</Text>: Estado global de tema y usuario.{"\n"}
          • <Text style={{ fontWeight: '700' }}>useMemo</Text>: Estadísticas recalculadas sin latencia redundante.{"\n"}
          • <Text style={{ fontWeight: '700' }}>useEffect</Text>: Carga simulada de datos y persistencia.
        </Text>
      </View>

      {/* Botón rápido crear */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onOpenCreateModal}
        style={[styles.createButton, { backgroundColor: colors.primary }]}
      >
        <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
        <Text style={styles.createButtonText}>Crear Nueva Tarea</Text>
      </TouchableOpacity>

      {/* Tarjeta de Progreso Principal (useMemo) */}
      <ProgressCard statistics={statistics} />

      {/* Cuadrícula de Estadísticas Rápidas (useMemo) */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Tareas"
          value={statistics.total}
          subtitle="En todo el sistema"
          icon="layers-outline"
          colorType="primary"
        />
        <StatCard
          title="En Progreso"
          value={statistics.inProgress}
          subtitle="En ejecución activa"
          icon="trending-up-outline"
          colorType="info"
        />
        <StatCard
          title="Completadas"
          value={statistics.completed}
          subtitle={`${statistics.completionRate}% finalizado`}
          icon="checkmark-done-circle-outline"
          colorType="success"
        />
        <StatCard
          title="Pendientes"
          value={statistics.todo}
          subtitle="Por comenzar"
          icon="time-outline"
          colorType="warning"
        />
      </View>

      {/* Tareas Recientes */}
      <RecentTasks
        tasks={tasks}
        onStatusChange={onStatusChange}
        onViewAll={() => setActiveTab('tasks')}
      />

      {/* Proyectos Activos Destacados */}
      <ProjectHighlights
        projectSummaries={projectSummaries}
        onSelectProject={onFilterByProject}
        onViewProjects={() => setActiveTab('projects')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  academicBanner: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  academicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  academicTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  academicDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 16,
    gap: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
