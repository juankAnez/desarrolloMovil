import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, useApp } from './context/AppContext';
import { useTasks } from './hooks/useTasks';
import { Header } from './components/layout/Header';
import { BottomTabs } from './components/layout/BottomTabs';
import { ToastContainer } from './components/common/ToastContainer';
import { TaskModal } from './components/tasks/TaskModal';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';

const TaskFlowContent: React.FC = () => {
  const { activeTab, setActiveTab, theme, colors } = useApp();

  const {
    tasks,
    isLoading,
    filteredTasks,
    statistics,
    projectSummaries,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    projectFilter,
    setProjectFilter,
    resetFilters,
    isTaskModalOpen,
    editingTask,
    openCreateModal,
    openEditModal,
    closeTaskModal,
    handleSaveTask,
    handleChangeStatus,
    handleTogglePin,
    taskToDelete,
    setTaskToDelete,
    handleConfirmDelete,
  } = useTasks();

  // 2. [useEffect] Loading inicial simulado de API
  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme === 'dark' ? '#0B0F19' : '#F8FAFC' },
        ]}
      >
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <View style={styles.loadingCard}>
          <View style={styles.loadingLogo}>
            <Ionicons name="layers" size={32} color="#FFFFFF" />
          </View>
          <Text
            style={[
              styles.loadingTitle,
              { color: theme === 'dark' ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            Iniciando TaskFlow SaaS
          </Text>
          <Text style={styles.loadingSubtitle}>
            Simulando carga de datos con useEffect...
          </Text>
          <ActivityIndicator
            size="large"
            color="#6366F1"
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  // Filtrado directo al presionar un proyecto
  const handleFilterByProject = (projectName: string) => {
    setProjectFilter(projectName);
    setActiveTab('tasks');
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.card}
      />

      {/* Contenedor de notificaciones Toast */}
      <ToastContainer />

      {/* Header superior fijo */}
      <Header onOpenCreateModal={openCreateModal} />

      {/* Contenido según la pestaña activa */}
      <View style={styles.contentArea}>
        {activeTab === 'dashboard' && (
          <DashboardPage
            tasks={tasks}
            statistics={statistics}
            projectSummaries={projectSummaries}
            onOpenCreateModal={openCreateModal}
            onStatusChange={handleChangeStatus}
            onFilterByProject={handleFilterByProject}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksPage
            tasks={tasks}
            filteredTasks={filteredTasks}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            projectFilter={projectFilter}
            onProjectChange={setProjectFilter}
            onResetFilters={resetFilters}
            onOpenCreateModal={openCreateModal}
            onOpenEditModal={openEditModal}
            onOpenDeleteModal={(t) => setTaskToDelete(t)}
            onTaskStatusChange={handleChangeStatus}
            onTogglePin={handleTogglePin}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsPage
            projectSummaries={projectSummaries}
            onFilterByProject={handleFilterByProject}
            onOpenCreateModal={openCreateModal}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage statistics={statistics} />
        )}
      </View>

      {/* Pestañas de navegación móvil */}
      <BottomTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tasksBadgeCount={statistics.todo + statistics.inProgress}
      />

      {/* Modal de Crear / Editar Tarea (useRef para auto-enfoque) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />

      {/* Diálogo de Confirmación para eliminar tarea */}
      <ConfirmDialog
        isOpen={taskToDelete !== null}
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <TaskFlowContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingCard: {
    alignItems: 'center',
  },
  loadingLogo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
