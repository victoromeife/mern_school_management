import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);
  const isTeacher = useMemo(() => user?.role === 'teacher', [user]);
  const isStudent = useMemo(() => user?.role === 'student', [user]);
  const isParent = useMemo(() => user?.role === 'parent', [user]);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    // Optionally update localStorage if you store user there
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      toast.success('Login successful!');
      navigate('/');
      return { success: true };
    } 
    catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setUser(user);
    toast.success('Registration successful! Please verify your email.');
    navigate('/verify-email');
    return { success: true };
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed');
    return { success: false, error: error.response?.data?.message };
  }
};

  const requestPasswordReset = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  };

  const resetPassword = async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  };

  const verifyEmail = async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  };

  const resendVerification = async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};