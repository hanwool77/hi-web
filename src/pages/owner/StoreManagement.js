import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Grid,
  Avatar, Chip
} from '@mui/material';
import { 
  ArrowBack, Analytics, Assignment, Link, Settings,
  TrendingUp, People, Star, Comment
} from '@mui/icons-material';
import { storeService } from '../../services/storeService';
import OwnerNavigation from '../../components/common/OwnerNavigation';

const StoreManagement = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoreDetail();
  }, [storeId]);

  const loadStoreDetail = async () => {
    try {
      setLoading(true);
      const response = await storeService.getStoreDetail(storeId);
      setStore(response.data);
    } catch (error) {
      console.error('매장 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const managementMenus = [
    {
      icon: <Analytics />,
      title: '매장 분석',
      description: 'AI 피드백 및 통계 분석',
      color: '#3f51b5',
      action: () => navigate(`/owner/stores/${storeId}/analytics`)
    },
    {
      icon: <Assignment />,
      title: 'AI 피드백',
      description: '상세 AI 분석 결과',
      color: '#9c27b0',
      action: () => navigate(`/owner/stores/${storeId}/ai-feedback`)
    },
    {
      icon: <TrendingUp />,
      title: '실행 계획',
      description: '개선 실행 계획 관리',
      color: '#f57c00',
      action: () => navigate(`/owner/stores/${storeId}/action-plan`)
    },
    {
      icon: <Link />,
      title: '외부 플랫폼 연동',
      description: '네이버, 카카오, 구글 연동',
      color: '#388e3c',
      action: () => navigate('/owner/external')
    },
    {
      icon: <Settings />,
      title: '매장 정보 수정',
      description: '기본 정보, 운영시간 등',
      color: '#455a64',
      action: () => navigate(`/owner/stores/${storeId}/edit`)
    }
  ];

  if (loading || !store) {
    return (
      <Box className="mobile-container">
        <Box sx={{ p: 2 }}>
          <Typography>로딩 중...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate('/owner')} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          매장 관리
        </Typography>
      </Box>
      
      <Box className="content-area">
        {/* 매장 정보 카드 */}
        <Card sx={{ mb: 3 }}>
          <Box
            component="img"
            sx={{ width: '100%', height: 150, objectFit: 'cover' }}
            src={store.image || '/images/store-default.jpg'}
            alt={store.name}
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {store.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              📍 {store.address}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              📞 {store.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              🕒 {store.operatingHours}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e74c3c' }}>
                  {store.rating?.toFixed(1) || '0.0'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  평균 평점
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3498db' }}>
                  {store.reviewCount?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  총 리뷰
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                  {store.monthlyVisitors?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  월 방문자
                </Typography>
              </Box>
            </Box>

            <Chip 
              label={store.status === 'ACTIVE' ? '운영중' : '휴업'} 
              color={store.status === 'ACTIVE' ? 'success' : 'default'}
              size="small"
            />
          </CardContent>
        </Card>

        {/* 관리 메뉴 */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          관리 메뉴
        </Typography>
        <Grid container spacing={2}>
          {managementMenus.map((menu, index) => (
            <Grid item xs={12} key={index}>
              <Card 
                onClick={menu.action} 
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        bgcolor: menu.color, 
                        color: 'white', 
                        p: 1, 
                        borderRadius: 1, 
                        mr: 2 
                      }}
                    >
                      {menu.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {menu.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {menu.description}
                      </Typography>
                    </Box>
                  </Box>
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