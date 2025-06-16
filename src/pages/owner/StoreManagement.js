//* src/pages/owner/StoreManagement.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { 
  Restaurant, 
  RateReview, 
  Analytics, 
  Link, 
  Settings,
  ArrowBack 
} from '@mui/icons-material';
import OwnerNavigation from '../../components/common/Navigation';

const StoreManagement = () => {
  const navigate = useNavigate();

  const managementMenus = [
    {
      icon: <Restaurant sx={{ fontSize: 40, color: '#ff5722' }} />,
      title: '메뉴 관리',
      description: '메뉴 등록, 수정, 삭제 관리',
      action: () => navigate('/owner/menu')
    },
    {
      icon: <RateReview sx={{ fontSize: 40, color: '#2196f3' }} />,
      title: '내 매장 리뷰',
      description: '고객 리뷰 조회 및 답글 관리',
      action: () => navigate('/owner/reviews')
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#4caf50' }} />,
      title: '매장 분석',
      description: 'AI 피드백 및 통계 분석',
      action: () => navigate('/owner/analytics')
    },
    {
      icon: <Link sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: '외부 플랫폼 연동',
      description: '네이버, 카카오, 구글 연동 관리',
      action: () => navigate('/owner/external')
    },
    {
      icon: <Settings sx={{ fontSize: 40, color: '#607d8b' }} />,
      title: '매장 정보 관리',
      description: '기본 정보, 운영시간 등',
      action: () => navigate('/owner/info')
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
            매장 관리
          </Typography>
          <Typography variant="body2">
            매장 운영에 필요한 모든 기능
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {/* 매장 관리 메뉴 */}
        <Grid container spacing={2}>
          {managementMenus.map((menu, index) => (
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

export default StoreManagement;