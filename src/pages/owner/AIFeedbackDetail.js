//* src/pages/owner/AIFeedbackDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  CircularProgress,
  Chip,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  ArrowBack, 
  Psychology,
  TrendingUp,
  TrendingDown,
  Star,
  Assessment
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/Navigation';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#8884D8'];

const AIFeedbackDetail = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
  const [aiFeedback, setAiFeedback] = useState(null);
  const [reviewAnalysis, setReviewAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedStoreId) {
      loadAIFeedbackData();
    }
  }, [selectedStoreId]);

  const loadAIFeedbackData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('AI 피드백 상세 데이터 로딩 시작:', selectedStoreId);
      
      // 실제 백엔드 API 호출
      const [feedbackRes, analysisRes] = await Promise.all([
        analyticsService.getAIFeedbackDetail(selectedStoreId),
        analyticsService.getReviewAnalysis(selectedStoreId)
      ]);
      
      console.log('AI Feedback Detail Response:', feedbackRes);
      console.log('Review Analysis Response:', analysisRes);
      
      setAiFeedback(feedbackRes.data);
      setReviewAnalysis(analysisRes.data);
      
    } catch (error) {
      console.error('AI 피드백 데이터 로드 실패:', error);
      setError('AI 피드백 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
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

  // 키워드 분석 차트 데이터
  const getKeywordChartData = () => {
    if (!reviewAnalysis || !reviewAnalysis.keywords) return [];
    
    return Object.entries(reviewAnalysis.keywords)
      .map(([keyword, count]) => ({
        keyword,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // 상위 10개만
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>AI 피드백을 불러오는 중...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ 
        p: 2, 
        bgcolor: '#9c27b0', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <ArrowBack 
          onClick={() => navigate('/owner/analytics/' + selectedStoreId)}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            AI 피드백 상세
          </Typography>
          <Typography variant="body2">
            인공지능 분석 결과
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area" sx={{ p: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* AI 분석 요약 */}
        {aiFeedback && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ fontSize: 24, color: '#9c27b0', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  AI 분석 요약
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                {aiFeedback.summary || '분석 중입니다...'}
              </Typography>
              
              {aiFeedback.confidenceScore && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    신뢰도:
                  </Typography>
                  <Chip 
                    label={`${aiFeedback.confidenceScore}%`}
                    color={getConfidenceColor(aiFeedback.confidenceScore)}
                    size="small"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* 긍정적 요소 */}
        {aiFeedback?.positivePoints && aiFeedback.positivePoints.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 24, color: '#4caf50', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  긍정적 요소
                </Typography>
              </Box>
              <List dense>
                {aiFeedback.positivePoints.map((point, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText 
                      primary={`• ${point}`}
                      sx={{ '& .MuiListItemText-primary': { color: '#4caf50' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* 개선 사항 */}
        {aiFeedback?.improvementPoints && aiFeedback.improvementPoints.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown sx={{ fontSize: 24, color: '#f44336', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  개선 사항
                </Typography>
              </Box>
              <List dense>
                {aiFeedback.improvementPoints.map((point, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText 
                      primary={`• ${point}`}
                      sx={{ '& .MuiListItemText-primary': { color: '#f44336' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* AI 추천 사항 */}
        {aiFeedback?.recommendations && aiFeedback.recommendations.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star sx={{ fontSize: 24, color: '#ff9800', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  AI 추천 사항
                </Typography>
              </Box>
              <List dense>
                {aiFeedback.recommendations.map((recommendation, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText 
                      primary={`${index + 1}. ${recommendation}`}
                      sx={{ '& .MuiListItemText-primary': { color: '#ff9800' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* 감정 분석 결과 차트 */}
        {getSentimentChartData().length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ fontSize: 24, color: '#2196f3', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  감정 분석 결과
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
                      label={({ name, percent, value }) => `${name}: ${value}개 (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getSentimentChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${formatNumber(value)}개`, '리뷰 수']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* 주요 키워드 분석 */}
        {getKeywordChartData().length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ fontSize: 24, color: '#673ab7', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  주요 키워드 분석
                </Typography>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getKeywordChartData()} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="keyword" type="category" width={60} />
                    <Tooltip formatter={(value) => [`${formatNumber(value)}회`, '언급 횟수']} />
                    <Bar dataKey="count" fill="#673ab7" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* 분석 생성 시간 */}
        {aiFeedback?.generatedAt && (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}>
            <Typography variant="body2">
              분석 생성 시간: {new Date(aiFeedback.generatedAt).toLocaleString('ko-KR')}
            </Typography>
          </Box>
        )}
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default AIFeedbackDetail;