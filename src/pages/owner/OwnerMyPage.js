import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, List, ListItem, ListItemIcon,
  ListItemText, Avatar, Divider
} from '@mui/material';
import { 
  Add, Store, Subscriptions, Person, ExitToApp, ChevronRight
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import OwnerNavigation from '../../components/common/OwnerNavigation';

const OwnerMyPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/login');
    }
  };

  const menuItems = [
    {
      icon: <Add />,
      title: '매장 등록',
      description: '새로운 매장 등록하기',
      onClick: () => navigate('/owner/store/register')
    },
    {
      icon: <Store />,
      title: '내 매장 목록',
      description: '등록된 매장 목록 조회',
      onClick: () => navigate('/owner/stores')
    },
    {
      icon: <Subscriptions />,
      title: '구독 관리',
      description: '구독 플랜 확인 및 변경',
      onClick: () => navigate('/owner/subscription')
    },
    {
      icon: <Person />,
      title: '회원정보 수정',
      description: '닉네임, 아이디, 비밀번호 변경',
      onClick: () => navigate('/profile')
    }
  ];

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          점주 마이페이지
        </Typography>
      </Box>

      <Box className="content-area">
        {/* 프로필 카드 */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#2c3e50' }}>
              {user?.nickname?.charAt(0) || 'O'}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {user?.nickname || '점주'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              사업자
            </Typography>
          </CardContent>
        </Card>

        {/* 메뉴 리스트 */}
        <Card>
          <List>
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem button onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    secondary={item.description}
                  />
                  <ChevronRight />
                </ListItem>
                {index < menuItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="로그아웃" />
            </ListItem>
          </List>
        </Card>
      </Box>

      <OwnerNavigation />
    </Box>
  );
};

export default OwnerMyPage;