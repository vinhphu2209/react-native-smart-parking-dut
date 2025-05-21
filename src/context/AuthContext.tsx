import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, getUserProfile } from '../api/api';

interface User {
  id?: string;
  name?: string;
  mssv?: string;
  balance?: number;
  bank_linked?: boolean;
  id_rfid?: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signed: boolean;
  login: (mssv: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    async function loadStorageData() {
      try {
        setLoading(true);
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
          setSigned(true);
        } else {
          setUser(null);
          setSigned(false);
        }
      } catch (error) {
        console.error('Error loading auth data from storage:', error);
        setUser(null);
        setSigned(false);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const login = async (mssv: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiLogin(mssv, password);
      const { token, user } = response;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setSigned(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setUser(null);
      setSigned(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData: User) => {
    setUser(prev => {
      const updated = { ...prev, ...userData };
      AsyncStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ signed, user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
