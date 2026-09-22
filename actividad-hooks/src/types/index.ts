export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type NavigationTab = 'dashboard' | 'tasks' | 'projects' | 'profile';

export type ThemeMode = 'light' | 'dark';

export interface Assignee {
  name: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: Assignee;
  dueDate: string;
  createdAt: string;
  isPinned?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  dueDate: string;
  lead: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  location: string;
  avatar: string;
  bio: string;
  joinDate: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface TaskStatistics {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  completionRate: number;
  highPriorityPending: number;
}
