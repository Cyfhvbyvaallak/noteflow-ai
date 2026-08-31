import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  id: 1,
  name: 'Alex Vance',
  email: 'student@noteflow.ai'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_DEMO_USER);
  const [token, setToken] = useState(localStorage.getItem('noteflow_token') || null);
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(!localStorage.getItem('noteflow_token'));

  useEffect(() => {
    async function loadUser() {
      const savedToken = localStorage.getItem('noteflow_token');
      if (savedToken) {
        try {
          const profile = await api.auth.me();
          if (profile && profile.id) {
            setUser(profile);
            setDemoMode(false);
          }
        } catch (err) {
          console.warn('Backend offline or token expired, using demo session:', err);
          setUser(DEFAULT_DEMO_USER);
          setDemoMode(true);
        }
      } else {
        setUser(DEFAULT_DEMO_USER);
        setDemoMode(true);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email, password);
      localStorage.setItem('noteflow_token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      setDemoMode(false);
      return data.user;
    } catch (err) {
      throw err;
    }
  };

  const loginDemo = () => {
    setUser(DEFAULT_DEMO_USER);
    setDemoMode(true);
    return DEFAULT_DEMO_USER;
  };

  const register = async (name, email, password) => {
    try {
      const data = await api.auth.register(name, email, password);
      localStorage.setItem('noteflow_token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      setDemoMode(false);
      return data.user;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('noteflow_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        demoMode,
        login,
        loginDemo,
        register,
        logout,
        updateUserProfile,
        isAuthenticated: !!user
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
