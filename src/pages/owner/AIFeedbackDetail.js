//* src/pages/owner/AIFeedbackDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  CircularProgress,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import { ArrowBack, Psychology } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';

const AIFeedbackDetail = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedStoreId) {
      loadAIFeedback();
    }
  }, [selectedStoreId]);

  const loadAIFeedback = async () => {
    try {
      setLoading(true);
      // 실제 백엔드 API 엔드포인트 호출
      const response = await analyticsService.getAIFeedbackDetail(selectedStoreId);
      setFeedback(response.data);
    } catch (error) {
      console.error('AI 피드백 로드 실패:', error);
      setError('AI 피드백을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>AI 피드백 데이터를 불러오는 중...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="mobile-container">
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <ArrowBack 
              sx={{ cursor: 'pointer' }} 
              onClick={() => navigate(-1)}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              AI 피드백 상세
            </Typography>
          </Box>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="error">
                {error}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }

  // 감정 분석 데이터 - 실제 API 데이터 사용
  const sentimentData = feedback?.sentimentData || [
    { name: '긍정', value: 70, color: '#4caf50' },
    { name: '중립', value: 20, color: '#ff9800' },
    { name: '부정', value: 10, color: '#f44336' }
  ];

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        bgcolor: 'white', 
        zIndex: 1000, 
        borderBottom: '1px solid #e0e0e0',
        p: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ArrowBack 
            sx={{ cursor: 'pointer' }} 
            onClick={() => navigate(-1)}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            AI 피드백 상세
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2, pb: 10, bgcolor: '#f5f5f5' }}>
        {/* 기본 정보 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Psychology sx={{ fontSize: 32, color: '#9c27b0', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                분석 기본 정보
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>분석 기간:</strong> {feedback?.analysisPeriod || '최근 30일'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>분석 데이터:</strong> 리뷰 {feedback?.reviewCount || 0}개
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>신뢰도:</strong> {feedback?.confidenceScore ? `${(feedback.confidenceScore * 100).toFixed(1)}%` : 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>분석 완료 시간:</strong> {feedback?.generatedAt ? new Date(feedback.generatedAt).toLocaleString() : 'N/A'}
            </Typography>
          </CardContent>
        </Card>

        {/* AI 분석 요약 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              AI 분석 요약
            </Typography>
            <Typography variant="body1">
              {feedback?.summary || 'AI 분석 요약이 없습니다.'}
            </Typography>
          </CardContent>
        </Card>

        {/* 감정 분석 결과 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              감정 분석 결과
            </Typography>
            <Box sx={{ height: 200, mb: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              {sentimentData.map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.name} ${item.value}%`}
                  sx={{ bgcolor: item.color, color: 'white' }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* 긍정적 요소 */}
        {feedback?.positivePoints && feedback.positivePoints.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#4caf50' }}>
                긍정적 요소
              </Typography>
              {feedback.positivePoints.map((point, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    • {point}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 개선 필요 영역 */}
        {feedback?.improvementPoints && feedback.improvementPoints.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff9800' }}>
                개선 필요 영역
              </Typography>
              {feedback.improvementPoints.map((point, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    • {point}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        )}

        {/* AI 추천사항 */}
        {feedback?.recommendations && feedback.recommendations.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2196f3' }}>
                AI 추천사항
              </Typography>
              {feedback.recommendations.map((recommendation, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    • {recommendation}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default AIFeedbackDetail;