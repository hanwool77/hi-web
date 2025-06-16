//* src/pages/owner/ProfileEdit.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  TextField,
  Button,
  Grid,
  Divider
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { memberApi } from '../../services/api';
import OwnerNavigation from '../../components/common/Navigation';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: '',
    nickname: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await memberApi.get('/api/members/profile');
      setProfile(prev => ({
        ...prev,
        username: response.data.data.username,
        nickname: response.data.data.nickname,
        phone: response.data.data.phone
      }));
    } catch (error) {
      console.error('프로필 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await memberApi.put('/api/members/profile', {
        nickname: profile.nickname,
        phone: profile.phone
      });
      alert('프로필이 저장되었습니다.');
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert('프로필 저장에 실패했습니다.');
    }
  };

  const handleChangePassword = async () => {
    if (profile.newPassword !== profile.confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await memberApi.put('/api/members/password', {
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword
      });
      alert('비밀번호가 변경되었습니다.');
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ 
        p: 2, 
        bgcolor: '#2c3e50', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <ArrowBack 
          onClick={() => navigate('/owner/mypage')}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            회원정보 수정
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {/* 기본 정보 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              기본 정보
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="아이디"
                  value={profile.username}
                  disabled
                  helperText="아이디는 변경할 수 없습니다"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="닉네임"
                  value={profile.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="전화번호"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </Grid>
            </Grid>
            
            <Button
              fullWidth
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveProfile}
              sx={{ mt: 2 }}
            >
              기본 정보 저장
            </Button>
          </CardContent>
        </Card>

        {/* 비밀번호 변경 */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              비밀번호 변경
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="현재 비밀번호"
                  type="password"
                  value={profile.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="새 비밀번호"
                  type="password"
                  value={profile.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="새 비밀번호 확인"
                  type="password"
                  value={profile.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
              </Grid>
            </Grid>
            
            <Button
              fullWidth
              variant="outlined"
              onClick={handleChangePassword}
              sx={{ mt: 2 }}
              disabled={!profile.currentPassword || !profile.newPassword || !profile.confirmPassword}
            >
              비밀번호 변경
            </Button>
          </CardContent>
        </Card>
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default ProfileEdit;