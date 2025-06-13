import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api'; // 변경된 부분

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
      const response = await authApi.get('/api/members/profile'); // authApi 사용
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
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await authApi.post('/api/auth/login', {
        username,
        password
      });
      
      const { accessToken, memberId, role } = response.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('memberId', memberId);
      localStorage.setItem('role', role);
      
      setToken(accessToken);
      
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
      await authApi.post('/api/members/register', userData);
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