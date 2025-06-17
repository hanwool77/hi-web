import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requireOwner = false }) => {
  const { user, token, loading } = useAuth();

  // 로딩 중일 때
  if (loading) {
    return (
      <Box 
        className="mobile-container" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          로딩 중...
        </Typography>
      </Box>
    );
  }

  // 토큰이 없으면 로그인 페이지로
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 점주 권한이 필요한데 점주가 아니면 메인 페이지로
  if (requireOwner && user?.role !== 'OWNER') {
    return <Navigate to="/" replace />;
  }

  // 고객이 점주 페이지에 접근하려고 하면 메인 페이지로
  if (user?.role === 'USER' && window.location.pathname.startsWith('/owner')) {
  return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;