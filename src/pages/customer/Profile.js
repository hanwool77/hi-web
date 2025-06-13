import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Navigation from '../../components/common/Navigation';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loadUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    nickname: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || '',
        username: user.username || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitNickname = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put('/api/members/nickname', {
        nickname: formData.nickname
      });
      alert('닉네임이 변경되었습니다.');
      // 사용자 정보 다시 로드
      if (loadUserProfile) {
        await loadUserProfile();
      }
    } catch (error) {
      console.error('닉네임 변경 실패:', error);
      setError(error.response?.data?.message || '닉네임 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUsername = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put('/api/members/username', {
        username: formData.username
      });
      alert('아이디가 변경되었습니다.');
      // 사용자 정보 다시 로드
      if (loadUserProfile) {
        await loadUserProfile();
      }
    } catch (error) {
      console.error('아이디 변경 실패:', error);
      setError(error.response?.data?.message || '아이디 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate('/mypage')} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          프로필 수정
        </Typography>
      </Box>

      <Box className="content-area">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              닉네임 변경
            </Typography>
            <form onSubmit={handleSubmitNickname}>
              <TextField
                fullWidth
                name="nickname"
                label="닉네임"
                value={formData.nickname}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                닉네임 변경
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              아이디 변경
            </Typography>
            <form onSubmit={handleSubmitUsername}>
              <TextField
                fullWidth
                name="username"
                label="아이디"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                아이디 변경
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Navigation />
    </Box>
  );
};

export default Profile;
