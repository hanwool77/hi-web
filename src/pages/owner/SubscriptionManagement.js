//* src/pages/owner/SubscriptionManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Grid,
  Chip
} from '@mui/material';
import { ArrowBack, CreditCard } from '@mui/icons-material';
import { subscriptionService } from '../../services/subscription';
import OwnerNavigation from '../../components/common/Navigation';

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionInfo();
    loadPlans();
  }, []);

  const loadSubscriptionInfo = async () => {
    try {
      const response = await subscriptionService.getSubscriptionInfo();
      setCurrentPlan(response.data);
    } catch (error) {
      console.error('구독 정보 로드 실패:', error);
    }
  };

  const loadPlans = async () => {
    try {
      const response = await subscriptionService.getSubscriptionPlans();
      setPlans(response.data || []);
    } catch (error) {
      console.error('구독 플랜 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = async (planId) => {
    try {
      await subscriptionService.changeSubscription(planId);
      alert('구독 플랜이 변경되었습니다.');
      loadSubscriptionInfo();
    } catch (error) {
      console.error('구독 플랜 변경 실패:', error);
      alert('구독 플랜 변경에 실패했습니다.');
    }
  };

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
          onClick={() => navigate('/owner/mypage')}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            구독 관리
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {/* 현재 구독 정보 */}
        {currentPlan && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                현재 구독 플랜
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {currentPlan.planName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    만료일: {currentPlan.expiryDate}
                  </Typography>
                </Box>
                <Chip 
                  label={currentPlan.status === 'ACTIVE' ? '활성' : '비활성'} 
                  color={currentPlan.status === 'ACTIVE' ? 'success' : 'default'}
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* 구독 플랜 목록 */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          구독 플랜 선택
        </Typography>
        
        <Grid container spacing={2}>
          {plans.map((plan) => (
            <Grid item xs={12} key={plan.id}>
              <Card sx={{ 
                border: currentPlan?.planId === plan.id ? '2px solid #2196f3' : '1px solid #e0e0e0'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {plan.name}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                        {plan.price.toLocaleString()}원
                        <Typography component="span" variant="body2" color="text.secondary">
                          /월
                        </Typography>
                      </Typography>
                    </Box>
                    {currentPlan?.planId === plan.id && (
                      <Chip label="현재 플랜" color="primary" size="small" />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {plan.description}
                  </Typography>
                  
                  <Button
                    fullWidth
                    variant={currentPlan?.planId === plan.id ? "outlined" : "contained"}
                    startIcon={<CreditCard />}
                    onClick={() => handleChangePlan(plan.id)}
                    disabled={currentPlan?.planId === plan.id}
                  >
                    {currentPlan?.planId === plan.id ? '현재 플랜' : '플랜 변경'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default SubscriptionManagement;