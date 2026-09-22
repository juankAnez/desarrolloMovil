import React, { createContext, useContext, useState } from 'react';
import {
  NavigationTab,
  Project,
  ThemeMode,
  ToastNotification,
  UserProfile,
} from '../types';
import { INITIAL_PROJECTS, INITIAL_USER } from '../data/mockData';

export interface ThemeColors {
  background: string;
  card: string;
  cardSubtle: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryText: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
}

export const LIGHT_THEME: ThemeColors = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardSubtle: '#F1F5F9',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  primaryText: '#4338CA',
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
};

export const DARK_THEME: ThemeColors = {
  background: '#0B0F19',
  card: '#151D2F',
  cardSubtle: '#1E293B',
  border: '#26344F',
  borderStrong: '#334155',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#6366F1',
  primaryLight: '#1E1B4B',
  primaryText: '#818CF8',
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#78350F',
  danger: '#F87171',
  dangerLight: '#7F1D1D',
};

interface AppContextType {
  user: UserProfile;
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  toasts: ToastNotification[];
  notify: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  projects: Project[];
  searchFocusTrigger: number;
  triggerSearchFocus: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. [useState] Usuario de sesión (Juan Carlos Áñez)
  const [user] = useState<UserProfile>(INITIAL_USER);

  // 1. [useState] Modo Claro / Oscuro
  const [theme, setTheme] = useState<ThemeMode>('light');

  // 1. [useState] Pestaña activa de navegación móvil
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // 1. [useState] Cola de notificaciones tipo Toast
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // 1. [useState] Proyectos disponibles
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);

  // 1. [useState] Contador para disparar foco en buscador mediante useRef
  const [searchFocusTrigger, setSearchFocusTrigger] = useState(0);

  const colors = theme === 'dark' ? DARK_THEME : LIGHT_THEME;

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const notify = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Auto-eliminar tras 3 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerSearchFocus = () => {
    setActiveTab('tasks');
    setSearchFocusTrigger((prev) => prev + 1);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        theme,
        colors,
        toggleTheme,
        activeTab,
        setActiveTab,
        toasts,
        notify,
        removeToast,
        projects,
        searchFocusTrigger,
        triggerSearchFocus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
