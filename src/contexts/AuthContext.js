import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async () => {
    try {
      const response = await api.get('/api/members/profile');
      setUser(response.data);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // 토큰이 있으면 사용자 정보 로드
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      });
      
      const { accessToken, memberId, role } = response.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('memberId', memberId);
      localStorage.setItem('role', role);
      
      setToken(accessToken);
      
      // 사용자 정보 로드
      await loadUserProfile();
      
      return { success: true, role };
    } catch (error) {
      console.error('로그인 실패:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || '로그인에 실패했습니다.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('memberId');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
  };

  const register = async (userData) => {
    try {
      await api.post('/api/members/register', userData);
      return { success: true };
    } catch (error) {
      console.error('회원가입 실패:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || '회원가입에 실패했습니다.' 
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    loadUserProfile,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};