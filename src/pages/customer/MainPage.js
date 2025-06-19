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

  const tags = ['전체', '한식', '양식', '일식', '중식', '카페'];

  useEffect(() => {
    // 컴포넌트 마운트시 전체 매장 로드
    loadStoresByTags(['전체']);
  }, []); // 빈 의존성 배열로 초기 로드만

  useEffect(() => {
    // selectedTags 변경시 매장 목록 재로드 (초기 로드 제외)
    loadStoresByTags(selectedTags);
  }, [selectedTags]); // selectedTags 변경시 매장 목록 재로드

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
    console.log(`[매장 ${storeId}] tagJson 원본:`, tagJson, typeof tagJson);
    
    if (!tagJson) {
      console.log(`[매장 ${storeId}] tagJson이 없음`);
      return [];
    }
    
    try {
      let tags = tagJson;
      
      // tagJson이 문자열인 경우
      if (typeof tagJson === 'string') {
        const trimmed = tagJson.trim();
        console.log(`[매장 ${storeId}] 문자열 tagJson:`, trimmed);
        
        // JSON 형태인지 확인 (대괄호나 중괄호로 시작)
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          console.log(`[매장 ${storeId}] JSON 형태로 파싱 시도`);
          tags = JSON.parse(trimmed);
        } else {
          // 단순 문자열인 경우 쉼표로 분리하거나 단일 태그로 처리
          console.log(`[매장 ${storeId}] 단순 문자열로 처리`);
          if (trimmed.includes(',')) {
            // 쉼표로 구분된 태그들
            tags = trimmed.split(',').map(tag => tag.trim()).filter(tag => tag);
          } else {
            // 단일 태그
            tags = [trimmed];
          }
        }
      }
      
      console.log(`[매장 ${storeId}] 파싱된 tags:`, tags, typeof tags);
      
      // 배열인지 확인
      if (Array.isArray(tags)) {
        console.log(`[매장 ${storeId}] 배열 형태 태그:`, tags);
        return tags.filter(tag => tag && String(tag).trim()); // 빈 태그 제거
      }
      
      // 객체인 경우 값들을 배열로 변환
      if (typeof tags === 'object' && tags !== null) {
        console.log(`[매장 ${storeId}] 객체 형태 태그, Object.values() 적용`);
        const result = Object.values(tags).flat().filter(tag => tag && String(tag).trim());
        console.log(`[매장 ${storeId}] 객체에서 추출된 태그:`, result);
        return result;
      }
      
      // 기타 타입인 경우 문자열로 변환하여 배열에 담기
      if (tags) {
        console.log(`[매장 ${storeId}] 기타 타입을 문자열로 변환:`, tags);
        return [String(tags).trim()];
      }
      
      console.log(`[매장 ${storeId}] 처리할 수 없는 태그 형태:`, typeof tags, tags);
      return [];
    } catch (error) {
      console.error(`[매장 ${storeId}] tagJson 파싱 오류:`, error, tagJson);
      
      // 파싱 오류시 문자열 자체를 태그로 사용
      if (typeof tagJson === 'string' && tagJson.trim()) {
        console.log(`[매장 ${storeId}] 오류 발생, 원본 문자열을 태그로 사용:`, tagJson.trim());
        return [tagJson.trim()];
      }
      
      return [];
    }
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
            
            // tagJson 파싱
            const parsedTags = parseTagJson(store.tagJson, store.storeId || store.id);
            console.log(`매장 ${store.storeId || store.id} 최종 태그:`, parsedTags);
            
            return {
              ...store,
              rating: reviewStats.rating,
              reviewCount: reviewStats.reviewCount,
              tags: parsedTags, // 파싱된 태그 추가
              reviews: activeReviews // 필요시 전체 리뷰 데이터도 포함
            };
          } catch (error) {
            console.error(`매장 ${store.storeId || store.id} 리뷰 로드 실패:`, error);
            // 리뷰 로드 실패시 기본값 사용
            return {
              ...store,
              rating: store.rating || 0,
              reviewCount: store.reviewCount || 0,
              tags: parseTagJson(store.tagJson, store.storeId || store.id) // 오류시에도 태그 파싱 시도
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
    console.log('🏷️ 태그 클릭됨:', tag);
    console.log('🏷️ 현재 선택된 태그들:', selectedTags);
    
    let newTags;
    
    if (selectedTags.includes(tag)) {
      // 이미 선택된 태그를 클릭한 경우 제거
      newTags = selectedTags.filter(t => t !== tag);
      if (newTags.length === 0) {
        newTags = ['전체']; // 태그가 모두 제거되면 '전체'로 설정
      }
      console.log('🏷️ 태그 제거됨, 새로운 태그들:', newTags);
    } else {
      // 새로운 태그 선택
      if (tag === '전체') {
        newTags = ['전체'];
        console.log('🏷️ 전체 태그 선택됨');
      } else {
        // '전체'가 선택되어 있으면 제거하고 새 태그 추가
        newTags = selectedTags.includes('전체') 
          ? [tag] 
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
                
                // tagJson 파싱
                const parsedTags = parseTagJson(store.tagJson, store.storeId || store.id);
                
                return {
                  ...store,
                  rating: reviewStats.rating,
                  reviewCount: reviewStats.reviewCount,
                  tags: parsedTags, // 파싱된 태그 추가
                  reviews: activeReviews // 필요시 전체 리뷰 데이터도 포함
                };
              } catch (error) {
                console.error(`❌ 매장 ${store.storeId || store.id} 리뷰 로드 실패:`, error);
                // 리뷰 로드 실패시 기본값 사용
                return {
                  ...store,
                  rating: store.rating || 0,
                  reviewCount: store.reviewCount || 0,
                  tags: parseTagJson(store.tagJson, store.storeId || store.id) // 오류시에도 태그 파싱 시도
                };
              }
            })
          );
          
          allStoresWithReviews.push(...storesWithReviewData);
          console.log(`✅ 카테고리 "${category}" 매장 ${storesWithReviewData.length}개 처리 완료`);
          
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
                        
                        {/* 매장 태그 표시 */}
                        {store.tags && store.tags.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {store.tags.slice(0, 3).map((tag, index) => (
                              <Chip 
                                key={index} 
                                label={tag} 
                                size="small" 
                                sx={{ 
                                  mr: 0.5, 
                                  mb: 0.5,
                                  fontSize: '0.7rem',
                                  height: '20px'
                                }} 
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                            {store.tags.length > 3 && (
                              <Chip 
                                label={`+${store.tags.length - 3}`} 
                                size="small" 
                                sx={{ 
                                  mr: 0.5, 
                                  mb: 0.5,
                                  fontSize: '0.7rem',
                                  height: '20px'
                                }} 
                                variant="outlined"
                                color="default"
                              />
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