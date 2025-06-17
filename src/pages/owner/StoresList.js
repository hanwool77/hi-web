import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Grid,
  Avatar, Chip, IconButton
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
      setStores(response.data || []);
    } catch (error) {
      console.error('매장 목록 로드 실패:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('정말로 매장을 삭제하시겠습니까?')) {
      try {
        await storeService.deleteStore(storeId);
        setStores(stores.filter(store => store.id !== storeId));
        alert('매장이 삭제되었습니다.');
      } catch (error) {
        console.error('매장 삭제 실패:', error);
        alert('매장 삭제에 실패했습니다.');
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

      <Box className="content-area">
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
                        <Typography variant="body2" color="text.secondary">
                          📞 {store.phone}
                        </Typography>
                        <Chip 
                          label={store.status === 'ACTIVE' ? '운영중' : '휴업'} 
                          color={store.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <IconButton
                        onClick={() => handleDeleteStore(store.id)}
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
                        onClick={() => navigate(`/owner/analytics/${store.storeId || store.id}`)}
                      >
                        분석
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Settings />}
                        onClick={() => navigate(`/owner/store-management/${store.storeId || store.id}`)}
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
