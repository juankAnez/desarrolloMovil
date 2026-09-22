import { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskPriority, TaskStatus, TaskStatistics } from '../types';
import { INITIAL_TASKS } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const useTasks = () => {
  const { notify } = useApp();

  // 1. [useState] Lista de tareas
  const [tasks, setTasks] = useState<Task[]>([]);

  // 1. [useState] Estado de carga simulada de API
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. [useState] Búsqueda y Filtros
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');

  // 1. [useState] Modales y tarea seleccionada para edición o eliminación
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // 2. [useEffect] Carga inicial simulada de API con delay y respaldo persistente
  useEffect(() => {
    const timer = setTimeout(() => {
      let loaded = INITIAL_TASKS;
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('taskflow_tasks');
        if (saved) {
          try {
            loaded = JSON.parse(saved);
          } catch {
            loaded = INITIAL_TASKS;
          }
        }
      }
      setTasks(loaded);
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // 2. [useEffect] Persistencia automática al modificar tareas
  useEffect(() => {
    if (!isLoading && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
      } catch (e) {
        // Ignorar si storage no está disponible
      }
    }
  }, [tasks, isLoading]);

  // 3. [useMemo] Cálculo derivado de estadísticas del Dashboard
  // Se recalcula ÚNICAMENTE cuando cambia el arreglo de "tasks"
  const statistics: TaskStatistics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todo = tasks.filter((t) => t.status === 'TODO').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const highPriorityPending = tasks.filter(
      (t) => t.priority === 'HIGH' && t.status !== 'COMPLETED'
    ).length;

    return {
      total,
      completed,
      inProgress,
      todo,
      completionRate,
      highPriorityPending,
    };
  }, [tasks]);

  // 3. [useMemo] Filtrado reactivo y eficiente de tareas
  // Se recalcula cuando cambia la lista o cualquiera de los criterios de filtro
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filtro por texto de búsqueda
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description.toLowerCase().includes(query);
        const matchProject = task.project.toLowerCase().includes(query);
        const matchAssignee = task.assignedTo.name.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchProject && !matchAssignee) {
          return false;
        }
      }

      // Filtro por Estado
      if (statusFilter !== 'ALL' && task.status !== statusFilter) {
        return false;
      }

      // Filtro por Prioridad
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) {
        return false;
      }

      // Filtro por Proyecto
      if (projectFilter !== 'ALL' && task.project !== projectFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, projectFilter]);

  // 3. [useMemo] Estadísticas por proyecto para la vista de Proyectos
  const projectSummaries = useMemo(() => {
    const map = new Map<
      string,
      { total: number; completed: number; inProgress: number; todo: number }
    >();

    tasks.forEach((t) => {
      const current = map.get(t.project) || { total: 0, completed: 0, inProgress: 0, todo: 0 };
      current.total += 1;
      if (t.status === 'COMPLETED') current.completed += 1;
      else if (t.status === 'IN_PROGRESS') current.inProgress += 1;
      else current.todo += 1;
      map.set(t.project, current);
    });

    return map;
  }, [tasks]);

  // 4. [useCallback] Crear o Actualizar tarea (Memorizada para evitar recrear la función)
  const handleSaveTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt'>, taskId?: string) => {
      if (taskId) {
        // Actualizar tarea existente
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, ...taskData } : t
          )
        );
        notify('Tarea actualizada con éxito', 'success');
      } else {
        // Crear nueva tarea con ID único
        const randomNum = Math.floor(100 + Math.random() * 900);
        const newTask: Task = {
          ...taskData,
          id: `TASK-${randomNum}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setTasks((prev) => [newTask, ...prev]);
        notify('Nueva tarea creada correctamente', 'success');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
    },
    [notify]
  );

  // 4. [useCallback] Cambiar estado de una tarea
  const handleChangeStatus = useCallback(
    (id: string, newStatus: TaskStatus) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
      notify(
        `Estado cambiado a: ${
          newStatus === 'COMPLETED'
            ? 'Completada'
            : newStatus === 'IN_PROGRESS'
            ? 'En Progreso'
            : 'Pendiente'
        }`,
        'info'
      );
    },
    [notify]
  );

  // 4. [useCallback] Alternar fijado (Pin)
  const handleTogglePin = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, isPinned: !task.isPinned } : task
        )
      );
    },
    []
  );

  // 4. [useCallback] Confirmar eliminación de tarea
  const handleConfirmDelete = useCallback(() => {
    if (!taskToDelete) return;
    const deletedId = taskToDelete.id;
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
    notify(`Tarea ${deletedId} eliminada correctamente`, 'warning');
    setTaskToDelete(null);
  }, [taskToDelete, notify]);

  // 4. [useCallback] Abrir modal para crear
  const openCreateModal = useCallback(() => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  }, []);

  // 4. [useCallback] Abrir modal para editar
  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }, []);

  // 4. [useCallback] Cerrar modal
  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  // 4. [useCallback] Restablecer filtros
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setProjectFilter('ALL');
  }, []);

  return {
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
  };
};
