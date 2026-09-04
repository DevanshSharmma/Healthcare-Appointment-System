import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medipulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('medipulse_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync / verify token and user on initial boot
  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem('medipulse_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          const userData = res.data;
          setUser(userData);
          localStorage.setItem('medipulse_user', JSON.stringify(userData));
        } catch (err) {
          console.warn('Session verification failed. Logging out.', err);
          logout();
        }
      }
      setIsLoading(false);
    }
    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    setToken(data.access_token);
    localStorage.setItem('medipulse_token', data.access_token);

    const userObj = {
      id: data.user_id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
    };
    setUser(userObj);
    localStorage.setItem('medipulse_user', JSON.stringify(userObj));
    return userObj;
  };

  const demoLogin = async (targetRole) => {
    const credentialsMap = {
      PATIENT: { email: 'john.doe@patient.com', password: 'Password123!' },
      DOCTOR: { email: 'sarah.jenkins@healthcare.com', password: 'Password123!' },
      ADMIN: { email: 'admin@healthcare.com', password: 'Password123!' },
    };

    const creds = credentialsMap[targetRole.toUpperCase()];
    if (!creds) throw new Error(`Unknown demo role: ${targetRole}`);

    return await login(creds.email, creds.password);
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    const data = res.data;
    setToken(data.access_token);
    localStorage.setItem('medipulse_token', data.access_token);

    const userObj = {
      id: data.user_id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
    };
    setUser(userObj);
    localStorage.setItem('medipulse_user', JSON.stringify(userObj));
    return userObj;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('medipulse_token');
    localStorage.removeItem('medipulse_user');
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('medipulse_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to refresh user profile', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        demoLogin,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
