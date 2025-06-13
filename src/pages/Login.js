import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert,
  Card, CardContent, Link
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      // 역할에 따라 다른 페이지로 이동
      if (result.role === 'OWNER') {
        navigate('/owner');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold', color: '#2c3e50' }}>
          🍽️ 하이오더
        </Typography>
        
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
              로그인
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
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 2, mb: 2, py: 1.5 }}
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </form>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link onClick={() => navigate('/register')} sx={{ cursor: 'pointer' }}>
                회원가입
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
