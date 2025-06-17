//* src/pages/owner/StoresList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Grid,
  Avatar, Chip, IconButton, CircularProgress
} from '@mui/material';
import { ArrowBack, Add, Analytics, Settings, Delete } from '@mui/icons-material';
import { storeService } from '../../services/storeService';
import OwnerNavigation from '../../components/common/OwnerNavigation';

const StoresList = () => {
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
      console.log('매장 목록 응답:', response);
      setStores(response.data || []);
    } catch (error) {
      console.error('매장 목록 로드 실패:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('정말로 매장을 삭제하시겠습니까?\n삭제된 매장은 복구할 수 없습니다.')) {
      try {
        console.log('삭제 요청 storeId:', storeId);
        
        await storeService.deleteStore(storeId);
        
        // 성공 시 목록에서 제거
        setStores(currentStores => 
          currentStores.filter(storeItem => {
            const currentStoreId = storeItem.storeId || storeItem.id;
            return currentStoreId !== storeId;
          })
        );
        
        alert('매장이 삭제되었습니다.');
        
      } catch (error) {
        console.error('매장 삭제 실패:', error);
        console.error('에러 상세:', error.response?.data);
        
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            '매장 삭제에 실패했습니다.';
        alert(errorMessage);
      }
    }
  };

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate('/owner')} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            내 매장 목록
          </Typography>
        </Box>
        <Button
          color="inherit"
          startIcon={<Add />}
          onClick={() => navigate('/owner/store/register')}
        >
          추가
        </Button>
      </Box>

      <Box className="content-area" sx={{ p: 2, pb: 10 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
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
            {stores.map((storeItem) => (
              <Grid item xs={12} key={storeItem.storeId || storeItem.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar
                        src={storeItem.image || '/images/store-default.jpg'}
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {storeItem.storeName || storeItem.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {storeItem.category} • {storeItem.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📞 {storeItem.phone}
                        </Typography>
                        <Chip 
                          label={storeItem.status === 'ACTIVE' ? '운영중' : '휴업'} 
                          color={storeItem.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <IconButton
                        onClick={() => handleDeleteStore(storeItem.storeId || storeItem.id)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Analytics />}
                        onClick={() => navigate(`/owner/analytics/${storeItem.storeId || storeItem.id}`)}
                      >
                        분석
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Settings />}
                        onClick={() => navigate(`/owner/store-management/${storeItem.storeId || storeItem.id}`)}
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

export default StoresList;