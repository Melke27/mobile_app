import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const cached = await storageService.getJSON(storageService.keys.SESSION, null);

        if (cached?.token) {
          try {
            const profile = await authService.me();
            setSession({ ...cached, user: profile.user || cached.user });
          } catch (_error) {
            await storageService.remove(storageService.keys.SESSION);
            setSession(null);
          }
        }
      } catch (error) {
        console.error('Session bootstrap failed', error);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const persistSession = async (value) => {
    setSession(value);
    if (value) {
      await storageService.setJSON(storageService.keys.SESSION, value);
    } else {
      await storageService.remove(storageService.keys.SESSION);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      await persistSession(data);
    } catch (error) {
      Alert.alert('Login failed', error?.response?.data?.message || 'Please try again.');
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const data = await authService.register(payload);
      await persistSession(data);
    } catch (error) {
      Alert.alert('Registration failed', error?.response?.data?.message || 'Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    await persistSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      token: session?.token || null,
      loading,
      login,
      register,
      logout,
      isAdmin: session?.user?.role === 'admin',
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
