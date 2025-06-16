//* src/pages/owner/OwnerMainPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Button,
  LinearProgress,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Psychology, 
  Assignment,
  MoreHoriz,
  ShoppingCart,
  Star
} from '@mui/icons-material';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import { analyticsService } from '../../services/analyticsService';
import OwnerNavigation from '../../components/common/Navigation';

const OwnerMainPage = () => {
  const navigate = useNavigate();
  const { selectedStoreId, loading: storeLoading } = useSelectedStore();
  const [orderAnalytics, setOrderAnalytics] = useState(null);
  const [reviewAnalytics, setReviewAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedStoreId) {
      loadAnalyticsData();
    }
  }, [selectedStoreId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [orderData, reviewData] = await Promise.all([
        analyticsService.getOrderAnalytics(selectedStoreId),
        analyticsService.getReviewAnalytics(selectedStoreId)
      ]);
      setOrderAnalytics(orderData.data);
      setReviewAnalytics(reviewData.data);
    } catch (error) {
      console.error('분석 데이터 로드 실패:', error);
      setOrderAnalytics(null);
      setReviewAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: <Psychology sx={{ fontSize: 32, color: '#ff9800' }} />,
      title: 'AI 피드백',
      description: '더보기',
      action: () => navigate('/owner/ai-feedback')
    },
    {
      icon: <Assignment sx={{ fontSize: 32, color: '#9c27b0' }} />,
      title: '실행 계획',
      description: '더보기',
      action: () => navigate('/owner/action-plan/list')
    }
  ];

  // 매장 정보 로딩 중
  if (storeLoading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>매장 정보를 불러오는 중...</Typography>
        </Box>
        <OwnerNavigation />
      </Box>
    );
  }

  // 매장이 없는 경우
  if (!selectedStoreId) {
    return (
      <Box className="mobile-container">
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>등록된 매장이 없습니다</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/owner/store/register')}
          >
            매장 등록하기
          </Button>
        </Box>
        <OwnerNavigation />
      </Box>
    );
  }

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
        {/* 주문 데이터 분석 섹션 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShoppingCart sx={{ fontSize: 32, color: '#3f51b5', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                매장 내 주문데이터 분석
              </Typography>
            </Box>
            
            {loading ? (
              <LinearProgress />
            ) : orderAnalytics ? (
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {orderAnalytics.totalOrders || 0}
                    </Typography>
                    <Typography variant="caption">총 주문</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                      {orderAnalytics.todayOrders || 0}
                    </Typography>
                    <Typography variant="caption">오늘 주문</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                      {orderAnalytics.averageOrderValue || 0}원
                    </Typography>
                    <Typography variant="caption">평균 주문금액</Typography>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                주문 데이터가 없습니다
              </Typography>
            )}
            
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/owner/analytics')}
            >
              상세 분석 보기
            </Button>
          </CardContent>
        </Card>

        {/* 리뷰 분석 섹션 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Star sx={{ fontSize: 32, color: '#4caf50', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                리뷰 분석
              </Typography>
            </Box>
            
            {loading ? (
              <LinearProgress />
            ) : reviewAnalytics ? (
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {reviewAnalytics.averageRating || 0}
                    </Typography>
                    <Typography variant="caption">평균 평점</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                      {reviewAnalytics.totalReviews || 0}
                    </Typography>
                    <Typography variant="caption">총 리뷰</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                      {reviewAnalytics.positiveRate || 0}%
                    </Typography>
                    <Typography variant="caption">긍정 비율</Typography>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                리뷰 데이터가 없습니다
              </Typography>
            )}
            
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/owner/reviews')}
            >
              리뷰 관리하기
            </Button>
          </CardContent>
        </Card>

        <Divider sx={{ my: 2 }} />

        {/* AI 피드백 & 실행 계획 (더보기 버튼) */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          AI 기반 개선 제안
        </Typography>
        
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={6} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer', 
                  height: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
                onClick={action.action}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  {action.icon}
                  <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {action.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <Typography variant="body2" color="primary">
                      {action.description}
                    </Typography>
                    <MoreHoriz sx={{ fontSize: 16, color: 'primary.main', ml: 0.5 }} />
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

export default OwnerMainPage;