//* src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

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
      setLoading(true);
      const response = await authApi.get('/api/members/profile');
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      // 프로필 로드 실패 시 토큰 제거
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        // 토큰이 있으면 사용자 정보 로드 시도
        await loadUserProfile();
      } else {
        setLoading(false);
      }
    };
    
    initAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      setLoading(true);
      
      const response = await authApi.post('/api/auth/login', {
        username,
        password
      });
      
      const { accessToken, memberId, role } = response.data;
      
      // 토큰과 사용자 정보 저장
      localStorage.setItem('token', accessToken);
      localStorage.setItem('memberId', memberId.toString());
      localStorage.setItem('role', role);
      
      setToken(accessToken);
      
      // 사용자 프로필 로드
      const profileLoaded = await loadUserProfile();
      
      if (profileLoaded) {
        return { success: true, role };
      } else {
        throw new Error('사용자 정보 로드 실패');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      // 로그인 실패 시 모든 로컬 스토리지 정리
      logout();
      return { 
        success: false, 
        message: error.response?.data?.message || '로그인에 실패했습니다.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('memberId');
    localStorage.removeItem('role');
    localStorage.removeItem('selectedStoreId');
    setToken(null);
    setUser(null);
    setLoading(false);
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
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};