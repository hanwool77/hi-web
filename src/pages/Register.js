import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert, Card, CardContent,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    phone: '',
    role: 'USER'
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

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate('/login')} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          회원가입
        </Typography>
      </Box>

      <Box className="content-area">
        <Card>
          <CardContent sx={{ p: 3 }}>
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
              
              <TextField
                fullWidth
                name="confirmPassword"
                label="비밀번호 확인"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                name="nickname"
                label="닉네임"
                value={formData.nickname}
                onChange={handleChange}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                name="phone"
                label="전화번호"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                required
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>회원 유형</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="회원 유형"
                >
                  <MenuItem value="USER">고객</MenuItem>
                  <MenuItem value="OWNER">점주</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, py: 1.5 }}
              >
                {loading ? '가입 중...' : '회원가입'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Register;
