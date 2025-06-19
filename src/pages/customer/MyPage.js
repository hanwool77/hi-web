import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, List, ListItem, ListItemIcon,
  ListItemText, Avatar, Divider, Button
} from '@mui/material';
import { 
  Person, Edit, Settings, Assignment, ExitToApp, ChevronRight
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../components/common/Navigation';

const MyPage = () => {
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
      icon: <Person />,
      title: '프로필 수정',
      description: '닉네임, 개인정보 변경',
      onClick: () => navigate('/profile')
    },
    {
      icon: <Settings />,
      title: '취향 설정',
      description: '음식 취향 및 선호도 설정',
      onClick: () => navigate('/preferences')
    }
  ];

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          마이페이지
        </Typography>
      </Box>

      <Box className="content-area">
        {/* 프로필 카드 */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#2c3e50' }}>
              {user?.nickname?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {user?.nickname || '사용자'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.username}
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

      <Navigation />
    </Box>
  );
};

export default MyPage;
