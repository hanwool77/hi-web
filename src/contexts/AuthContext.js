//* src/contexts/AuthContext.js (수정된 버전)
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
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authApi.get('/api/members/profile');
      
      // ✅ 기존 user 정보와 서버 응답을 병합 (role 정보 보존)
      setUser(prevUser => ({
        ...prevUser, // 기존 정보 유지 (특히 role)
        ...response.data, // 서버에서 받은 새 정보로 업데이트
        role: prevUser?.role || response.data.role // role은 기존 값 우선 사용
      }));
      
      return true;
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async () => {
    if (!token) return false;
    
    try {
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
        // ✅ sessionStorage에서 저장된 role 정보 먼저 복원
        const savedRole = sessionStorage.getItem('role');
        const savedMemberId = sessionStorage.getItem('memberId');
        
        if (savedRole && savedMemberId) {
          // 먼저 저장된 정보로 user 설정
          setUser({
            memberId: parseInt(savedMemberId),
            role: savedRole,
            username: '' // 나중에 loadUserProfile에서 업데이트
          });
        }
        
        const isValid = await validateToken();
        if (isValid) {
          await loadUserProfile();
        } else {
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
      
      sessionStorage.setItem('token', accessToken);
      sessionStorage.setItem('memberId', memberId.toString());
      sessionStorage.setItem('role', role);
      
      setToken(accessToken);
      
      // ✅ 사용자 정보 설정
      setUser({
        memberId,
        role,
        username
      });
      
      // ✅ loadUserProfile 호출하지 않음 (role 덮어쓰기 방지)
      setLoading(false);
      
      return { success: true, role };
    } catch (error) {
      console.error('로그인 실패:', error);
      logout();
      return { 
        success: false, 
        message: error.response?.data?.message || '로그인에 실패했습니다.'
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('memberId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('selectedStoreId');
    
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