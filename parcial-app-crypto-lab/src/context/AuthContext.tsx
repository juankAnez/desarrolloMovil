import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types/auth';
import { MOCK_CLIENT_USER, MOCK_PROVIDER_USER } from '../data/mockUsers';
import { encryptPayload, decryptPayload, hashPassword } from '../security/crypto';
import { API_URL } from '../config';

const SESSION_KEY = 'servigo.session';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isRestoring: boolean;
  login: (
    email: string,
    pass: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; message?: string }>;
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
  const [isRestoring, setIsRestoring] = useState<boolean>(true);
  const restoreRan = useRef(false);

  const user = isAuthenticated
    ? activeRole === 'CLIENT'
      ? clientUser
      : providerUser
    : null;

  // Restauración de sesión persistida (V5) + re-sincronización al servidor
  useEffect(() => {
    if (restoreRan.current) return;
    restoreRan.current = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) {
          const plain = decryptPayload(raw);
          const session = JSON.parse(plain) as {
            token?: string;
            role?: UserRole;
            profile?: User;
          };
          if (session?.role && session?.profile) {
            if (session.role === 'CLIENT') setClientUser(session.profile);
            else setProviderUser(session.profile);
            setActiveRole(session.role);
            setIsAuthenticated(true);

            // Re-sincronización: los datos persistidos viajan de vuelta al backend.
            // Un atacante con proxy puede capturar y descifrar este mismo payload.
            try {
              const refreshPayload = encryptPayload({
                action: 'session_refresh',
                email: session.profile.email,
                token: session.token,
                user: session.profile,
                ts: Date.now(),
              });
              await fetch(`${API_URL}/api/session/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payload: refreshPayload }),
              });
            } catch {
              // backend caído: la sesión local sigue siendo válida
            }
          }
        }
      } catch {
        // sesión corrupta: se ignora
      } finally {
        setIsRestoring(false);
      }
    })();
  }, []);

  const login = async (
    email: string,
    pass: string,
    rememberMe: boolean = true
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Validación local de credenciales de la app
    if (pass !== '123456' && pass !== 'password123') {
      return {
        success: false,
        message: 'Contraseña incorrecta. Utiliza 123456 o password123 para la prueba.',
      };
    }

    let targetRole: UserRole | null = null;
    if (cleanEmail === 'cliente@test.com') targetRole = 'CLIENT';
    else if (cleanEmail === 'prestador@test.com') targetRole = 'PROVIDER';

    if (!targetRole) {
      return {
        success: false,
        message: 'Usuario no registrado. Usa cliente@test.com o prestador@test.com',
      };
    }

    const localUser = targetRole === 'CLIENT' ? MOCK_CLIENT_USER : MOCK_PROVIDER_USER;

    // V3 + V2 + V1: hash MD5 y payload cifrado con clave hardcodeada (AES-ECB)
    const payload = encryptPayload({
      action: 'login',
      email: cleanEmail,
      passwordHash: hashPassword(pass),
      role: targetRole,
      user: localUser,
      ts: Date.now(),
    });

    let data: { token?: string; profile?: User; message?: string };
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload }),
      });
      data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          message: data?.message || `Error del servidor (${res.status}).`,
        };
      }
    } catch {
      return {
        success: false,
        message:
          'No se pudo contactar el servidor de autenticación (HTTP). Verifica que el backend esté activo.',
      };
    }

    const profile = data.profile ?? localUser;

    if (targetRole === 'CLIENT') setClientUser(profile);
    else setProviderUser(profile);
    setActiveRole(targetRole);
    setIsAuthenticated(true);

    // V5: persistir sesión cifrada con la MISMA clave débil
    if (rememberMe && data.token) {
      try {
        const sessionBlob = encryptPayload({
          token: data.token,
          role: targetRole,
          profile,
        });
        await AsyncStorage.setItem(SESSION_KEY, sessionBlob);
      } catch {
        // almacenamiento no disponible: la sesión en memoria sigue activa
      }
    }

    return { success: true };
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
    AsyncStorage.removeItem(SESSION_KEY).catch(() => {});
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
        isRestoring,
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
