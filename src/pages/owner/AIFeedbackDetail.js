import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  LinearProgress,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Psychology,
  TrendingUp,
  CheckCircle,
  Schedule,
  Assignment
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AIFeedbackDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [selectedActionPlans, setSelectedActionPlans] = useState([]);

  useEffect(() => {
    loadAIAnalysis();
  }, [storeId]);

  const loadAIAnalysis = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      // API URL 변경: POST /api/stores/{storeId}/ai-analysis
      const response = await fetch(`${window.__runtime_config__.ANALYTICS_URL || 'http://20.1.2.3:8080'}/api/analytics/stores/${storeId}/ai-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          days: 30,
          generateActionPlan: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAiAnalysis(result.data);
      } else {
        setError('AI 분석 데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('AI 분석 로드 오류:', err);
      setError('AI 분석 데이터 로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleActionPlanToggle = (planIndex) => {
    setSelectedActionPlans(prev => 
      prev.includes(planIndex)
        ? prev.filter(index => index !== planIndex)
        : [...prev, planIndex]
    );
  };

  const handleSaveActionPlans = async () => {
    if (selectedActionPlans.length === 0) {
      alert('저장할 실행 계획을 선택해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const selectedPlans = selectedActionPlans.map(index => aiAnalysis.actionPlans[index]);

      const response = await fetch(`${window.__runtime_config__.ANALYTICS_URL || 'http://20.1.2.3:8080'}/api/action-plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          storeId: storeId,
          feedbackId: aiAnalysis.feedbackId,
          actionPlans: selectedPlans
        })
      });

      if (response.ok) {
        alert('선택한 실행 계획이 저장되었습니다!');
        navigate('/owner/action-plan/list');
      } else {
        alert('실행 계획 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('실행 계획 저장 오류:', error);
      alert('실행 계획 저장 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>AI 분석 데이터를 불러오는 중...</Typography>
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

  const sentimentData = [
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

      <Box sx={{ p: 2, pb: 10, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        {/* 분석 기본 정보 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              📊 분석 정보
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>분석 기간:</strong> 최근 30일
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>업체명:</strong> 매장 {storeId}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>분석 데이터:</strong> {aiAnalysis?.totalReviewsAnalyzed || 0}개 리뷰
            </Typography>
            <Typography variant="body2">
              <strong>신뢰도:</strong> {Math.round((aiAnalysis?.confidenceScore || 0) * 100)}%
            </Typography>
          </CardContent>
        </Card>

        {/* 감정 분석 결과 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              😊 감정 분석 결과
            </Typography>
            <Box sx={{ height: 200, mb: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {aiAnalysis?.sentimentAnalysis || '감정 분석 결과를 로드하는 중...'}
            </Typography>
          </CardContent>
        </Card>

        {/* 요약 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              📝 분석 요약
            </Typography>
            <Typography variant="body2">
              {aiAnalysis?.summary || '분석 요약을 로드하는 중...'}
            </Typography>
          </CardContent>
        </Card>

        {/* 긍정적 요소 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              ✅ 긍정적 요소
            </Typography>
            {aiAnalysis?.positivePoints?.map((point, index) => (
              <Chip
                key={index}
                label={point}
                color="success"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            )) || <Typography variant="body2" color="text.secondary">로딩 중...</Typography>}
          </CardContent>
        </Card>

        {/* 개선 영역 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              🔧 개선 영역
            </Typography>
            {aiAnalysis?.improvementPoints?.map((point, index) => (
              <Chip
                key={index}
                label={point}
                color="warning"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            )) || <Typography variant="body2" color="text.secondary">로딩 중...</Typography>}
          </CardContent>
        </Card>

        {/* 추천사항 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              💡 추천사항
            </Typography>
            {aiAnalysis?.recommendations?.map((recommendation, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                • {recommendation}
              </Typography>
            )) || <Typography variant="body2" color="text.secondary">로딩 중...</Typography>}
          </CardContent>
        </Card>

        {/* 실행 계획 */}
        {aiAnalysis?.actionPlans && aiAnalysis.actionPlans.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📋 AI 추천 실행 계획
              </Typography>
              
              {aiAnalysis.actionPlans.map((plan, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedActionPlans.includes(index)}
                        onChange={() => handleActionPlanToggle(index)}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {plan}
                      </Typography>
                    }
                  />
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />
              
              <Button
                fullWidth
                variant="contained"
                startIcon={<Assignment />}
                onClick={handleSaveActionPlans}
                disabled={selectedActionPlans.length === 0}
              >
                선택한 실행 계획 저장
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default AIFeedbackDetail;