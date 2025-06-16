//* src/pages/owner/StoreInfo.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  TextField,
  Button,
  Grid
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { storeApi } from '../../services/api';
import OwnerNavigation from '../../components/common/Navigation';

const StoreInfo = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [storeInfo, setStoreInfo] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    operatingHours: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoreInfo();
  }, [storeId]);

  const loadStoreInfo = async () => {
    try {
      const response = await storeApi.get(`/api/stores/${storeId}`);
      setStoreInfo(response.data.data || {});
    } catch (error) {
      console.error('매장 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await storeApi.put(`/api/stores/${storeId}`, storeInfo);
      alert('매장 정보가 저장되었습니다.');
    } catch (error) {
      console.error('매장 정보 저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleInputChange = (field, value) => {
    setStoreInfo(prev => ({
      ...prev,
      [field]: value
    }));
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
          onClick={() => navigate(`/owner/stores/${storeId}/management`)}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            매장 정보 관리
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="매장명"
                  value={storeInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="매장 설명"
                  multiline
                  rows={3}
                  value={storeInfo.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="주소"
                  value={storeInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="전화번호"
                  value={storeInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="운영시간"
                  value={storeInfo.operatingHours}
                  onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                  placeholder="예: 09:00 - 22:00"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="카테고리"
                  value={storeInfo.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
              </Grid>
            </Grid>
            
            <Button
              fullWidth
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{ mt: 3 }}
            >
              저장
            </Button>
          </CardContent>
        </Card>
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default StoreInfo;