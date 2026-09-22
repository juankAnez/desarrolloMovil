import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types/auth';
import { MOCK_CLIENT_USER, MOCK_PROVIDER_USER } from '../data/mockUsers';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  loginAs: (role: UserRole) => void;
  switchRole: () => void;
  logout: () => void;
  updateUserAvatar: (newAvatar: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [clientUser, setClientUser] = useState<User>(MOCK_CLIENT_USER);
  const [providerUser, setProviderUser] = useState<User>(MOCK_PROVIDER_USER);
  const [activeRole, setActiveRole] = useState<UserRole>('CLIENT');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const user = isAuthenticated
    ? activeRole === 'CLIENT'
      ? clientUser
      : providerUser
    : null;

  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (pass !== '123456' && pass !== 'password123') {
      return {
        success: false,
        message: 'Contraseña incorrecta. Utiliza 123456 o password123 para la prueba.',
      };
    }

    if (cleanEmail === 'cliente@test.com') {
      setActiveRole('CLIENT');
      setIsAuthenticated(true);
      return { success: true };
    }

    if (cleanEmail === 'prestador@test.com') {
      setActiveRole('PROVIDER');
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      message: 'Usuario no registrado. Usa cliente@test.com o prestador@test.com',
    };
  };

  const loginAs = (roleToSet: UserRole) => {
    setActiveRole(roleToSet);
    setIsAuthenticated(true);
  };

  const switchRole = () => {
    setActiveRole((prev) => (prev === 'CLIENT' ? 'PROVIDER' : 'CLIENT'));
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Actualizar avatar/foto de perfil del usuario activo
  const updateUserAvatar = (newAvatar: string) => {
    if (activeRole === 'CLIENT') {
      setClientUser((prev) => ({ ...prev, avatar: newAvatar }));
    } else {
      setProviderUser((prev) => ({ ...prev, avatar: newAvatar }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: activeRole,
        isAuthenticated,
        login,
        loginAs,
        switchRole,
        logout,
        updateUserAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
