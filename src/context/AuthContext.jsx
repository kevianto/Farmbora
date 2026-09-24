import { createContext, useContext, useState, useEffect } from 'react';
import { api, endpoints } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('farmbora_token');
      if (token) {
        try {
          const res = await api.get(endpoints.auth.me);
          setUser(res.data.user);
          if (res.data.farm) setProfile(res.data.farm);
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('farmbora_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post(endpoints.auth.login, { email, password });
      setUser(res.data.user);
      localStorage.setItem('farmbora_token', res.data.token);
      
      // Fetch farm profile immediately after login
      try {
        const meRes = await api.get(endpoints.auth.me);
        if (meRes.data.farm) setProfile(meRes.data.farm);
      } catch (e) {
        // Normal if farm isn't created yet
      }
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post(endpoints.auth.signup, userData);
      setUser(res.data.user);
      localStorage.setItem('farmbora_token', res.data.token);
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('farmbora_token');
  };

  const registerFarm = async (farmData) => {
    try {
      const res = await api.post(endpoints.farm.register, farmData);
      setProfile(res.data.farm);
      return res.data.farm;
    } catch (error) {
      throw error.response?.data?.message || 'Farm registration failed';
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, register, logout, registerFarm, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
