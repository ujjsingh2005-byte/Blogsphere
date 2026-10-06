import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('blogsphere_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on startup
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('blogsphere_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            setToken(storedToken);
          }
        } catch (error) {
          console.error('[Auth Init] Expired or invalid token, clearing session');
          localStorage.removeItem('blogsphere_token');
          localStorage.removeItem('blogsphere_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const userData = res.data.data;
      const userToken = userData.token;
      
      localStorage.setItem('blogsphere_token', userToken);
      localStorage.setItem('blogsphere_user', JSON.stringify(userData));
      
      setUser(userData);
      setToken(userToken);
      return userData;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const registeredData = res.data.data;
      const userToken = registeredData.token;

      localStorage.setItem('blogsphere_token', userToken);
      localStorage.setItem('blogsphere_user', JSON.stringify(registeredData));

      setUser(registeredData);
      setToken(userToken);
      return registeredData;
    }
  };

  const logout = () => {
    localStorage.removeItem('blogsphere_token');
    localStorage.removeItem('blogsphere_user');
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.data.success) {
      const updatedUser = res.data.data;
      setUser(updatedUser);
      localStorage.setItem('blogsphere_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile
      }}
    >
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
