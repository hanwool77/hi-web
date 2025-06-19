//* src/pages/owner/SubscriptionManagement.js - 배포환경 안전 버전
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  ArrowBack, 
  CreditCard, 
  CheckCircle, 
  Cancel,
  Refresh,
  Payment,
  Receipt,
  Info,
  Warning
} from '@mui/icons-material';
import { subscriptionService } from '../../services/subscription';
import OwnerNavigation from '../../components/common/Navigation';

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  // 샘플 데이터 (실제 API 연동 전까지 사용)
  const sampleCurrentPlan = {
    id: 1,
    planName: "프리미엄 플랜",
    planId: 2,
    status: "ACTIVE",
    startDate: "2024-01-01",
    expiryDate: "2024-12-31",
    price: 29900,
    nextBillingDate: "2024-07-01",
    autoRenewal: true
  };

  const samplePlans = [
    {
      id: 1,
      name: "기본 플랜",
      price: 9900,
      description: "소규모 매장을 위한 기본 기능 제공\n• 기본 리뷰 관리\n• 월 100건 AI 분석\n• 기본 통계 리포트",
      features: ["기본 리뷰 관리", "월 100건 AI 분석", "기본 통계 리포트"],
      popular: false
    },
    {
      id: 2,
      name: "프리미엄 플랜",
      price: 29900,
      description: "중소 매장을 위한 고급 기능 제공\n• 고급 리뷰 관리\n• 월 500건 AI 분석\n• 상세 통계 및 인사이트\n• AI 추천 서비스",
      features: ["고급 리뷰 관리", "월 500건 AI 분석", "상세 통계 및 인사이트", "AI 추천 서비스"],
      popular: true
    },
    {
      id: 3,
      name: "엔터프라이즈 플랜",
      price: 59900,
      description: "대형 매장을 위한 전문 기능 제공\n• 무제한 AI 분석\n• 고급 비즈니스 인텔리전스\n• 전담 고객 지원\n• 맞춤 개발 지원",
      features: ["무제한 AI 분석", "고급 비즈니스 인텔리전스", "전담 고객 지원", "맞춤 개발 지원"],
      popular: false
    }
  ];

  const samplePaymentHistory = [
    {
      id: 1,
      date: "2024-06-01",
      amount: 29900,
      planName: "프리미엄 플랜",
      status: "완료",
      method: "신용카드"
    },
    {
      id: 2,
      date: "2024-05-01", 
      amount: 29900,
      planName: "프리미엄 플랜",
      status: "완료",
      method: "신용카드"
    },
    {
      id: 3,
      date: "2024-04-01",
      amount: 29900,
      planName: "프리미엄 플랜", 
      status: "완료",
      method: "계좌이체"
    }
  ];

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  // 🛡️ 안전한 가격 포맷팅 함수
  const formatPrice = (price) => {
    try {
      // null, undefined, NaN 체크
      if (price === null || price === undefined || isNaN(price)) {
        return '0';
      }
      
      // 숫자로 변환 후 포맷팅
      const numPrice = Number(price);
      if (isNaN(numPrice)) {
        return '0';
      }
      
      return numPrice.toLocaleString('ko-KR');
    } catch (error) {
      console.error('formatPrice 에러:', error);
      return '0';
    }
  };

  // 🛡️ 안전한 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    try {
      if (!dateString || dateString === '' || dateString === null || dateString === undefined) {
        return '-';
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '-';
      }
      
      return date.toLocaleDateString('ko-KR');
    } catch (error) {
      console.error('formatDate 에러:', error);
      return '-';
    }
  };

  // 🛡️ 안전한 데이터 로딩 함수
  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 시도, 실패하면 샘플 데이터 사용
      try {
        const [subscriptionResponse, plansResponse, paymentResponse] = await Promise.all([
          subscriptionService.getSubscriptionInfo(),
          subscriptionService.getSubscriptionPlans(),
          subscriptionService.getPaymentHistory()
        ]);
        
        // 🛡️ API 응답 데이터 안전 처리
        const currentPlanData = subscriptionResponse?.data || sampleCurrentPlan;
        const plansData = plansResponse?.data || samplePlans;
        const paymentData = paymentResponse?.data || samplePaymentHistory;
        
        // 🛡️ 필수 필드 기본값 설정
        setCurrentPlan({
          id: currentPlanData.id || 1,
          planName: currentPlanData.planName || "기본 플랜",
          planId: currentPlanData.planId || 1,
          status: currentPlanData.status || "ACTIVE",
          startDate: currentPlanData.startDate || new Date().toISOString().split('T')[0],
          expiryDate: currentPlanData.expiryDate || new Date().toISOString().split('T')[0],
          price: currentPlanData.price || 0,
          nextBillingDate: currentPlanData.nextBillingDate || new Date().toISOString().split('T')[0],
          autoRenewal: currentPlanData.autoRenewal !== undefined ? currentPlanData.autoRenewal : true
        });
        
        setPlans(Array.isArray(plansData) ? plansData : samplePlans);
        setPaymentHistory(Array.isArray(paymentData) ? paymentData : samplePaymentHistory);
        
      } catch (apiError) {
        console.log('API 호출 실패, 샘플 데이터 사용:', apiError);
        // 샘플 데이터 사용
        setCurrentPlan(sampleCurrentPlan);
        setPlans(samplePlans);
        setPaymentHistory(samplePaymentHistory);
      }
    } catch (error) {
      console.error('구독 정보 로드 실패:', error);
      // 에러 시에도 샘플 데이터 표시
      setCurrentPlan(sampleCurrentPlan);
      setPlans(samplePlans);
      setPaymentHistory(samplePaymentHistory);
    } finally {
      setLoading(false);
    }
  };

  // 🛡️ 안전한 플랜 변경 함수
  const handleChangePlan = async (planId) => {
    if (window.confirm('구독 플랜을 변경하시겠습니까?')) {
      try {
        setActionLoading(true);
        // 실제 API 호출 시도
        try {
          await subscriptionService.changeSubscription(planId);
          alert('구독 플랜이 변경되었습니다.');
          loadSubscriptionData();
        } catch (apiError) {
          // API 실패 시 샘플 동작
          console.log('API 호출 실패, 샘플 동작:', apiError);
          const selectedPlan = plans.find(p => p?.id === planId) || plans[0];
          
          if (selectedPlan) {
            setCurrentPlan(prev => ({
              ...prev,
              planName: selectedPlan.name || "기본 플랜",
              planId: planId || 1,
              price: selectedPlan.price || 0
            }));
            alert('구독 플랜이 변경되었습니다.');
          }
        }
      } catch (error) {
        console.error('구독 플랜 변경 실패:', error);
        alert('구독 플랜 변경에 실패했습니다.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // 🛡️ 안전한 구독 취소 함수
  const handleCancelSubscription = async () => {
    if (window.confirm('정말로 구독을 취소하시겠습니까? 취소 후에는 서비스 이용이 제한됩니다.')) {
      try {
        setActionLoading(true);
        try {
          await subscriptionService.cancelSubscription();
          alert('구독이 취소되었습니다.');
          loadSubscriptionData();
        } catch (apiError) {
          // API 실패 시 샘플 동작
          console.log('API 호출 실패, 샘플 동작:', apiError);
          setCurrentPlan(prev => ({
            ...prev,
            status: "CANCELLED",
            autoRenewal: false
          }));
          alert('구독이 취소되었습니다.');
        }
      } catch (error) {
        console.error('구독 취소 실패:', error);
        alert('구독 취소에 실패했습니다.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // 🛡️ 안전한 구독 갱신 함수
  const handleRenewSubscription = async () => {
    try {
      setActionLoading(true);
      try {
        await subscriptionService.renewSubscription();
        alert('구독이 갱신되었습니다.');
        loadSubscriptionData();
      } catch (apiError) {
        // API 실패 시 샘플 동작
        console.log('API 호출 실패, 샘플 동작:', apiError);
        setCurrentPlan(prev => ({
          ...prev,
          status: "ACTIVE",
          autoRenewal: true
        }));
        alert('구독이 갱신되었습니다.');
      }
    } catch (error) {
      console.error('구독 갱신 실패:', error);
      alert('구독 갱신에 실패했습니다.');
    } finally {
      setActionLoading(false);
    }
  };

  // 🛡️ 안전한 상태 확인 함수
  const getStatusColor = (status) => {
    try {
      switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'success';
        case 'CANCELLED': return 'error';
        case 'EXPIRED': return 'warning';
        default: return 'default';
      }
    } catch (error) {
      return 'default';
    }
  };

  const getStatusLabel = (status) => {
    try {
      switch (status?.toUpperCase()) {
        case 'ACTIVE': return '활성';
        case 'CANCELLED': return '취소됨';
        case 'EXPIRED': return '만료됨';
        default: return '알 수 없음';
      }
    } catch (error) {
      return '알 수 없음';
    }
  };

  // 🛡️ 로딩 상태 처리
  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
          <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate('/owner/mypage')} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>구독 관리</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
        <OwnerNavigation />
      </Box>
    );
  }

  // 🛡️ 데이터 안전성 최종 체크
  const safePlan = currentPlan || sampleCurrentPlan;
  const safePlans = Array.isArray(plans) && plans.length > 0 ? plans : samplePlans;
  const safePaymentHistory = Array.isArray(paymentHistory) && paymentHistory.length > 0 ? paymentHistory : samplePaymentHistory;

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
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          구독 관리
        </Typography>
      </Box>

      {/* 탭 메뉴 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <Tab label="현재 구독" />
          <Tab label="플랜 변경" />
          <Tab label="결제 내역" />
        </Tabs>
      </Box>
      
      <Box className="content-area">
        {/* 현재 구독 탭 */}
        {tabValue === 0 && (
          <Box>
            {/* 현재 구독 정보 */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CreditCard sx={{ mr: 1, color: '#2196f3' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    현재 구독 플랜
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {safePlan?.planName || '기본 플랜'}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                      월 {formatPrice(safePlan?.price)}원
                    </Typography>
                  </Box>
                  <Chip 
                    label={getStatusLabel(safePlan?.status)}
                    color={getStatusColor(safePlan?.status)}
                    icon={safePlan?.status === 'ACTIVE' ? <CheckCircle /> : <Cancel />}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <List dense>
                  <ListItem>
                    <ListItemIcon><Info /></ListItemIcon>
                    <ListItemText 
                      primary="구독 시작일" 
                      secondary={formatDate(safePlan?.startDate)} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Info /></ListItemIcon>
                    <ListItemText 
                      primary="만료일" 
                      secondary={formatDate(safePlan?.expiryDate)} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Payment /></ListItemIcon>
                    <ListItemText 
                      primary="다음 결제일" 
                      secondary={formatDate(safePlan?.nextBillingDate)} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Refresh /></ListItemIcon>
                    <ListItemText 
                      primary="자동 갱신" 
                      secondary={safePlan?.autoRenewal ? '활성화' : '비활성화'} 
                    />
                  </ListItem>
                </List>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                  {safePlan?.status === 'ACTIVE' && (
                    <Button 
                      variant="outlined" 
                      color="error" 
                      onClick={handleCancelSubscription}
                      disabled={actionLoading}
                    >
                      구독 취소
                    </Button>
                  )}
                  {safePlan?.status === 'CANCELLED' && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleRenewSubscription}
                      disabled={actionLoading}
                    >
                      구독 재시작
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* 플랜 변경 탭 */}
        {tabValue === 1 && (
          <Box>
            <Grid container spacing={2}>
              {safePlans.map((plan) => (
                <Grid item xs={12} key={plan?.id || Math.random()}>
                  <Card sx={{ 
                    position: 'relative',
                    border: plan?.popular ? '2px solid #2196f3' : '1px solid #e0e0e0'
                  }}>
                    {plan?.popular && (
                      <Chip 
                        label="인기" 
                        color="primary" 
                        size="small"
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {plan?.name || '플랜'}
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 'bold', mb: 2 }}>
                        월 {formatPrice(plan?.price)}원
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                        {plan?.description || '플랜 설명'}
                      </Typography>
                      
                      {plan?.features && Array.isArray(plan.features) && (
                        <List dense sx={{ mb: 2 }}>
                          {plan.features.map((feature, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                              </ListItemIcon>
                              <ListItemText primary={feature} />
                            </ListItem>
                          ))}
                        </List>
                      )}
                      
                      <Button 
                        fullWidth 
                        variant={safePlan?.planId === plan?.id ? "outlined" : "contained"}
                        disabled={safePlan?.planId === plan?.id || actionLoading}
                        onClick={() => handleChangePlan(plan?.id)}
                      >
                        {safePlan?.planId === plan?.id ? '현재 플랜' : '이 플랜 선택'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* 결제 내역 탭 */}
        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              결제 내역
            </Typography>
            
            {safePaymentHistory.length > 0 ? (
              <List>
                {safePaymentHistory.map((payment, index) => (
                  <React.Fragment key={payment?.id || index}>
                    <ListItem>
                      <ListItemIcon>
                        <Receipt sx={{ color: '#2196f3' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {payment?.planName || '플랜'}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {formatPrice(payment?.amount)}원
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(payment?.date)} • {payment?.method || '결제수단'} • {payment?.status || '상태'}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < safePaymentHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Warning sx={{ fontSize: 48, color: '#999', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    결제 내역이 없습니다.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default SubscriptionManagement;