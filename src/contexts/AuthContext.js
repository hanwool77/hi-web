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
  const [token, setToken] = useState(sessionStorage.getItem('token')); // localStorage → sessionStorage
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

  // 토큰 유효성 검증 함수 추가
  const validateToken = async () => {
    if (!token) return false;
    
    try {
      // 간단한 API 호출로 토큰 유효성 검증
      await authApi.get('/api/members/profile');
      return true;
    } catch (error) {
      console.error('토큰 유효성 검증 실패:', error);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        // 토큰 유효성 검증 후 사용자 정보 로드
        const isValid = await validateToken();
        if (isValid) {
          await loadUserProfile();
        } else {
          // 유효하지 않은 토큰 제거
          logout();
        }
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
      
      // sessionStorage에 토큰과 사용자 정보 저장
      sessionStorage.setItem('token', accessToken);
      sessionStorage.setItem('memberId', memberId.toString());
      sessionStorage.setItem('role', role);
      
      setToken(accessToken);
      
      // 사용자 정보 설정 (프로필 로드 없이 바로 설정)
      setUser({
        memberId,
        role,
        username
      });
      
      return { success: true, role };
    } catch (error) {
      console.error('로그인 실패:', error);
      // 로그인 실패 시 모든 세션 정리
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
    // sessionStorage 정리
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('memberId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('selectedStoreId');
    
    // localStorage도 함께 정리 (혹시 남아있을 데이터)
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

  // 인증 상태 확인 함수 추가
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    isAuthenticated,
    loadUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};