//* src/pages/owner/StoreAnalytics.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  CircularProgress
} from '@mui/material';
import { ArrowBack, TrendingUp, Assessment } from '@mui/icons-material';
import { analyticsService } from '../../services/analyticsService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/Navigation';

const StoreAnalytics = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedStoreId) {
      loadAnalytics();
    }
  }, [selectedStoreId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getStoreAnalytics(selectedStoreId);
      setAnalytics(response.data);
    } catch (error) {
      console.error('분석 데이터 로드 실패:', error);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

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
            매장 분석
          </Typography>
          <Typography variant="body2">
            상세 분석 데이터
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {analytics ? (
          <Grid container spacing={2}>
            {/* 매출 분석 */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp sx={{ fontSize: 32, color: '#4caf50', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      매출 분석
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                          {analytics.totalRevenue?.toLocaleString() || 0}원
                        </Typography>
                        <Typography variant="caption">총 매출</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                          {analytics.monthlyRevenue?.toLocaleString() || 0}원
                        </Typography>
                        <Typography variant="caption">이번 달 매출</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* 주문 분석 */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Assessment sx={{ fontSize: 32, color: '#ff9800', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      주문 분석
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                          {analytics.totalOrders || 0}
                        </Typography>
                        <Typography variant="caption">총 주문</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                          {analytics.todayOrders || 0}
                        </Typography>
                        <Typography variant="caption">오늘 주문</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                          {analytics.averageOrderValue || 0}원
                        </Typography>
                        <Typography variant="caption">평균 주문금액</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Assessment sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                분석 데이터가 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                데이터가 수집되면 분석 결과가 표시됩니다
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default StoreAnalytics;