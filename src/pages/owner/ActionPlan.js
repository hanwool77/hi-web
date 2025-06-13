import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Grid,
  Checkbox, FormControlLabel, TextField, Chip, Tab, Tabs
} from '@mui/material';
import { 
  ArrowBack, Add, CheckCircle, Schedule, Assignment
} from '@mui/icons-material';
import { analyticsService } from '../../services/analyticsService';
import OwnerNavigation from '../../components/common/OwnerNavigation';

const ActionPlan = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [actionPlans, setActionPlans] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActionPlans();
  }, [storeId]);

  const loadActionPlans = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getActionPlans(storeId);
      setActionPlans(response.data || []);
    } catch (error) {
      console.error('실행 계획 로드 실패:', error);
      setActionPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveActionPlan = async () => {
    if (selectedFeedbacks.length === 0) {
      alert('저장할 피드백을 선택해주세요.');
      return;
    }

    try {
      await analyticsService.saveActionPlan({
        feedbackIds: selectedFeedbacks,
        note
      });
      alert('실행 계획이 저장되었습니다.');
      setSelectedFeedbacks([]);
      setNote('');
      loadActionPlans();
    } catch (error) {
      console.error('실행 계획 저장 실패:', error);
      alert('실행 계획 저장에 실패했습니다.');
    }
  };

  const handleCompleteTask = async (planId, taskId) => {
    // TODO: 실행 계획 완료 API 호출
    console.log('Complete task:', planId, taskId);
  };

  const mockFeedbacks = [
    { id: 1, title: '서비스 개선', description: '직원 친절도 향상 교육', period: '단기' },
    { id: 2, title: '맛 개선', description: '음식 간 조절', period: '중기' },
    { id: 3, title: '청결도 개선', description: '매장 내부 청소 강화', period: '단기' }
  ];

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          실행 계획
        </Typography>
      </Box>

      <Box className="content-area">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="계획 만들기" />
            <Tab label={`진행 중 (${actionPlans.length})`} />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              🎯 개선 항목 선택
            </Typography>
            
            {mockFeedbacks.map((feedback) => (
              <Card key={feedback.id} sx={{ mb: 2 }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFeedbacks.includes(feedback.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFeedbacks([...selectedFeedbacks, feedback.id]);
                          } else {
                            setSelectedFeedbacks(selectedFeedbacks.filter(id => id !== feedback.id));
                          }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1 }}>
                            {feedback.title}
                          </Typography>
                          <Chip 
                            label={feedback.period} 
                            size="small"
                            color={feedback.period === '단기' ? 'success' : feedback.period === '중기' ? 'warning' : 'error'}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {feedback.description}
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>
            ))}

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  📝 추가 메모
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="실행 계획에 대한 추가 메모를 작성해주세요."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </CardContent>
            </Card>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSaveActionPlan}
              sx={{ py: 1.5 }}
            >
              💾 실행 계획 저장
            </Button>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            {loading ? (
              <Typography>로딩 중...</Typography>
            ) : actionPlans.length === 0 ? (
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  진행 중인 실행 계획이 없습니다.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setTabValue(0)}
                >
                  실행 계획 만들기
                </Button>
              </Card>
            ) : (
              actionPlans.map((plan) => (
                <Card key={plan.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {plan.title}
                      </Typography>
                      <Chip 
                        label={plan.status === 'COMPLETED' ? '완료' : '진행중'} 
                        color={plan.status === 'COMPLETED' ? 'success' : 'primary'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      생성일: {new Date(plan.createdAt).toLocaleDateString()}
                    </Typography>

                    {plan.tasks && plan.tasks.map((task, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleCompleteTask(plan.id, task.id)}
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {task.description}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}
      </Box>

      <OwnerNavigation />
    </Box>
  );
};

export default ActionPlan;
