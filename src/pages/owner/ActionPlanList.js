//* src/pages/owner/ActionPlanList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider 
} from '@mui/material';
import { ArrowBack, Assignment } from '@mui/icons-material';
import { analyticsService } from '../../services/analyticsService';

const ActionPlanList = () => {
  const navigate = useNavigate();
  const [actionPlans, setActionPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActionPlans();
  }, []);

  const loadActionPlans = async () => {
    try {
      const response = await analyticsService.getActionPlans();
      setActionPlans(response.data || []);
    } catch (error) {
      console.error('실행 계획 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanClick = (planId) => {
    // 상세 페이지로 이동 (필요시 구현)
    console.log('실행 계획 상세:', planId);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case '진행중': return 'primary';
      case '완료': return 'success';
      case '대기': return 'default';
      default: return 'default';
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
              <Assignment sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                저장된 실행 계획이 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI 피드백에서 실행 계획을 저장해보세요
              </Typography>
            </CardContent>
          </Card>
        ) : (
          actionPlans.map((plan) => (
            <Card 
              key={plan.planId} 
              sx={{ 
                mb: 2, 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 2
                }
              }}
              onClick={() => handlePlanClick(plan.planId)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {plan.title}
                  </Typography>
                  <Chip 
                    label={plan.status} 
                    size="small" 
                    color={getStatusColor(plan.status)}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  기간: {plan.period}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  생성일: {new Date(plan.createdAt).toLocaleDateString()}
                </Typography>
                
                {plan.tasks && plan.tasks.length > 0 && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      주요 작업:
                    </Typography>
                    <List dense>
                      {plan.tasks.slice(0, 3).map((task, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemText 
                            primary={`• ${task}`}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                      {plan.tasks.length > 3 && (
                        <ListItem sx={{ py: 0 }}>
                          <ListItemText 
                            primary={`외 ${plan.tasks.length - 3}개 작업...`}
                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ActionPlanList;