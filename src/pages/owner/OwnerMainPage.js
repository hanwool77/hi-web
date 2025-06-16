//* src/pages/owner/OwnerMainPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Analytics, TrendingUp, Psychology, Assignment } from '@mui/icons-material';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/Navigation';

const OwnerMainPage = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();

  const analysisMenus = [
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#3f51b5' }} />,
      title: '매장 내 주문데이터 분석',
      description: '주문 패턴과 매출 트렌드 분석',
      action: () => navigate(`/owner/stores/${selectedStoreId}/analytics`)
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#4caf50' }} />,
      title: '리뷰 분석',
      description: '고객 리뷰 감정 분석 및 트렌드',
      action: () => navigate(`/owner/stores/${selectedStoreId}/reviews`)
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: '#ff9800' }} />,
      title: 'AI 피드백',
      description: 'AI 기반 매장 운영 개선 제안',
      action: () => navigate(`/owner/stores/${selectedStoreId}/ai-feedback`)
    },
    {
      icon: <Assignment sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: '실행 계획',
      description: '저장된 실행 계획 목록 관리',
      action: () => navigate('/owner/action-plan/list')
    }
  ];

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          분석 대시보드
        </Typography>
        <Typography variant="body2">
          AI 기반 매장 분석 및 개선 방안
        </Typography>
      </Box>
      
      <Box className="content-area">
        {/* 분석 메뉴 */}
        <Grid container spacing={2}>
          {analysisMenus.map((menu, index) => (
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

export default OwnerMainPage;