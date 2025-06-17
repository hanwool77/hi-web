//* src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const { user, login, loading: authLoading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 이미 인증된 사용자 체크 및 리다이렉트
  useEffect(() => {
  if (!authLoading && isAuthenticated() && user) {
    if (user.role === 'OWNER') {
      navigate('/owner', { replace: true });
    } else {
      navigate('/customer', { replace: true }); // ✅ 수정
    }
  }
  }, [authLoading, isAuthenticated, user, navigate]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 에러 메시지 초기화
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
      // ✅ 로그인 성공 시 역할에 따른 리다이렉트
        if (result.role === 'OWNER') {
          navigate('/owner', { replace: true });
        } else {
          navigate('/customer', { replace: true }); // ✅ 수정
        }
      } else {
        setError(result.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error('로그인 처리 중 오류:', err);
      setError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증 상태 로딩 중일 때 표시
  if (authLoading) {
    return (
      <Box className="mobile-container" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  // 이미 인증된 사용자라면 렌더링하지 않음 (리다이렉트 처리됨)
  if (isAuthenticated()) {
    return null;
  }

  return (
    <Box className="mobile-container">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        p: 3 
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
            하이오더
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="username"
              label="아이디"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            
            <TextField
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !formData.username || !formData.password}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button onClick={() => navigate('/register')} disabled={loading}>
              회원가입
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;