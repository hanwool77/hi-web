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
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Psychology, 
  Assignment,
  ShoppingCart,
  Star,
  TrendingUp,
  Assessment
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import { analyticsService } from '../../services/analyticsService';
import OwnerNavigation from '../../components/common/Navigation';

const OwnerMainPage = () => {
  const navigate = useNavigate();
  const { selectedStoreId, loading: storeLoading } = useSelectedStore();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedStoreId) {
      loadAnalyticsData();
    }
  }, [selectedStoreId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // 주문 통계와 리뷰 분석 데이터를 로드
      const response = await analyticsService.getStoreAnalytics(selectedStoreId);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('분석 데이터 로드 실패:', error);
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  };

  // AI 피드백 버튼 클릭 핸들러
  const handleAIFeedbackClick = () => {
    navigate('/owner/ai-feedback');
  };

  // 실행 계획 버튼 클릭 핸들러
  const handleActionPlanClick = () => {
    navigate('/owner/action-plan/list');
  };

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
          <Typography variant="h6">매장을 선택해주세요</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/owner/stores')}
          >
            매장 관리로 이동
          </Button>
        </Box>
        <OwnerNavigation />
      </Box>
    );
  }

  // 샘플 차트 데이터 (실제로는 analyticsData에서 가져옴)
  const genderData = [
    { name: '남성', value: 60, color: '#2196f3' },
    { name: '여성', value: 40, color: '#ff4081' }
  ];

  const ageData = [
    { name: '20대', value: 23, male: 23, female: 35 },
    { name: '30대', value: 45, male: 45, female: 40 },
    { name: '40대', value: 20, male: 20, female: 15 },
    { name: '50대+', value: 12, male: 12, female: 10 }
  ];

  const hourlyOrders = [
    { time: '09:00', orders: 5 },
    { time: '12:00', orders: 25 },
    { time: '15:00', orders: 12 },
    { time: '18:00', orders: 30 },
    { time: '21:00', orders: 18 }
  ];

  const topMenus = [
    { name: '김치찌개', orders: 45, percentage: 25 },
    { name: '불고기', orders: 38, percentage: 21 },
    { name: '비빔밥', orders: 32, percentage: 18 },
    { name: '제육볶음', orders: 28, percentage: 16 },
    { name: '된장찌개', orders: 24, percentage: 13 }
  ];

  const positivePoints = ['빠른 서비스', '맛', '가성비', '친절한 직원', '깨끗한 매장'];
  const negativePoints = ['대기시간', '매장 청결', '음식 온도', '주차 공간'];

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
      
      <Box sx={{ p: 2, pb: 10, bgcolor: '#f5f5f5' }}>
        {/* 1. 주문 통계 시각화 섹션 - 상세 내용 표시 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShoppingCart sx={{ fontSize: 28, color: '#3f51b5', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                📊 주문 통계 시각화
              </Typography>
            </Box>
            
            {loading ? (
              <LinearProgress />
            ) : (
              <>
                {/* 성별/연령대 차트 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 1 }}>
                      성별 분포
                    </Typography>
                    <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie
                          data={genderData}
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={40}
                          dataKey="value"
                        >
                          {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 1 }}>
                      연령대 분포
                    </Typography>
                    <Box sx={{ fontSize: '12px' }}>
                      {ageData.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <span>{item.name}</span>
                          <span>남:{item.male}% 여:{item.female}%</span>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>

                {/* 시간대별 주문량 */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  시간대별 주문량
                </Typography>
                <Box sx={{ height: 150, mb: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyOrders}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#f39c12" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                {/* 인기 메뉴 TOP5 */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  인기 메뉴 TOP5
                </Typography>
                {topMenus.slice(0, 3).map((menu, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">
                        {index + 1}. {menu.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {menu.orders}건 ({menu.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={menu.percentage} 
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* 2. 리뷰 분석 섹션 - 상세 내용 표시 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Star sx={{ fontSize: 28, color: '#ff9800', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                📝 리뷰 분석
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              최근 30일 • 총 47개 리뷰
            </Typography>
            
            <Box sx={{ p: 2, bgcolor: '#e8f5e8', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#27ae60', mb: 1 }}>
                😊 좋은 점
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {positivePoints.slice(0, 3).map((point, index) => (
                  <Chip
                    key={index}
                    label={`${point} (${18 - index * 3}%)`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ p: 2, bgcolor: '#fdf2f2', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e74c3c', mb: 1 }}>
                😔 아쉬운 점
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {negativePoints.slice(0, 2).map((point, index) => (
                  <Chip
                    key={index}
                    label={`${point} (${12 - index * 4}%)`}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 3. AI 피드백 섹션 - 버튼만 표시 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Psychology sx={{ fontSize: 28, color: '#9c27b0', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                🤖 AI 피드백
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              AI가 고객 리뷰를 분석하여 매장 개선 방안을 제안합니다
            </Typography>
            
            <Button
              fullWidth
              variant="contained"
              startIcon={<Psychology />}
              onClick={handleAIFeedbackClick}
              sx={{ 
                bgcolor: '#9c27b0',
                '&:hover': { bgcolor: '#7b1fa2' }
              }}
            >
              AI 피드백 보기
            </Button>
          </CardContent>
        </Card>

        {/* 4. 실행 계획 섹션 - 버튼만 표시 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment sx={{ fontSize: 28, color: '#4caf50', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                📋 실행 계획
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              AI 피드백을 기반으로 한 구체적인 실행 계획을 확인하고 관리하세요
            </Typography>
            
            <Button
              fullWidth
              variant="contained"
              startIcon={<Assignment />}
              onClick={handleActionPlanClick}
              sx={{ 
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#388e3c' }
              }}
            >
              실행 계획 보기
            </Button>
          </CardContent>
        </Card>
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default OwnerMainPage;