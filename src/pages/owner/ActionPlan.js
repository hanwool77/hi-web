//* src/pages/owner/ActionPlan.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Assignment } from '@mui/icons-material';
import { analyticsService } from '../../services/analyticsService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/Navigation';

const ActionPlan = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
  const [actionPlans, setActionPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedStoreId) {
      loadActionPlans();
    }
  }, [selectedStoreId]);

  const loadActionPlans = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getActionPlans(selectedStoreId);
      setActionPlans(response.data || []);
    } catch (error) {
      console.error('실행 계획 로드 실패:', error);
      setActionPlans([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
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
          onClick={() => navigate('/owner')}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            실행 계획
          </Typography>
          <Typography variant="body2">
            AI 기반 실행 계획 관리
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {actionPlans.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Assignment sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                실행 계획이 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                AI 피드백에서 실행 계획을 생성해보세요
              </Typography>
              <Button 
                variant="contained"
                onClick={() => navigate('/owner/ai-feedback')}
              >
                AI 피드백 보기
              </Button>
            </CardContent>
          </Card>
        ) : (
          actionPlans.map((plan) => (
            <Card key={plan.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {plan.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {plan.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  생성일: {new Date(plan.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default ActionPlan;