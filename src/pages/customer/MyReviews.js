import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent
} from '@mui/material';
import { ArrowBack, Assignment } from '@mui/icons-material';
import Navigation from '../../components/common/Navigation';

const MyReviews = () => {
  const navigate = useNavigate();

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate('/customer/mypage')} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          내 리뷰
        </Typography>
      </Box>

      <Box className="content-area">
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <CardContent>
            <Assignment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              추후 구현 예정입니다
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              내가 작성한 리뷰를 확인하고 관리할 수 있는 기능이
              <br />
              곧 추가될 예정입니다.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              현재 개발 중이니 조금만 기다려주세요! 🙏
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Navigation />
    </Box>
  );
};

export default MyReviews;