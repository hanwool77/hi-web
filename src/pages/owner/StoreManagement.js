//* src/pages/owner/StoreManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { 
  Store,
  Assessment,
  MenuBook,
  RateReview,
  Link,
  Settings,
  Psychology,
  AutoAwesome
} from '@mui/icons-material';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import { storeService } from '../../services/storeService';
import { analyticsService } from '../../services/analyticsService';
import OwnerNavigation from '../../components/common/Navigation';

const StoreManagement = () => {
  const navigate = useNavigate();
  const { selectedStoreId, setSelectedStoreId } = useSelectedStore();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    if (selectedStoreId) {
      loadStoreInfo();
    }
  }, [selectedStoreId]);

  const loadStoreInfo = async () => {
    try {
      setLoading(true);
      const response = await storeService.getStoreInfo(selectedStoreId);
      setStore(response.data);
    } catch (error) {
      console.error('매장 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // AI 피드백 생성 요청 핸들러
  const handleGenerateAIAnalysis = async () => {
    try {
      setAiAnalysisLoading(true);
      // 실제 백엔드 API 호출: /api/analytics/stores/{storeId}/ai-analysis
      const response = await analyticsService.generateAIAnalysis(selectedStoreId, {
        days: 30,
        generateActionPlan: true
      });
      
      setAnalysisResult(response.data);
      
      // 성공 메시지 표시
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

  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
        <OwnerNavigation />
      </Box>
    );
  }

  if (!store) {
    return (
      <Box className="mobile-container">
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6">매장 정보를 찾을 수 없습니다.</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/owner/stores')}
          >
            매장 선택하기
          </Button>
        </Box>
        <OwnerNavigation />
      </Box>
    );
  }

  const menuItems = [
    {
      icon: <MenuBook />,
      title: '메뉴 관리',
      description: '메뉴 등록, 수정, 삭제',
      action: () => navigate('/owner/menu')
    },
    {
      icon: <RateReview />,
      title: '리뷰 관리',
      description: '고객 리뷰 확인 및 답글',
      action: () => navigate('/owner/reviews')
    },
    {
      icon: <Assessment />,
      title: '매장 분석',
      description: 'AI 피드백 및 통계 분석',
      action: () => navigate(`/owner/analytics/${selectedStoreId}`)
    },
    {
      icon: <Link />,
      title: '외부 플랫폼 연동',
      description: '네이버, 카카오, 구글 연동 관리',
      action: () => navigate('/owner/external')
    },
    {
      icon: <Settings />,
      title: '매장 정보 관리',
      description: '기본 정보, 운영시간 등',
      action: () => navigate(`/owner/store/${selectedStoreId}/info`)
    }
  ];

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          매장 관리
        </Typography>
        <Typography variant="body2">
          {store.name}
        </Typography>
      </Box>
      
      <Box className="content-area">
        {/* 매장 정보 카드 */}
        <Card sx={{ mb: 3 }}>
          <Box
            component="img"
            sx={{ width: '100%', height: 150, objectFit: 'cover' }}
            src={store.image || '/images/default-store.jpg'}
            alt={store.name}
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {store.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              📍 {store.address || store.location}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              📞 {store.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              🕒 {store.operatingHours || '운영시간 미등록'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                  {store.status === 'ACTIVE' ? '영업중' : '영업종료'}
                </Typography>
                <Typography variant="caption">상태</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* AI 분석 생성 섹션 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Psychology sx={{ fontSize: 32, color: '#9c27b0', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                AI 분석 관리
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              최신 리뷰 데이터를 기반으로 AI 피드백과 실행계획을 생성합니다.
            </Typography>
            
            {analysisResult && (
              <Alert severity="success" sx={{ mb: 2 }}>
                AI 분석이 성공적으로 생성되었습니다! 분석 화면에서 확인해보세요.
              </Alert>
            )}
            
            <Button
              variant="contained"
              startIcon={<AutoAwesome />}
              onClick={handleGenerateAIAnalysis}
              disabled={aiAnalysisLoading}
              sx={{ 
                bgcolor: '#9c27b0',
                '&:hover': { bgcolor: '#7b1fa2' }
              }}
              fullWidth
            >
              {aiAnalysisLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  AI 분석 생성 중...
                </>
              ) : (
                'AI 피드백 생성 요청'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 메뉴 목록 */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              관리 메뉴
            </Typography>
            <List sx={{ p: 0 }}>
              {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    button
                    onClick={item.action}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: '#2c3e50' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontWeight: 'bold'
                      }}
                    />
                  </ListItem>
                  {index < menuItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default StoreManagement;
          