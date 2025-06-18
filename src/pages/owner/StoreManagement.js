//* src/pages/owner/StoreManagement.js - 기존 화면 복원 + OwnerHeader 적용
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import { 
  Assessment,
  MenuBook,
  RateReview,
  Link,
  Settings,
  Psychology,
  AutoAwesome,
  Store as StoreIcon
} from '@mui/icons-material';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import { storeService } from '../../services/storeService';
import { analyticsService } from '../../services/analyticsService';
import OwnerHeader from '../../components/common/OwnerHeader';
import OwnerNavigation from '../../components/common/Navigation';

const StoreManagement = () => {
  const navigate = useNavigate();
  const { selectedStoreId, selectedStore } = useSelectedStore();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (selectedStoreId) {
      loadStoreInfo();
    } else {
      setLoading(false);
    }
  }, [selectedStoreId]);

  const loadStoreInfo = async () => {
    try {
    setLoading(true);
    console.log('매장 정보 로드 시작:', selectedStoreId);
    
    const response = await storeService.getStoreDetail(selectedStoreId);
    console.log('🔍 매장 정보 API 전체 응답:', response);
    
    // ✅ 응답 구조를 더 정확하게 파싱
    let storeData = null;
    
    if (response && response.success && response.data) {
      // ApiResponse<StoreDetailResponse> 구조
      storeData = response.data;
      console.log('✅ ApiResponse 구조로 파싱:', storeData);
    } else if (response && response.storeId) {
      // StoreDetailResponse 직접 반환 구조
      storeData = response;
      console.log('✅ 직접 응답 구조로 파싱:', storeData);
    } else if (response && response.data && response.data.storeId) {
      // 중첩된 data 구조
      storeData = response.data;
      console.log('✅ 중첩 data 구조로 파싱:', storeData);
    } else {
      console.error('❌ 예상하지 못한 API 응답 구조:', response);
      console.error('❌ response.success:', response?.success);
      console.error('❌ response.data:', response?.data);
      console.error('❌ response.storeId:', response?.storeId);
      throw new Error('매장 정보를 찾을 수 없습니다.');
    }
        
    setStore(storeData);
    setImageError(false);
      
    } catch (error) {
      console.error('매장 정보 로드 실패:', error);
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  // AI 피드백 생성 요청 핸들러
  const handleGenerateAIAnalysis = async () => {
    try {
      setAiAnalysisLoading(true);
      console.log('AI 분석 생성 요청:', selectedStoreId);
      
      const response = await analyticsService.generateAIAnalysis(selectedStoreId, {
        days: 30,
        generateActionPlan: true
      });
      
      console.log('AI 분석 생성 응답:', response);
      setAnalysisResult(response.data);
      
      // 5초 후 성공 메시지 숨김
      setTimeout(() => {
        setAnalysisResult(null);
      }, 5000);
      
    } catch (error) {
      console.error('AI 분석 생성 실패:', error);
      alert('AI 분석 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  // 이미지 로드 에러 핸들러
  const handleImageError = () => {
    setImageError(true);
  };

  // 메뉴 클릭 핸들러들
  const handleMenuClick = (path) => {
    if (!selectedStoreId) {
      alert('매장을 선택해주세요.');
      return;
    }
    navigate(path);
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <OwnerHeader 
          title="매장 관리"
          subtitle="매장 정보 로딩 중..."
          showStoreSelector={true}
          showBackButton={false}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
        <OwnerNavigation />
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      <OwnerHeader 
        title="매장 관리"
        subtitle={selectedStore ? `${selectedStore.name} 관리` : '매장을 선택해주세요'}
        showStoreSelector={true}
        showBackButton={false}
      />
      
      <Box className="content-area">
        {!selectedStoreId ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <StoreIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                관리할 매장을 선택해주세요
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                우측 상단에서 매장을 선택할 수 있습니다
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* AI 분석 결과 표시 */}
            {analysisResult && (
              <Alert severity="success" sx={{ mb: 2 }}>
                AI 분석이 완료되었습니다! 분석 결과를 확인해보세요.
              </Alert>
            )}

            {/* 매장 정보 카드 */}
            {store && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  {/* 매장 이미지 */}
                  {store.imageUrl && !imageError ? (
                    <Box
                      component="img"
                      sx={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mb: 2
                      }}
                      src={store.imageUrl}
                      alt={store.name}
                      onError={handleImageError}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: 150,
                        bgcolor: 'grey.200',
                        borderRadius: 1,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <StoreIcon sx={{ fontSize: 48, color: 'grey.500' }} />
                    </Box>
                  )}

                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {store.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    📍 {store.address}
                  </Typography>
                  {store.phone && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      📞 {store.phone}
                    </Typography>
                  )}
                  {store.operatingHours && (
                    <Typography variant="body2" color="text.secondary">
                      🕒 {store.operatingHours}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}

            {/* AI 분석 생성 버튼 */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AutoAwesome sx={{ fontSize: 24, color: '#9c27b0', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    AI 분석 요청
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  최근 30일간의 데이터를 바탕으로 AI 분석과 실행계획을 생성합니다.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  startIcon={<Psychology />}
                  onClick={handleGenerateAIAnalysis}
                  disabled={aiAnalysisLoading}
                >
                  {aiAnalysisLoading ? 'AI 분석 생성 중...' : 'AI 분석 생성'}
                </Button>
              </CardContent>
            </Card>

            {/* 관리 메뉴 */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  매장 관리 메뉴
                </Typography>
                <List sx={{ p: 0 }}>
                  <ListItem 
                    button 
                    onClick={() => handleMenuClick(`/owner/analytics/${selectedStoreId}`)}
                  >
                    <ListItemIcon>
                      <Assessment sx={{ color: '#2196f3' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="매장 분석"
                      secondary="상세 분석 및 통계 확인"
                    />
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem 
                    button 
                    onClick={() => handleMenuClick('/owner/menu-management')}
                  >
                    <ListItemIcon>
                      <MenuBook sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="메뉴 관리"
                      secondary="메뉴 등록, 수정, 삭제"
                    />
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem 
                    button 
                    onClick={() => handleMenuClick('/owner/review-management')}
                  >
                    <ListItemIcon>
                      <RateReview sx={{ color: '#ff9800' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="리뷰 관리"
                      secondary="고객 리뷰 확인 및 답변"
                    />
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem 
                    button 
                    onClick={() => handleMenuClick('/owner/external-integration')}
                  >
                    <ListItemIcon>
                      <Link sx={{ color: '#9c27b0' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="외부 연동"
                      secondary="네이버, 카카오, 구글 연동"
                    />
                  </ListItem>
                  
                  <Divider />
                  
                  <ListItem 
                    button 
                    onClick={() => handleMenuClick('/owner/store-info')}
                  >
                    <ListItemIcon>
                      <Settings sx={{ color: '#607d8b' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="매장 정보 수정"
                      secondary="기본 정보 및 설정 변경"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default StoreManagement;