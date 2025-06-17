//* src/pages/owner/ActionPlanList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Alert
} from '@mui/material';
import { ArrowBack, Assignment, CheckCircle } from '@mui/icons-material';
import { analyticsService } from '../../services/analyticsService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/Navigation';

const ActionPlanList = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
  const [actionPlans, setActionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlans, setSelectedPlans] = useState([]); // 선택된 실행계획들
  const [completing, setCompleting] = useState(false); // 완료 처리 로딩 상태
  const [completedPlans, setCompletedPlans] = useState([]); // 이미 완료된 계획들

  useEffect(() => {
    if (selectedStoreId) {
      loadActionPlans();
    }
  }, [selectedStoreId]);

  const loadActionPlans = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getActionPlans(selectedStoreId);
      const plans = response.data || [];
      setActionPlans(plans);
      
      // 이미 완료된 계획들을 미리 선택된 상태로 설정
      const completedPlanIds = plans
        .filter(plan => plan.status === 'COMPLETED')
        .map(plan => plan.id);
      
      setCompletedPlans(completedPlanIds);
      setSelectedPlans(completedPlanIds);
      
    } catch (error) {
      console.error('실행 계획 목록 로드 실패:', error);
      setActionPlans([]);
    } finally {
      setLoading(false);
    }
  };

  // 체크박스 변경 핸들러
  const handlePlanCheck = (planId, checked) => {
    // 이미 완료된 계획은 체크 해제할 수 없음
    if (completedPlans.includes(planId)) {
      return;
    }
    
    setSelectedPlans(prev => {
      if (checked) {
        return [...prev, planId];
      } else {
        return prev.filter(id => id !== planId);
      }
    });
  };

  // 실행계획 완료 처리
  const handleCompleteActionPlans = async () => {
    // 완료되지 않은 선택된 계획들만 처리
    const plansToComplete = selectedPlans.filter(planId => !completedPlans.includes(planId));
    
    if (plansToComplete.length === 0) {
      alert('완료할 실행계획을 선택해주세요.');
      return;
    }

    try {
      setCompleting(true);
      
      // 선택된 각 계획을 완료 처리
      const completePromises = plansToComplete.map(planId => 
        analyticsService.completeActionPlan(planId, {
          note: '사용자가 완료 처리함',
          completedTasks: []
        })
      );
      
      await Promise.all(completePromises);
      
      alert(`${plansToComplete.length}개의 실행계획이 완료되었습니다.`);
      
      // 완료된 계획들을 completedPlans에 추가
      setCompletedPlans(prev => [...prev, ...plansToComplete]);
      
      // 데이터 다시 로드
      await loadActionPlans();
      
    } catch (error) {
      console.error('실행계획 완료 처리 실패:', error);
      alert('실행계획 완료 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setCompleting(false);
    }
  };

  // 상태에 따른 칩 색상 결정
  const getStatusColor = (status) => {
    switch(status) {
      case 'IN_PROGRESS': 
      case 'PLANNED': 
        return 'primary';
      case 'COMPLETED': 
        return 'success';
      default: 
        return 'default';
    }
  };

  // 상태 텍스트 변환
  const getStatusText = (status) => {
    switch(status) {
      case 'PLANNED': 
        return '계획됨';
      case 'IN_PROGRESS': 
        return '진행중';
      case 'COMPLETED': 
        return '완료';
      default: 
        return status;
    }
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>실행 계획을 불러오는 중...</Typography>
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
          onClick={() => navigate(`/owner/analytics/${selectedStoreId}`)}
          sx={{ cursor: 'pointer' }}
        />
        <Assignment sx={{ mr: 1 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            실행 계획 목록
          </Typography>
          <Typography variant="body2">
            저장된 실행 계획 관리
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {actionPlans.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Assignment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                등록된 실행 계획이 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                AI 피드백을 통해 실행 계획을 생성해보세요
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 실행 계획 목록 */}
            {actionPlans.map((plan, index) => {
              const isCompleted = plan.status === 'COMPLETED';
              const isChecked = selectedPlans.includes(plan.id);
              
              return (
                <Card key={plan.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* 체크박스 */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={(e) => handlePlanCheck(plan.id, e.target.checked)}
                            disabled={isCompleted}
                            color="primary"
                          />
                        }
                        label=""
                        sx={{ m: 0, p: 0 }}
                      />
                      
                      {/* 계획 내용 */}
                      <Box sx={{ flex: 1, opacity: isCompleted ? 0.7 : 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 'bold',
                              textDecoration: isCompleted ? 'line-through' : 'none'
                            }}
                          >
                            {plan.title}
                          </Typography>
                          <Chip 
                            label={getStatusText(plan.status)}
                            color={getStatusColor(plan.status)}
                            size="small"
                            icon={isCompleted ? <CheckCircle /> : undefined}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {plan.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            기간: {plan.period || '미정'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            생성일: {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString('ko-KR') : '미정'}
                          </Typography>
                          {plan.completedAt && (
                            <Typography variant="caption" color="success.main">
                              완료일: {new Date(plan.completedAt).toLocaleDateString('ko-KR')}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}

            {/* 완료 처리 버튼 */}
            <Box sx={{ mt: 3, mb: 3 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<CheckCircle />}
                onClick={handleCompleteActionPlans}
                disabled={
                  completing || 
                  selectedPlans.filter(planId => !completedPlans.includes(planId)).length === 0
                }
                sx={{ 
                  py: 1.5,
                  backgroundColor: '#4caf50',
                  '&:hover': {
                    backgroundColor: '#45a049'
                  }
                }}
              >
                {completing ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    완료 처리 중...
                  </>
                ) : (
                  `선택한 실행계획 완료 (${selectedPlans.filter(planId => !completedPlans.includes(planId)).length}개)`
                )}
              </Button>
              
              {/* 선택 상태 표시 */}
              {selectedPlans.length > 0 && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    총 {selectedPlans.length}개 선택됨 
                    (완료된 항목: {completedPlans.filter(id => selectedPlans.includes(id)).length}개)
                  </Typography>
                </Box>
              )}
            </Box>

            {/* 도움말 */}
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                💡 <strong>사용 방법:</strong><br />
                • 완료하고 싶은 실행계획을 체크해주세요<br />
                • 이미 완료된 항목은 자동으로 체크되어 수정할 수 없습니다<br />
                • 하단의 완료 버튼을 클릭하면 선택된 계획들이 완료 처리됩니다
              </Typography>
            </Alert>
          </>
        )}
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default ActionPlanList;