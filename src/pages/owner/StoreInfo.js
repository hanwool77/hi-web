//* src/pages/owner/StoreInfo.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  TextField,
  Button,
  Grid,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Save, Store } from '@mui/icons-material';
import { storeApi } from '../../services/api';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerHeader from '../../components/common/OwnerHeader';
import Navigation from '../../components/common/Navigation';

const StoreInfo = () => {
  const navigate = useNavigate();
  const { selectedStoreId, selectedStore, refreshStores } = useSelectedStore();
  const [storeInfo, setStoreInfo] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    operatingHours: '',
    category: '',
    tags: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = [
    '한식', '양식', '일식', '중식', '카페', '디저트', '패스트푸드', '분식', '치킨', '피자'
  ];

  const availableTags = [
    '비건', '반려동물동반', '혼밥', '저염', '무글루텐', '할랄', '테이크아웃', '배달', '주차가능', '와이파이'
  ];

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
      const response = await storeApi.get(`/api/stores/${selectedStoreId}`);
      const data = response.data.data || {};
      setStoreInfo({
        name: data.storeName || '',
        description: data.description || '',
        address: data.address || '',
        phone: data.phone || '',
        operatingHours: data.operatingHours || '',
        category: data.category || '',
        tags: data.tags || []
      });
    } catch (error) {
      console.error('매장 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await storeApi.put(`/api/stores/${selectedStoreId}`, storeInfo);
      alert('매장 정보가 저장되었습니다.');
      refreshStores(); // 매장 목록 새로고침
    } catch (error) {
      console.error('매장 정보 저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setStoreInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setStoreInfo(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <OwnerHeader 
          title="매장 정보 관리"
          subtitle="로딩 중..."
          showStoreSelector={true}
          backPath="/owner/store-management"
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      <OwnerHeader 
        title="매장 정보 관리"
        subtitle={selectedStore ? `${selectedStore.name} 정보` : '매장을 선택해주세요'}
        showStoreSelector={true}
        backPath="/owner/store-management"
      />
      
      <Box className="content-area">
        {!selectedStoreId ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Store sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                정보를 수정할 매장을 선택해주세요
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                우측 상단에서 매장을 선택할 수 있습니다
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box>
            {/* 기본 정보 */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  🏪 기본 정보
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="매장명"
                      value={storeInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="매장 설명"
                      value={storeInfo.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      variant="outlined"
                      multiline
                      rows={3}
                      placeholder="매장을 소개하는 간단한 설명을 입력해주세요"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>카테고리</InputLabel>
                      <Select
                        value={storeInfo.category}
                        label="카테고리"
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 연락처 정보 */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  📞 연락처 정보
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="주소"
                      value={storeInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      variant="outlined"
                      placeholder="도로명 주소를 입력해주세요"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="전화번호"
                      value={storeInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      variant="outlined"
                      placeholder="010-1234-5678"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="운영시간"
                      value={storeInfo.operatingHours}
                      onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                      variant="outlined"
                      placeholder="예: 월-금 09:00-22:00, 토-일 10:00-21:00"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 태그 설정 */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  🏷️ 매장 특징 태그
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  매장의 특징을 나타내는 태그를 선택해주세요 (복수 선택 가능)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      clickable
                      color={storeInfo.tags.includes(tag) ? 'primary' : 'default'}
                      variant={storeInfo.tags.includes(tag) ? 'filled' : 'outlined'}
                      onClick={() => handleTagToggle(tag)}
                    />
                  ))}
                </Box>
                {storeInfo.tags.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      선택된 태그: {storeInfo.tags.join(', ')}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* 저장 버튼 */}
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={saving}
                  fullWidth
                >
                  {saving ? '저장 중...' : '매장 정보 저장'}
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
      
      <Navigation />
    </Box>
  );
};

export default StoreInfo;