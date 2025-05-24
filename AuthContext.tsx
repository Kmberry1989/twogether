import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://api.twogether.app/v1';

interface PartnerPayload { name: string; avatarUrl?: string }
interface AuthContextType {
  token: string | null;
  coupleId: string | null;
  isLoading: boolean;
  signup: (email: string, password: string, partnerA: PartnerPayload, partnerB: PartnerPayload) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedCoupleId = await AsyncStorage.getItem('coupleId');
      if (storedToken && storedCoupleId) {
        setToken(storedToken);
        setCoupleId(storedCoupleId);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
      setLoading(false);
    };
    loadAuth();
  }, []);

  const signup = async (email: string, password: string, partnerA: PartnerPayload, partnerB: PartnerPayload) => {
    const resp = await axios.post(`${API_URL}/auth/signup`, { email, password, partnerA, partnerB });
    const { token: jwt, coupleId: id } = resp.data;
    await AsyncStorage.setItem('token', jwt);
    await AsyncStorage.setItem('coupleId', id);
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    setToken(jwt);
    setCoupleId(id);
  };

  const login = async (email: string, password: string) => {
    const resp = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token: jwt, coupleId: id } = resp.data;
    await AsyncStorage.setItem('token', jwt);
    await AsyncStorage.setItem('coupleId', id);
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    setToken(jwt);
    setCoupleId(id);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('coupleId');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setCoupleId(null);
  };

  return (
    <AuthContext.Provider value={{ token, coupleId, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
