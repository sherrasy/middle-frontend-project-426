import { useState, useEffect, ReactNode } from 'react';
import { LOCALSTORAGE_NAMES } from '@/shared/constants/localstorage-names';
import { logoutApi } from '../api/logout';
import { loginApi } from '../api/login';
import { registerApi } from '../api/register';
import { User } from '../lib/types';
import { getCurrentUserApi } from '../api/getCurrentUser';
import { AuthContext } from './useAuth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(LOCALSTORAGE_NAMES.token);

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUserApi();
        setUser(userData);
      } catch {
        setUser(null);
        localStorage.removeItem(LOCALSTORAGE_NAMES.token);
        localStorage.removeItem(LOCALSTORAGE_NAMES.user);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginApi(email, password);
    localStorage.setItem(LOCALSTORAGE_NAMES.token, response.token);
    localStorage.setItem(
      LOCALSTORAGE_NAMES.user,
      JSON.stringify(response.user),
    );
    setUser(response.user);
  };

  const register = async (email: string, password: string) => {
    const response = await registerApi(email, password);
    localStorage.setItem(LOCALSTORAGE_NAMES.token, response.token);
    localStorage.setItem(
      LOCALSTORAGE_NAMES.user,
      JSON.stringify(response.user),
    );
    setUser(response.user);
  };

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem(LOCALSTORAGE_NAMES.token);
    localStorage.removeItem(LOCALSTORAGE_NAMES.user);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
