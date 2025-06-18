import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Avatar, Chip,
  TextField, InputAdornment, Grid, Button
} from '@mui/material';
import { Search, LocationOn, Star } from '@mui/icons-material';
import { recommendService } from '../../services/recommendService';
import { storeService } from '../../services/storeService';
import Navigation from '../../components/common/Navigation';

const MainPage = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState(['전체']);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { storeId } = useParams();

  const tags = ['전체', '한식', '양식', '일식', '중식', '카페', '디저트', '건강식', '비건', '반려동물'];

  useEffect(() => {
    getAllStores();
    getCurrentLocation();
  }, [storeId]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
        }
      );
    }
  };

  const getAllStores = async () => {
    try {
      setLoading(true);
      const response = await storeService.getAllStores();
      setStores(response.data || []);
    } catch (error) {
      console.error('매장 목록 로드 실패:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStoreClick = (storeId) => {
    navigate(`/customer/store/${storeId}`);
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          🍽️ 하이오더
        </Typography>
        {userLocation && (
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
            현재 위치 기반 추천
          </Typography>
        )}
      </Box>

      <Box className="content-area">
        {/* 검색바 */}
        <TextField
          fullWidth
          placeholder="매장명으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* 태그 필터 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            취향 선택
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagClick(tag)}
                variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* 매장 목록 */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          추천 매장
        </Typography>

        {loading ? (
          <Typography>로딩 중...</Typography>
        ) : stores.length === 0 ? (
          <Typography color="text.secondary">추천 매장이 없습니다.</Typography>
        ) : (
          <Grid container spacing={2}>
            {stores.map((store) => (
              <Grid item xs={12} key={store.id}>
                <Card 
                  onClick={() => handleStoreClick(store.storeId)}
                  sx={{ cursor: 'pointer' }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar
                        src={store.imageUrl || '/images/store-default.jpg'}
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {store.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {store.category} • {store.address}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Star sx={{ color: '#ffc107', fontSize: 16 }} />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {store.rating?.toFixed(1) || '0.0'} ({formatNumber(store.reviewCount)})
                          </Typography>
                        </Box>
                        {store.tags && (
                          <Box sx={{ mt: 1 }}>
                            {store.tags.slice(0, 3).map((tag, index) => (
                              <Chip key={index} label={tag} size="small" sx={{ mr: 0.5 }} />
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Navigation />
    </Box>
  );
};

export default MainPage;
