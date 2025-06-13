import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Grid,
  LinearProgress, Chip
} from '@mui/material';
import { ArrowBack, TrendingUp, Star, Comment } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import OwnerNavigation from '../../components/common/OwnerNavigation';

const StoreAnalytics = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [storeId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getStoreAnalytics(storeId);
      setAnalytics(response.data);
    } catch (error) {
      console.error('분석 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ p: 2 }}>
          <Typography>분석 데이터 로딩 중...</Typography>
        </Box>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box className="mobile-container">
        <Box sx={{ p: 2 }}>
          <Typography>분석 데이터를 불러올 수 없습니다.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            매장 분석
          </Typography>
          <Typography variant="body2">
            {analytics.storeName}
          </Typography>
        </Box>
      </Box>

      <Box className="content-area">
        {/* 주요 지표 */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  {analytics.totalReviews || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 리뷰 수
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  {analytics.averageRating?.toFixed(1) || '0.0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  평균 평점
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 감정 분석 */}
        {analytics.sentimentAnalysis && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📊 감정 분석
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">긍정 ({analytics.sentimentAnalysis.positive}%)</Typography>
                  <Chip label="긍정" color="success" size="small" />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={analytics.sentimentAnalysis.positive} 
                  color="success"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">중립 ({analytics.sentimentAnalysis.neutral}%)</Typography>
                  <Chip label="중립" color="default" size="small" />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={analytics.sentimentAnalysis.neutral} 
                  color="inherit"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">부정 ({analytics.sentimentAnalysis.negative}%)</Typography>
                  <Chip label="부정" color="error" size="small" />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={analytics.sentimentAnalysis.negative} 
                  color="error"
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* 리뷰 트렌드 */}
        {analytics.reviewTrend && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📈 리뷰 트렌드
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analytics.reviewTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2c3e50" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* AI 피드백 요약 */}
        {analytics.aiFeedbackSummary && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                🤖 AI 피드백 요약
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {analytics.aiFeedbackSummary.length > 100 
                  ? `${analytics.aiFeedbackSummary.substring(0, 100)}...`
                  : analytics.aiFeedbackSummary
                }
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/owner/stores/${storeId}/ai-feedback`)}
              >
                상세 피드백 보기
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 개선 영역 */}
        {analytics.improvementAreas && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                🎯 개선 필요 영역
              </Typography>
              {analytics.improvementAreas.map((area, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {area.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {area.description}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={area.severity} 
                    color={area.severity > 70 ? 'error' : area.severity > 40 ? 'warning' : 'success'}
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        )}
      </Box>

      <OwnerNavigation />
    </Box>
  );
};

export default StoreAnalytics;
