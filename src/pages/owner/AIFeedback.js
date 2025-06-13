import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Grid,
  LinearProgress, Chip, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { 
  ArrowBack, ExpandMore, TrendingUp, Star, Comment,
  ThumbUp, ThumbDown, Lightbulb
} from '@mui/icons-material';
import { analyticsService } from '../../services/analyticsService';
import OwnerNavigation from '../../components/common/OwnerNavigation';

const AIFeedback = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIFeedback();
  }, [storeId]);

  const loadAIFeedback = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getAIFeedbackDetail(storeId);
      setFeedback(response.data);
    } catch (error) {
      console.error('AI 피드백 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ p: 2 }}>
          <Typography>AI 피드백 로딩 중...</Typography>
        </Box>
      </Box>
    );
  }

  if (!feedback) {
    return (
      <Box className="mobile-container">
        <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
          <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            AI 피드백
          </Typography>
        </Box>
        <Box className="content-area">
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Typography color="text.secondary">
              AI 피드백 데이터가 없습니다.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              리뷰가 3개 이상 있어야 AI 분석이 가능합니다.
            </Typography>
          </Card>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            AI 피드백
          </Typography>
          <Typography variant="body2">
            {feedback.storeName}
          </Typography>
        </Box>
      </Box>

      <Box className="content-area">
        {/* 기본 정보 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              📊 분석 기본 정보
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">분석 기간</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {feedback.analysisStartDate} ~ {feedback.analysisEndDate}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">분석 리뷰 수</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {feedback.totalReviews?.toLocaleString() || 0}개
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">업종</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {feedback.category}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">평균 평점</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {feedback.averageRating?.toFixed(1) || '0.0'}점
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 감정 분석 결과 */}
        {feedback.sentimentAnalysis && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                😊 감정 분석 결과
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ThumbUp sx={{ color: '#4caf50', fontSize: 32 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {feedback.sentimentAnalysis.positive}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      긍정
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ color: '#9e9e9e', fontSize: 32, display: 'flex', justifyContent: 'center' }}>
                      😐
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9e9e9e' }}>
                      {feedback.sentimentAnalysis.neutral}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      중립
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ThumbDown sx={{ color: '#f44336', fontSize: 32 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                      {feedback.sentimentAnalysis.negative}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      부정
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* 개선 영역 */}
        {feedback.improvementAreas && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                🎯 개선 필요 영역
              </Typography>
              {feedback.improvementAreas.map((area, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1 }}>
                        {area.category}
                      </Typography>
                      <Chip 
                        label={area.severity > 70 ? '높음' : area.severity > 40 ? '보통' : '낮음'}
                        color={area.severity > 70 ? 'error' : area.severity > 40 ? 'warning' : 'success'}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {area.description}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={area.severity} 
                      color={area.severity > 70 ? 'error' : area.severity > 40 ? 'warning' : 'success'}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      심각도: {area.severity}%
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        )}

        {/* AI 추천사항 */}
        {feedback.recommendations && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                💡 AI 추천사항
              </Typography>
              {feedback.recommendations.map((recommendation, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Lightbulb sx={{ color: '#ffc107', mr: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {recommendation.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {recommendation.description}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 실행 계획 저장 버튼 */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => navigate(`/owner/stores/${storeId}/action-plan`)}
          sx={{ py: 1.5 }}
        >
          📋 실행 계획 만들기
        </Button>
      </Box>

      <OwnerNavigation />
    </Box>
  );
};

export default AIFeedback;
