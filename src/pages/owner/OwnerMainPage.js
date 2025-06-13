import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Grid,
  Avatar, Chip
} from '@mui/material';
import { Add, Store, Analytics, Assignment } from '@mui/icons-material';
import { storeService } from '../../services/storeService';
import OwnerNavigation from '../../components/common/OwnerNavigation';

const OwnerMainPage = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOwnerStores();
  }, []);

  const loadOwnerStores = async () => {
    try {
      setLoading(true);
      const response = await storeService.getOwnerStores();
      setStores(response.data || []);
    } catch (error) {
      console.error('매장 목록 로드 실패:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: <Add />,
      title: '매장 등록',
      description: '새로운 매장 등록하기',
      action: () => navigate('/owner/store/register')
    },
    {
      icon: <Store />,
      title: '매장 목록',
      description: '등록된 매장 관리',
      action: () => navigate('/owner/stores')
    }
  ];

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          점주 대시보드
        </Typography>
        <Typography variant="body2">
          매장 관리 및 분석
        </Typography>
      </Box>

      <Box className="content-area">
        {/* 빠른 실행 */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          빠른 실행
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={6} key={index}>
              <Card onClick={action.action} sx={{ cursor: 'pointer', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  {action.icon}
                  <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {action.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 내 매장 목록 */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          내 매장 ({stores.length})
        </Typography>

        {loading ? (
          <Typography>로딩 중...</Typography>
        ) : stores.length === 0 ? (
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              등록된 매장이 없습니다.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/owner/store/register')}
            >
              첫 매장 등록하기
            </Button>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {stores.map((store) => (
              <Grid item xs={12} key={store.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar
                        src={store.image || '/images/store-default.jpg'}
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {store.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {store.category} • {store.address}
                        </Typography>
                        <Chip 
                          label={store.status === 'ACTIVE' ? '운영중' : '휴업'} 
                          color={store.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Analytics />}
                        onClick={() => navigate(`/owner/stores/${store.id}/analytics`)}
                      >
                        분석
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Assignment />}
                        onClick={() => navigate(`/owner/stores/${store.id}/management`)}
                      >
                        관리
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <OwnerNavigation />
    </Box>
  );
};

export default OwnerMainPage;
