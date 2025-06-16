//* src/pages/owner/OwnerMyPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { 
  AddBusiness, 
  Store, 
  Subscriptions, 
  AccountCircle, 
  Logout,
  ArrowBack 
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import OwnerNavigation from '../../components/common/Navigation';

const OwnerMyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const myPageMenus = [
    {
      icon: <AddBusiness sx={{ fontSize: 40, color: '#4caf50' }} />,
      title: '매장 등록',
      description: '새로운 매장 정보 등록',
      action: () => navigate('/owner/store/register')
    },
    {
      icon: <Store sx={{ fontSize: 40, color: '#2196f3' }} />,
      title: '내 매장 목록',
      description: '등록된 매장 목록 관리',
      action: () => navigate('/owner/stores')
    },
    {
      icon: <Subscriptions sx={{ fontSize: 40, color: '#ff9800' }} />,
      title: '구독 관리',
      description: '구독 플랜 및 결제 관리',
      action: () => navigate('/owner/subscription')
    },
    {
      icon: <AccountCircle sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: '회원정보 수정',
      description: '개인정보 및 계정 설정',
      action: () => navigate('/owner/ProfileEdit')
    },
    {
      icon: <Logout sx={{ fontSize: 40, color: '#f44336' }} />,
      title: '로그아웃',
      description: '계정에서 로그아웃',
      action: handleLogout
    }
  ];

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
          onClick={() => navigate('/owner')}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            마이페이지
          </Typography>
          <Typography variant="body2">
            계정 및 매장 정보 관리
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {/* 마이페이지 메뉴 */}
        <Grid container spacing={2}>
          {myPageMenus.map((menu, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer', 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
                onClick={menu.action}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  {menu.icon}
                  <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    {menu.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {menu.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default OwnerMyPage;