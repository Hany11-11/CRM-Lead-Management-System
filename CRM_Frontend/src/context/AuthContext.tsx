import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { AuthContextType, User } from '../types';
import { authService } from '../services/auth.service';

const AUTH_KEY = 'crm_auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('crm_token');
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        } catch (err) {
          console.error('Session expired', err);
          setUser(null);
          localStorage.removeItem('crm_token');
          localStorage.removeItem(AUTH_KEY);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user: userData } = await authService.login(email, password);
      setUser(userData);
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      return true;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem(AUTH_KEY);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
