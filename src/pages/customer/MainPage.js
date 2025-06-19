//* src/pages/customer/MainPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Avatar, Chip,
  TextField, InputAdornment, Grid, Button, IconButton
} from '@mui/material';
import { Search, Star, Clear } from '@mui/icons-material';
import { recommendService } from '../../services/recommendService';
import { storeService } from '../../services/storeService';
import { reviewService } from '../../services/reviewService';
import Navigation from '../../components/common/Navigation';

const MainPage = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState(['전체']);
  const [loading, setLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false); // 검색 모드 여부
  const { storeId } = useParams();

  const tags = ['전체', '한식', '양식', '일식', '중식', '카페'];

  useEffect(() => {
    // 컴포넌트 마운트시 전체 매장 로드
    loadStoresByTags(['전체']);
  }, []); // 빈 의존성 배열로 초기 로드만

  useEffect(() => {
    // selectedTags 변경시 매장 목록 재로드 (검색 모드가 아닐 때만)
    if (!isSearchMode) {
      loadStoresByTags(selectedTags);
    }
  }, [selectedTags, isSearchMode]); // selectedTags 변경시 매장 목록 재로드

  // 검색어 변경 처리
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // 검색어가 있으면 검색 모드 활성화
    if (value.trim()) {
      setIsSearchMode(true);
      // 실시간 검색 (디바운스 없이 바로 검색)
      performSearch(value.trim());
    } else {
      // 검색어가 없으면 검색 모드 비활성화하고 원래 태그별 결과 복원
      setIsSearchMode(false);
      loadStoresByTags(selectedTags);
    }
  };

  // 검색 실행
  const performSearch = async (keyword) => {
    try {
      setLoading(true);
      console.log('🔍 매장명 검색 시작:', keyword);
      
      // 백엔드 API에 맞게 searchStoresByName 사용
      const response = await storeService.searchStoresByName(keyword);
      console.log('✅ 검색 결과:', response);
      
      // API 응답 구조에 맞게 데이터 추출
      const searchResults = response.data || response || [];
      
      // 검색 결과에 리뷰 데이터 추가
      const storesWithReviewData = await Promise.all(
        searchResults.map(async (store) => {
          try {
            const reviewResponse = await reviewService.getStoreReviews(store.storeId || store.id);
            const reviews = reviewResponse.data || reviewResponse || [];
            const { rating, reviewCount } = calculateStoreReviewStats(reviews);
            
            return {
              ...store,
              rating: rating || store.rating || 0,
              reviewCount: reviewCount || store.reviewCount || 0,
              tags: parseTagJson(store.tagJson, store.storeId || store.id)
            };
          } catch (error) {
            console.error(`매장 ${store.storeId || store.id} 리뷰 데이터 로드 실패:`, error);
            return {
              ...store,
              rating: store.rating || 0,
              reviewCount: store.reviewCount || 0,
              tags: parseTagJson(store.tagJson, store.storeId || store.id)
            };
          }
        })
      );
      
      setStores(storesWithReviewData);
      console.log(`🎯 검색 완료 (${storesWithReviewData.length}개 매장 발견)`);
      
    } catch (error) {
      console.error('❌ 매장 검색 실패:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  // 검색 초기화
  const handleSearchClear = () => {
    setSearchTerm('');
    setIsSearchMode(false);
    loadStoresByTags(selectedTags);
  };

  // Enter 키로 검색
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      performSearch(searchTerm.trim());
    }
  };

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

  // tagJson을 파싱하여 태그 배열로 변환하는 함수
  const parseTagJson = (tagJson, storeId = null) => {
    console.log(`[매장 ${storeId}] tagJson 파싱 시도:`, tagJson);
    
    if (!tagJson) {
      console.log(`[매장 ${storeId}] tagJson이 없음`);
      return [];
    }

    try {
      // 이미 배열인 경우
      if (Array.isArray(tagJson)) {
        console.log(`[매장 ${storeId}] tagJson이 이미 배열:`, tagJson);
        return tagJson;
      }

      // 문자열인 경우 JSON 파싱 시도
      if (typeof tagJson === 'string') {
        const parsed = JSON.parse(tagJson);
        console.log(`[매장 ${storeId}] tagJson 파싱 결과:`, parsed);
        
        // 파싱 결과가 배열인 경우
        if (Array.isArray(parsed)) {
          return parsed;
        }
        
        // 파싱 결과가 객체인 경우 (예: {"tags": ["한식", "분식"]})
        if (typeof parsed === 'object' && parsed.tags && Array.isArray(parsed.tags)) {
          return parsed.tags;
        }
      }

      console.log(`[매장 ${storeId}] tagJson 파싱 불가, 기본값 반환`);
      return [];
    } catch (error) {
      console.error(`[매장 ${storeId}] tagJson 파싱 에러:`, error);
      return [];
    }
  };

  // 매장 상세로 이동
  const handleStoreClick = (storeId) => {
    navigate(`/store/${storeId}`);
  };

  // 전체 매장 목록 조회 함수
  const getAllStores = async () => {
    try {
      console.log('📋 전체 매장 목록 조회 시작');
      const response = await storeService.getAllStores();
      console.log('✅ 전체 매장 API 응답:', response);
      
      const storeList = response.data || response || [];
      console.log(`📋 전체 매장 목록 (${storeList.length}개):`, storeList);
      
      if (storeList.length === 0) {
        console.log('⚠️ 전체 매장이 없습니다.');
        setStores([]);
        return;
      }
      
      // 각 매장의 리뷰 데이터를 가져와서 평점과 리뷰 수 계산
      const storesWithReviewData = await Promise.all(
        storeList.map(async (store) => {
          try {
            console.log(`🔄 매장 ${store.storeId || store.id} 리뷰 데이터 로드 중...`);
            
            // 매장별 리뷰 데이터 가져오기
            const reviewResponse = await reviewService.getStoreReviews(store.storeId || store.id);
            const reviews = reviewResponse.data || reviewResponse || [];
            console.log(`📝 매장 ${store.storeId || store.id} 리뷰 데이터 (${reviews.length}개):`, reviews);
            
            // 평점과 리뷰 수 계산
            const { rating, reviewCount } = calculateStoreReviewStats(reviews);
            
            // 태그 정보 파싱
            const tags = parseTagJson(store.tagJson, store.storeId || store.id);
            
            return {
              ...store,
              rating: rating || store.rating || 0,
              reviewCount: reviewCount || store.reviewCount || 0,
              tags: tags
            };
          } catch (error) {
            console.error(`❌ 매장 ${store.storeId || store.id} 리뷰 데이터 로드 실패:`, error);
            return {
              ...store,
              rating: store.rating || 0,
              reviewCount: store.reviewCount || 0,
              tags: parseTagJson(store.tagJson, store.storeId || store.id)
            };
          }
        })
      );
      
      console.log(`🎯 최종 전체 매장 목록 (${storesWithReviewData.length}개):`, storesWithReviewData);
      setStores(storesWithReviewData);
      
    } catch (error) {
      console.error('❌ 전체 매장 목록 로드 실패:', error);
      setStores([]);
    }
  };

  // 태그 클릭 핸들러
  const handleTagClick = (tag) => {
    // 검색 모드일 때 태그 클릭하면 검색 초기화
    if (isSearchMode) {
      setSearchTerm('');
      setIsSearchMode(false);
    }
    
    console.log('🏷️ 태그 클릭됨:', tag);
    console.log('🏷️ 현재 선택된 태그들:', selectedTags);
    
    let newTags = [];
    
    if (tag === '전체') {
      // '전체' 클릭시 다른 태그 모두 해제
      newTags = ['전체'];
      console.log('🏷️ "전체" 태그 선택, 다른 태그 모두 해제');
    } else {
      // 다른 태그 클릭시
      if (selectedTags.includes('전체')) {
        // '전체'가 선택된 상태면 '전체' 해제하고 해당 태그만 선택
        newTags = [tag];
        console.log('🏷️ "전체" 태그 해제, 새 태그 선택:', tag);
      } else if (selectedTags.includes(tag)) {
        // 이미 선택된 태그면 해제
        newTags = selectedTags.filter(t => t !== tag);
        // 모든 태그가 해제되면 '전체' 선택
        if (newTags.length === 0) {
          newTags = ['전체'];
          console.log('🏷️ 모든 태그 해제됨, "전체" 태그로 변경');
        } else {
          console.log('🏷️ 태그 제거됨, 남은 태그들:', newTags);
        }
      } else {
        // 새로운 태그 추가
        newTags = selectedTags.includes('전체') 
          ? [tag]  // '전체'가 있었다면 '전체' 제거하고 새 태그만
          : [...selectedTags.filter(t => t !== '전체'), tag];
        console.log('🏷️ 새 태그 추가됨, 새로운 태그들:', newTags);
      }
    }
    
    setSelectedTags(newTags);
  };

  // 선택된 태그에 따라 매장 목록을 필터링하거나 API 호출
  const loadStoresByTags = async (tags) => {
    try {
      setLoading(true);
      console.log('🏷️ loadStoresByTags 호출됨, 선택된 태그들:', tags);
      
      if (tags.includes('전체') || tags.length === 0) {
        // '전체' 선택시 모든 매장 조회
        console.log('📋 전체 매장 조회 시작');
        await getAllStores();
      } else {
        // 특정 태그 선택시 카테고리별 매장 조회
        console.log('🔍 카테고리별 매장 조회 시작:', tags);
        await getStoresByCategory(tags);
      }
    } catch (error) {
      console.error('❌ 매장 목록 로드 실패:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리별 매장 조회 함수
  const getStoresByCategory = async (categories) => {
    try {
      console.log('🔍 getStoresByCategory 시작, 카테고리들:', categories);
      const allStoresWithReviews = [];
      
      // 각 카테고리별로 API 호출
      for (const category of categories) {
        console.log(`📡 카테고리 "${category}" 매장 조회 API 호출 중...`);
        
        try {
          const response = await storeService.getStoresByCategory(category);
          console.log(`✅ 카테고리 "${category}" API 응답:`, response);
          
          const storeList = response.data || response || [];
          console.log(`📋 카테고리 "${category}" 매장 목록 (${storeList.length}개):`, storeList);
          
          if (storeList.length === 0) {
            console.log(`⚠️ 카테고리 "${category}"에 매장이 없습니다.`);
            continue;
          }
          
          // 각 매장의 리뷰 데이터를 가져와서 평점과 리뷰 수 계산
          const storesWithReviewData = await Promise.all(
            storeList.map(async (store) => {
              try {
                console.log(`🔄 매장 ${store.storeId || store.id} 리뷰 데이터 로드 중...`);
                
                // 매장별 리뷰 데이터 가져오기
                const reviewResponse = await reviewService.getStoreReviews(store.storeId || store.id);
                const reviews = reviewResponse.data || reviewResponse || [];
                
                // 평점과 리뷰 수 계산
                const { rating, reviewCount } = calculateStoreReviewStats(reviews);
                
                // 태그 정보 파싱
                const tags = parseTagJson(store.tagJson, store.storeId || store.id);
                
                return {
                  ...store,
                  rating: rating || store.rating || 0,
                  reviewCount: reviewCount || store.reviewCount || 0,
                  tags: tags
                };
              } catch (error) {
                console.error(`❌ 매장 ${store.storeId || store.id} 리뷰 데이터 로드 실패:`, error);
                return {
                  ...store,
                  rating: store.rating || 0,
                  reviewCount: store.reviewCount || 0,
                  tags: parseTagJson(store.tagJson, store.storeId || store.id)
                };
              }
            })
          );
          
          allStoresWithReviews.push(...storesWithReviewData);
          
        } catch (categoryError) {
          console.error(`❌ 카테고리 "${category}" API 호출 실패:`, categoryError);
          // 해당 카테고리만 실패해도 다른 카테고리는 계속 진행
          continue;
        }
      }
      
      // 중복 제거 (storeId 기준)
      const uniqueStores = allStoresWithReviews.filter((store, index, self) => 
        index === self.findIndex(s => (s.storeId || s.id) === (store.storeId || store.id))
      );
      
      console.log(`🎯 최종 카테고리별 매장 목록 (${uniqueStores.length}개):`, uniqueStores);
      setStores(uniqueStores);
      
    } catch (error) {
      console.error('❌ 카테고리별 매장 목록 로드 실패:', error);
      setStores([]);
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
          🍽️ 하이소피
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {isSearchMode && searchTerm ? `"${searchTerm}" 검색 결과` : '맛있는 식당을 찾아보세요'}
        </Typography>
      </Box>

      <Box className="content-area">
        {/* 검색 */}
        <TextField
          fullWidth
          placeholder="매장명, 음식 종류 검색"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleSearchClear}
                  edge="end"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* 태그 필터 - 검색 모드가 아닐 때만 표시 */}
        {!isSearchMode && (
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
        )}

        {/* 검색 모드일 때 검색 결과 안내 */}
        {isSearchMode && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              "{searchTerm}" 검색 결과 {stores.length}개
            </Typography>
            <Button
              size="small"
              onClick={handleSearchClear}
              variant="outlined"
              color="primary"
            >
              검색 초기화
            </Button>
          </Box>
        )}

        {/* 매장 목록 */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          {isSearchMode ? '검색 결과' : '추천 매장'}
        </Typography>

        {loading ? (
          <Typography>로딩 중...</Typography>
        ) : stores.length === 0 ? (
          <Typography color="text.secondary">
            {isSearchMode ? '검색 결과가 없습니다.' : '추천 매장이 없습니다.'}
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {stores.map((store) => (
              <Grid item xs={12} key={store.id || store.storeId}>
                <Card 
                  onClick={() => handleStoreClick(store.storeId || store.id)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
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
                            {store.rating ? store.rating.toFixed(1) : '0.0'} ({formatNumber(store.reviewCount)})
                          </Typography>
                        </Box>
                        
                        {/* 태그 표시 */}
                        {store.tags && store.tags.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                            {store.tags.slice(0, 3).map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 'auto', '& .MuiChip-label': { px: 1, py: 0.25 } }}
                              />
                            ))}
                            {store.tags.length > 3 && (
                              <Typography variant="caption" color="text.secondary">
                                +{store.tags.length - 3}개
                              </Typography>
                            )}
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