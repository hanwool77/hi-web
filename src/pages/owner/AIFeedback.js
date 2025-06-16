//* src/pages/owner/AIFeedback.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid,
  Chip 
} from '@mui/material';
import { ArrowBack, TrendingUp } from '@mui/icons-material';
import { analyticsService } from '../../services/analyticsService';
import OwnerNavigation from '../../components/common/Navigation';

const AIFeedback = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIFeedbacks();
  }, [storeId]);

  const loadAIFeedbacks = async () => {
    try {
      const response = await analyticsService.getAIFeedback(storeId);
      setFeedbacks(response.data || []);
    } catch (error) {
      console.error('AI 피드백 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <Typography>로딩 중...</Typography>
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
            AI 피드백
          </Typography>
          <Typography variant="body2">
            AI 기반 매장 운영 개선 제안
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {/* AI 피드백 요약 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              📊 이번 주 AI 분석 결과
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {feedbacks.length}
                  </Typography>
                  <Typography variant="caption">개선 제안</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                    {feedbacks.filter(f => f.priority === '높음').length}
                  </Typography>
                  <Typography variant="caption">높은 우선순위</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                    85%
                  </Typography>
                  <Typography variant="caption">예상 개선율</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* AI 피드백 목록 */}
        {feedbacks.map((feedback) => (
          <Card key={feedback.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {feedback.title}
                </Typography>
                <Chip 
                  label={feedback.priority} 
                  size="small" 
                  color={feedback.priority === '높음' ? 'error' : feedback.priority === '중간' ? 'warning' : 'default'}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {feedback.description}
              </Typography>
              
              <Typography variant="caption" color="text.secondary">
                카테고리: {feedback.category} | 예상 효과: {feedback.expectedImpact}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* 더보기 버튼 */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<TrendingUp />}
          onClick={() => navigate(`/owner/stores/${storeId}/ai-feedback/detail`)}
          sx={{ mt: 2, mb: 2 }}
        >
          상세 AI 피드백 및 실행 계획 보기
        </Button>
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default AIFeedback;