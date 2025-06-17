//* src/pages/owner/StoreAnalytics.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Button,
  LinearProgress,
  Divider,
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import { 
  Psychology, 
  Assignment,
  ShoppingCart,
  Star,
  TrendingUp,
  Assessment
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import { analyticsService } from '../../services/analyticsService';
import OwnerHeader from '../../components/common/OwnerHeader';
import OwnerNavigation from '../../components/common/Navigation';

const StoreAnalytics = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { selectedStoreId, selectedStore, selectStore } = useSelectedStore();
  const [statistics, setStatistics] = useState(null);
  const [reviewAnalysis, setReviewAnalysis] = useState(null);
  const [aiFeedbackSummary, setAiFeedbackSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalyticsData = useCallback(async (storeId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('분석 데이터 로딩 시작:', storeId);
      
      const [statisticsResponse, reviewResponse, feedbackResponse] = await Promise.allSettled([
        analyticsService.getStoreStatistics(storeId),
        analyticsService.getReviewAnalysis(storeId),
        analyticsService.getAIFeedbackSummary(storeId)
      ]);

      if (statisticsResponse.status === 'fulfilled') {
        setStatistics(statisticsResponse.value.data);
        console.log('Statistics Response:', statisticsResponse.value);
      } else {
        console.error('Statistics 로드 실패:', statisticsResponse.reason);
      }

      if (reviewResponse.status === 'fulfilled') {
        setReviewAnalysis(reviewResponse.value.data);
        console.log('Review Analysis Response:', reviewResponse.value);
      } else {
        console.error('Review Analysis 로드 실패:', reviewResponse.reason);
      }

      if (feedbackResponse.status === 'fulfilled') {
        setAiFeedbackSummary(feedbackResponse.value.data);
        console.log('AI Feedback Summary Response:', feedbackResponse.value);
      } else {
        console.error('AI Feedback Summary 로드 실패:', feedbackResponse.reason);
      }

    } catch (error) {
      console.error('분석 데이터 로드 실패:', error);
      setError('분석 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // URL 파라미터가 변경되면 selectedStoreId 동기화
  useEffect(() => {
    if (storeId) {
      const urlStoreId = parseInt(storeId);
      if (selectedStoreId !== urlStoreId) {
        selectStore(urlStoreId);
      }
    }
  }, [storeId]);

  // selectedStoreId 변경 시 데이터 로드 및 URL 동기화
  useEffect(() => {
    if (selectedStoreId) {
      // URL과 selectedStoreId가 다르면 URL 업데이트
      const currentUrlStoreId = storeId ? parseInt(storeId) : null;
      if (currentUrlStoreId !== selectedStoreId) {
        navigate(`/owner/analytics/${selectedStoreId}`, { replace: true });
      }
      // 데이터 로드
      loadAnalyticsData(selectedStoreId);
    }
  }, [selectedStoreId, loadAnalyticsData]); // 의존성 없음

  // AI 피드백 카드 클릭 핸들러
  const handleAIFeedbackClick = () => {
    navigate('/owner/ai-feedback/detail');
  };

  // 실행계획 카드 클릭 핸들러  
  const handleActionPlanClick = () => {
    navigate('/owner/action-plan/list');
  };

  // 숫자 포맷팅
  const formatNumber = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  // 주문 통계 차트 데이터 변환
  const getOrderChartData = () => {
    if (!statistics) return [];
    
    // 백엔드에서 받은 실제 데이터 구조에 맞춰 변환
    if (statistics.timeStats) {
      return Object.entries(statistics.timeStats).map(([hour, count]) => ({
        time: `${hour}시`,
        orders: count
      }));
    }
    
    // customerAgeDistribution이 있는 경우
    if (statistics.customerAgeDistribution) {
      return Object.entries(statistics.customerAgeDistribution).map(([age, count]) => ({
        age: `${age}`,
        count: count
      }));
    }
    
    return [];
  };

  // 매출 통계 차트 데이터 변환
  const getRevenueChartData = () => {
    if (!statistics) return [];
    
    // 일별 매출 데이터가 있는 경우
    if (statistics.dailyRevenue) {
      return Object.entries(statistics.dailyRevenue).map(([date, revenue]) => ({
        date: date,
        revenue: revenue
      }));
    }
    
    return [];
  };

  // 감정 분석 차트 데이터
  const getSentimentChartData = () => {
    if (!reviewAnalysis) return [];
    
    const data = [];
    if (reviewAnalysis.positiveCount) {
      data.push({ name: '긍정', value: reviewAnalysis.positiveCount, color: '#00C49F' });
    }
    if (reviewAnalysis.neutralCount) {
      data.push({ name: '중립', value: reviewAnalysis.neutralCount, color: '#FFBB28' });
    }
    if (reviewAnalysis.negativeCount) {
      data.push({ name: '부정', value: reviewAnalysis.negativeCount, color: '#FF8042' });
    }
    
    return data;
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <OwnerHeader 
          title="매장 분석"
          subtitle="데이터 로딩 중..."
          showStoreSelector={true}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
        <OwnerNavigation />
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      <OwnerHeader 
        title="매장 분석"
        subtitle={selectedStore ? `${selectedStore.name} 상세 분석` : '분석 데이터'}
        showStoreSelector={true}
        showBackButton={false}
      />

      <Box className="content-area">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 주요 지표 카드 */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ShoppingCart sx={{ fontSize: 32, color: '#2196f3', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {formatNumber(statistics?.totalOrders || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 주문 수
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {formatNumber(statistics?.totalRevenue || 0)}원
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 매출
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 주문 통계 그래프 */}
        {getOrderChartData().length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ fontSize: 24, color: '#ff9800', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  주문 통계
                </Typography>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getOrderChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={getOrderChartData()[0]?.time ? 'time' : 'age'} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatNumber(value), getOrderChartData()[0]?.time ? '주문 수' : '고객 수']}
                    />
                    <Bar dataKey={getOrderChartData()[0]?.orders ? 'orders' : 'count'} fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* 매출 추이 그래프 */}
        {getRevenueChartData().length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 24, color: '#4caf50', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  매출 추이
                </Typography>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getRevenueChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${formatNumber(value)}원`, '매출']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* 리뷰 감정 분석 */}
        {getSentimentChartData().length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star sx={{ fontSize: 24, color: '#ffc107', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  리뷰 감정 분석
                </Typography>
              </Box>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getSentimentChartData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getSentimentChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatNumber(value), '개']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* AI 피드백 요약 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Psychology sx={{ fontSize: 24, color: '#9c27b0', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                AI 피드백 요약
              </Typography>
            </Box>
            
            {aiFeedbackSummary ? (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {aiFeedbackSummary.summary || '분석 중입니다...'}
                </Typography>
                
                {aiFeedbackSummary.sentiment && (
                  <Chip 
                    label={`전체 감정: ${aiFeedbackSummary.sentiment}`}
                    color={aiFeedbackSummary.sentiment === 'POSITIVE' ? 'success' : 'default'}
                    sx={{ mr: 1 }}
                  />
                )}
                
                {aiFeedbackSummary.reviewCount && (
                  <Chip 
                    label={`분석 리뷰: ${formatNumber(aiFeedbackSummary.reviewCount)}개`}
                    variant="outlined"
                  />
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                AI 피드백 데이터가 없습니다.
              </Typography>
            )}
            
            <Button 
              variant="outlined" 
              onClick={handleAIFeedbackClick}
              sx={{ mt: 2 }}
              fullWidth
            >
              상세 피드백 보기
            </Button>
          </CardContent>
        </Card>

        {/* 실행 계획 요약 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment sx={{ fontSize: 24, color: '#ff5722', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                실행 계획
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              AI 피드백을 바탕으로 생성된 실행 계획을 확인하세요.
            </Typography>
            
            <Button 
              variant="outlined" 
              onClick={handleActionPlanClick}
              fullWidth
            >
              실행 계획 관리
            </Button>
          </CardContent>
        </Card>
      </Box>

      <OwnerNavigation />
    </Box>
  );
};

export default StoreAnalytics;