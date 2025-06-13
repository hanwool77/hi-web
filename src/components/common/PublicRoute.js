import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  // 로딩 중이면 그대로 렌더링
  if (loading) {
    return children;
  }

  // 이미 로그인된 상태라면 역할에 따라 리다이렉트
  if (token && user) {
    if (user.role === 'OWNER') {
      return <Navigate to="/owner" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute;