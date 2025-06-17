//* src/pages/owner/StoreAnalytics.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  CircularProgress,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { 
  ArrowBack, 
  TrendingUp, 
  Assessment,
  Psychology,
  Assignment,
  ShoppingCart,
  Star
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/Navigation';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StoreAnalytics = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
  const [analytics, setAnalytics] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [reviewAnalysis, setReviewAnalysis] = useState(null);
  const [aiFeedbackSummary, setAiFeedbackSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedStoreId) {
      loadAllData();
    }
  }, [selectedStoreId]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('분석 데이터 로딩 시작:', selectedStoreId);
      
      // 실제 백엔드 API 호출
      const [analyticsRes, statisticsRes, reviewRes, aiFeedbackRes] = await Promise.all([
        analyticsService.getStoreAnalytics(selectedStoreId),
        analyticsService.getStoreStatistics(selectedStoreId), // 기본값으로 한달 전부터 오늘까지
        analyticsService.getReviewAnalysis(selectedStoreId),
        analyticsService.getAIFeedbackSummary(selectedStoreId)
      ]);
      
      console.log('Analytics Response:', analyticsRes);
      console.log('Statistics Response:', statisticsRes);
      console.log('Review Analysis Response:', reviewRes);
      console.log('AI Feedback Summary Response:', aiFeedbackRes);
      
      setAnalytics(analyticsRes.data);
      setStatistics(statisticsRes.data);
      setReviewAnalysis(reviewRes.data);
      setAiFeedbackSummary(aiFeedbackRes.data);
      
    } catch (error) {
      console.error('분석 데이터 로드 실패:', error);
      setError('분석 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
        age: `${age}대`,
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>분석 데이터를 불러오는 중...</Typography>
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
            실시간 분석 데이터
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area" sx={{ p: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 주요 통계 요약 */}
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

        {/* 리뷰 분석 요약 */}
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
          </CardContent>
        </Card>

        {/* 감정분석 결과 그래프 */}
        {getSentimentChartData().length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star sx={{ fontSize: 24, color: '#ff5722', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  리뷰 감정 분석
                </Typography>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getSentimentChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getSentimentChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* 액션 버튼들 */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}
              onClick={handleAIFeedbackClick}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Psychology sx={{ fontSize: 32, color: '#9c27b0', mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  AI 피드백 상세
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}
              onClick={handleActionPlanClick}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 32, color: '#ff5722', mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  실행 계획
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default StoreAnalytics;