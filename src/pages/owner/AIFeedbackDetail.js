//* src/pages/owner/AIFeedbackDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  ListItemText,
  Checkbox,
  FormControlLabel,
  Button
} from '@mui/material';
import { 
  ArrowBack, 
  Psychology,
  TrendingUp,
  TrendingDown,
  Star,
  Assessment,
  PlayArrow
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/Navigation';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#8884D8'];

const AIFeedbackDetail = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
  const { feedbackId } = useParams(); // URL에서 feedbackId 가져오기
  const [aiFeedback, setAiFeedback] = useState(null);
  const [reviewAnalysis, setReviewAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImprovements, setSelectedImprovements] = useState([]); // 선택된 개선사항들
  const [actionPlanLoading, setActionPlanLoading] = useState(false); // 실행계획 생성 로딩 상태
  const [disabledImprovements, setDisabledImprovements] = useState([]); // 비활성화할 개선사항들

  useEffect(() => {
    if (selectedStoreId) {
      loadAIFeedbackData();
    }
  }, [selectedStoreId]);

  // existActionPlan과 improvementPoints의 겹치는 부분을 확인하는 함수
  const checkOverlappingImprovements = (improvementPoints, existActionPlan) => {
    if (!improvementPoints || !existActionPlan) return [];
    
    return improvementPoints.filter(improvement => 
      existActionPlan.some(actionPlan => 
        actionPlan.trim().toLowerCase().includes(improvement.trim().toLowerCase()) ||
        improvement.trim().toLowerCase().includes(actionPlan.trim().toLowerCase())
      )
    );
  };

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
      
      const feedbackData = feedbackRes.data;
      setAiFeedback(feedbackData);
      setReviewAnalysis(analysisRes.data);
      
      // existActionPlan과 improvementPoints의 겹치는 부분 확인
      if (feedbackData.improvementPoints && feedbackData.existActionPlan) {
        const overlapping = checkOverlappingImprovements(
          feedbackData.improvementPoints, 
          feedbackData.existActionPlan
        );
        
        console.log('겹치는 개선사항들:', overlapping);
        
        // 겹치는 항목들을 미리 선택된 상태로 설정
        setSelectedImprovements(overlapping);
        // 겹치는 항목들을 비활성화 목록에 추가
        setDisabledImprovements(overlapping);
      }
      
    } catch (error) {
      console.error('AI 피드백 데이터 로드 실패:', error);
      setError('AI 피드백 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 개선사항 체크박스 변경 핸들러
  const handleImprovementChange = (improvement, checked) => {
    // 이미 실행계획이 있는 항목은 변경할 수 없음
    if (disabledImprovements.includes(improvement)) {
      return;
    }
    
    setSelectedImprovements(prev => {
      if (checked) {
        return [...prev, improvement];
      } else {
        return prev.filter(item => item !== improvement);
      }
    });
  };

  // 실행계획 생성 API 호출
  const handleGenerateActionPlan = async () => {
    // 비활성화된 항목을 제외한 선택된 항목들만 필터링
    const availableSelections = selectedImprovements.filter(
      improvement => !disabledImprovements.includes(improvement)
    );
    
    if (availableSelections.length === 0) {
      alert('새로운 개선사항을 선택해주세요.');
      return;
    }

    // feedbackId 확인 및 검증
    const currentFeedbackId = feedbackId || aiFeedback?.id || aiFeedback?.feedbackId || 1;
    
    console.log('사용할 feedbackId:', currentFeedbackId);
    console.log('URL feedbackId:', feedbackId);
    console.log('aiFeedback 객체:', aiFeedback);

    if (!currentFeedbackId) {
      alert('피드백 ID를 찾을 수 없습니다. 다시 시도해주세요.');
      return;
    }

    try {
      setActionPlanLoading(true);
      
      // API 호출 - 비활성화된 항목 제외
      const response = await analyticsService.generateActionPlans(
        currentFeedbackId,
        {
          actionPlanSelect: availableSelections
        }
      );

      console.log('실행계획 생성 응답:', response);
      
      // 성공 메시지 표시
      alert('실행계획이 성공적으로 생성되었습니다.');
      
      // 새로 선택된 항목들을 비활성화 목록에 추가
      setDisabledImprovements(prev => [...prev, ...availableSelections]);
      
    } catch (error) {
      console.error('실행계획 생성 실패:', error);
      console.error('에러 상세:', error.response?.data);
      alert(`실행계획 생성에 실패했습니다: ${error.response?.data?.message || '다시 시도해주세요.'}`);
    } finally {
      setActionPlanLoading(false);
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
        display: 'flex', 
        alignItems: 'center', 
        p: 2, 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <ArrowBack 
          onClick={() => {
            console.log('뒤로가기 클릭, selectedStoreId:', selectedStoreId);
            navigate(`/owner/analytics/${selectedStoreId}`);
          }} 
          sx={{ fontSize: 24, cursor: 'pointer', mr: 2 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          AI 피드백 상세
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ p: 2 }}>
        {/* AI 분석 요약 */}
        {aiFeedback && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ fontSize: 24, color: '#9c27b0', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  AI 분석 요약
                </Typography>
                <Chip 
                  label={`신뢰도 ${(aiFeedback.confidenceScore * 100).toFixed(0)}%`}
                  color={getConfidenceColor(aiFeedback.confidenceScore * 100)}
                  size="small"
                  sx={{ ml: 'auto' }}
                />
              </Box>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                {aiFeedback.summary}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                감정 분석: {aiFeedback.sentimentAnalysis}
              </Typography>
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
                  강점 분석
                </Typography>
              </Box>
              <List dense>
                {aiFeedback.positivePoints.map((point, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText 
                      primary={`✓ ${point}`}
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
              
              {/* 개선사항 목록 - 체크박스와 함께 */}
              <Box sx={{ mb: 2 }}>
                {aiFeedback.improvementPoints.map((point, index) => {
                  const isDisabled = disabledImprovements.includes(point);
                  
                  return (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={selectedImprovements.includes(point)}
                          onChange={(e) => handleImprovementChange(point, e.target.checked)}
                          disabled={isDisabled}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: isDisabled ? '#999' : '#f44336',
                              textDecoration: isDisabled ? 'line-through' : 'none'
                            }}
                          >
                            {point}
                          </Typography>
                          {isDisabled && (
                            <Chip 
                              label="실행계획 있음" 
                              size="small" 
                              color="success" 
                              sx={{ ml: 1, fontSize: '0.7rem', height: '20px' }}
                            />
                          )}
                        </Box>
                      }
                      sx={{ 
                        display: 'block',
                        mb: 1,
                        opacity: isDisabled ? 0.6 : 1
                      }}
                    />
                  );
                })}
              </Box>

              {/* 실행계획 생성 버튼 */}
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrow />}
                onClick={handleGenerateActionPlan}
                disabled={
                  selectedImprovements.filter(item => !disabledImprovements.includes(item)).length === 0 || 
                  actionPlanLoading ||
                  (!feedbackId && !aiFeedback?.id && !aiFeedback?.feedbackId) // feedbackId가 없으면 비활성화
                }
                fullWidth
                sx={{ mt: 2 }}
              >
                {actionPlanLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  '실행계획 생성'
                )}
              </Button>
              
              {selectedImprovements.filter(item => !disabledImprovements.includes(item)).length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  {selectedImprovements.filter(item => !disabledImprovements.includes(item)).length}개 새로운 항목이 선택됨
                </Typography>
              )}

              {/* 기존 실행계획 정보 표시 */}
              {disabledImprovements.length > 0 && (
                <Typography variant="body2" color="success.main" sx={{ mt: 1, textAlign: 'center' }}>
                  {disabledImprovements.length}개 항목은 이미 실행계획이 있습니다
                </Typography>
              )}

              {/* 디버깅 정보 (개발 중에만 표시) */}
              {process.env.NODE_ENV === 'development' && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center', display: 'block' }}>
                  Debug: feedbackId={feedbackId}, aiFeedback.id={aiFeedback?.id}
                </Typography>
              )}
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
                      label={({ name, percent, value }) => `${name}: ${value}(${(percent * 100).toFixed(1)}%)`}
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

        {/* 키워드 분석 차트 */}
        {getKeywordChartData().length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                주요 키워드 분석
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getKeywordChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="keyword" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* 리뷰 통계 요약 */}
        {reviewAnalysis && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                리뷰 분석 요약
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">총 리뷰 수</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatNumber(reviewAnalysis.totalReviews)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">평균 평점</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {reviewAnalysis.averageRating ? reviewAnalysis.averageRating.toFixed(1) : '0.0'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">긍정</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {formatNumber(reviewAnalysis.positiveCount)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">중립</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                    {formatNumber(reviewAnalysis.neutralCount)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">부정</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                    {formatNumber(reviewAnalysis.negativeCount)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default AIFeedbackDetail;