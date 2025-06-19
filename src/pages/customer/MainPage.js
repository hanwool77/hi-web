//* src/pages/customer/MainPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Avatar, Chip,
  TextField, InputAdornment, Grid, Button
} from '@mui/material';
import { Search, Star } from '@mui/icons-material';
import { recommendService } from '../../services/recommendService';
import { storeService } from '../../services/storeService';
import { reviewService } from '../../services/reviewService'; // 추가
import Navigation from '../../components/common/Navigation';

const MainPage = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState(['전체']);
  const [loading, setLoading] = useState(true);
  const { storeId } = useParams();

  const tags = ['전체', '한식', '양식', '일식', '중식', '카페', '디저트', '건강식', '비건', '반려동물'];

  useEffect(() => {
    getAllStores();
  }, [storeId]);

  // 리뷰 데이터를 포함한 매장 정보 계산 함수
  const calculateStoreReviewStats = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return { rating: 0, reviewCount: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const averageRating = totalRating / reviews.length;
    
    return {
      rating: averageRating,
      reviewCount: reviews.length
    };
  };

  const getAllStores = async () => {
    try {
      setLoading(true);
      const response = await storeService.getAllStores();
      const storeList = response.data || [];
      
      // 각 매장의 리뷰 데이터를 가져와서 평점과 리뷰 수 계산
      const storesWithReviewData = await Promise.all(
        storeList.map(async (store) => {
          try {
            // 매장별 리뷰 데이터 가져오기
            const reviewResponse = await reviewService.getStoreReviews(store.storeId || store.id);
            
            // 응답 구조에 따른 리뷰 데이터 추출
            let reviewData = [];
            if (reviewResponse && Array.isArray(reviewResponse)) {
              reviewData = reviewResponse;
            } else if (reviewResponse && reviewResponse.data && Array.isArray(reviewResponse.data)) {
              reviewData = reviewResponse.data;
            } else if (reviewResponse && reviewResponse.success && Array.isArray(reviewResponse.data)) {
              reviewData = reviewResponse.data;
            }

            // 활성 상태의 리뷰만 필터링
            const activeReviews = reviewData.filter(review => 
              review.status !== 'DELETED' && review.status !== 'HIDDEN'
            );

            // 리뷰 통계 계산
            const reviewStats = calculateStoreReviewStats(activeReviews);
            
            return {
              ...store,
              rating: reviewStats.rating,
              reviewCount: reviewStats.reviewCount,
              reviews: activeReviews // 필요시 전체 리뷰 데이터도 포함
            };
          } catch (error) {
            console.error(`매장 ${store.storeId || store.id} 리뷰 로드 실패:`, error);
            // 리뷰 로드 실패시 기본값 사용
            return {
              ...store,
              rating: store.rating || 0,
              reviewCount: store.reviewCount || 0
            };
          }
        })
      );
      
      setStores(storesWithReviewData);
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
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          맛있는 식당을 찾아보세요
        </Typography>
      </Box>

      <Box className="content-area">
        {/* 검색 */}
        <TextField
          fullWidth
          placeholder="매장명, 음식 종류 검색"
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
            카테고리
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
              <Grid item xs={12} key={store.id || store.storeId}>
                <Card 
                  onClick={() => handleStoreClick(store.storeId || store.id)}
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
                          {store.storeName || store.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {store.category} • {store.address}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Star sx={{ color: '#ffc107', fontSize: 16 }} />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {store.rating ? store.rating.toFixed(1) : '0.0'} ({formatNumber(store.reviewCount || 0)})
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