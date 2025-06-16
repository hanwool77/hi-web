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
  Divider
} from '@mui/material';
import { 
  ArrowBack, 
  TrendingUp, 
  Assessment,
  Psychology,
  Assignment
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/Navigation';

const StoreAnalytics = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
  const [analytics, setAnalytics] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [reviewAnalysis, setReviewAnalysis] = useState(null);
  const [aiFeedbackSummary, setAiFeedbackSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedStoreId) {
      loadAllData();
    }
  }, [selectedStoreId]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      // 실제 백엔드 API 호출
      const [analyticsRes, statisticsRes, reviewRes, aiFeedbackRes] = await Promise.all([
        analyticsService.getStoreAnalytics(selectedStoreId),
        analyticsService.getStoreStatistics(selectedStoreId),
        analyticsService.getReviewAnalytics(selectedStoreId),
        analyticsService.getAIFeedbackSummary(selectedStoreId)
      ]);
      
      setAnalytics(analyticsRes.data);
      setStatistics(statisticsRes.data);
      setReviewAnalysis(reviewRes.data);
      setAiFeedbackSummary(aiFeedbackRes.data);
    } catch (error) {
      console.error('분석 데이터 로드 실패:', error);
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
        {/* 주문 통계 */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assessment sx={{ fontSize: 32, color: '#ff9800', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    주문 통계
                  </Typography>
                </Box>
                
                {/* 성별 분석 - 실제 API 데이터 사용 */}
                {statistics?.genderStats && (
                  <>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      고객 성별 분석
                    </Typography>
                    <Box sx={{ height: 200, mb: 3 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: '남성', value: statistics.genderStats.male, color: '#2196f3' },
                              { name: '여성', value: statistics.genderStats.female, color: '#e91e63' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                          >
                            <Cell fill="#2196f3" />
                            <Cell fill="#e91e63" />
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </>
                )}

                <Divider sx={{ my: 2 }} />

                {/* 시간대별 주문량 - 실제 API 데이터 사용 */}
                {statistics?.timeStats && (
                  <>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      시간대별 주문량
                    </Typography>
                    <Box sx={{ height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statistics.timeStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="orders" fill="#4caf50" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* AI 피드백 카드 - 클릭 가능 */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s'
                }
              }}
              onClick={handleAIFeedbackClick}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Psychology sx={{ fontSize: 32, color: '#9c27b0', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    AI 피드백
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {aiFeedbackSummary?.summary || 'AI 분석 데이터를 불러오는 중입니다.'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {aiFeedbackSummary?.summary && aiFeedbackSummary.summary.length > 50 
                    ? `${aiFeedbackSummary.summary.substring(0, 50)}...`
                    : aiFeedbackSummary?.summary || '분석 결과가 없습니다.'
                  }
                </Typography>
                <Typography variant="caption" color="primary">
                  📱 클릭하여 상세 내용 확인
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 실행계획 카드 - 클릭 가능 */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s'
                }
              }}
              onClick={handleActionPlanClick}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assignment sx={{ fontSize: 32, color: '#4caf50', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    실행계획
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  AI 피드백 기반으로 생성된 개선 실행계획입니다.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {aiFeedbackSummary?.actionPlansPreview ? (
                    aiFeedbackSummary.actionPlansPreview.length > 50 
                      ? `${aiFeedbackSummary.actionPlansPreview.substring(0, 50)}...`
                      : aiFeedbackSummary.actionPlansPreview
                  ) : '실행계획이 없습니다. AI 피드백을 먼저 생성해주세요.'}
                </Typography>
                <Typography variant="caption" color="primary">
                  📱 클릭하여 전체 계획 확인
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 리뷰 분석 */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ fontSize: 32, color: '#4caf50', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    리뷰 분석
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {reviewAnalysis?.analysisText || '리뷰 분석 데이터를 불러오는 중입니다.'}
                </Typography>
                
                {reviewAnalysis?.positivePoints && (
                  <>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      좋았던 점 TOP 5
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {reviewAnalysis.positivePoints.slice(0, 5).map((point, index) => 
                        `${point.category} ${point.percentage}%`
                      ).join(' • ')}
                    </Typography>
                  </>
                )}
                
                {reviewAnalysis?.negativePoints && (
                  <>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      나빴던 점 TOP 5  
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reviewAnalysis.negativePoints.slice(0, 5).map((point, index) => 
                        `${point.category} ${point.percentage}%`
                      ).join(' • ')}
                    </Typography>
                  </>
                )}
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