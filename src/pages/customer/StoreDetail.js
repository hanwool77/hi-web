//* src/pages/customer/StoreDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Chip, Tab, Tabs,
  Avatar, Grid, Rating
} from '@mui/material';
import { ArrowBack, Star, Edit, Message, Store as StoreIcon } from '@mui/icons-material';
import { storeService } from '../../services/storeService';
import { reviewService } from '../../services/reviewService';
import { storeApi } from '../../services/api'; // API 직접 import 추가
import { analyticsApi } from '../../services/api'; // Analytics API import 추가
import Navigation from '../../components/common/Navigation';

const StoreDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [menus, setMenus] = useState([]); // 메뉴 상태 추가
  const [aiSummary, setAiSummary] = useState(null); // AI 요약 상태 추가
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false); // 메뉴 로딩 상태 추가
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false); // AI 요약 로딩 상태 추가
  const [imageError, setImageError] = useState(false); // 이미지 에러 상태 추가

  useEffect(() => {
    loadStoreData();
  }, [storeId]);

  // AI 요약 데이터 로드 함수
  const loadAiSummary = async (storeId) => {
    try {
      setAiSummaryLoading(true);
      console.log('AI 요약 정보 로드 시작:', storeId);
      
      // Analytics API를 사용해서 AI 요약 조회
      const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/customer/summary`);
      console.log('AI 요약 API 응답:', response.data);
      
      // 응답 구조에 따른 AI 요약 데이터 추출
      let summaryData = null;
      if (response.data && response.data.success && response.data.data) {
        summaryData = response.data.data;
      } else if (response.data && response.data.data) {
        summaryData = response.data.data;
      } else if (response.data) {
        summaryData = response.data;
      }
      
      console.log('처리된 AI 요약 데이터:', summaryData);
      setAiSummary(summaryData);
      
    } catch (error) {
      console.error('AI 요약 로드 실패:', error);
      setAiSummary(null);
    } finally {
      setAiSummaryLoading(false);
    }
  };
  const loadStoreMenus = async (storeId) => {
    try {
      setMenuLoading(true);
      console.log('메뉴 정보 로드 시작:', storeId);
      
      // storeApi를 사용해서 메뉴 조회
      const response = await storeApi.get(`/api/stores/${storeId}/menus`);
      console.log('메뉴 API 응답:', response.data);
      
      // 응답 구조에 따른 메뉴 데이터 추출
      let menuData = [];
      if (response.data && Array.isArray(response.data)) {
        menuData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        menuData = response.data.data;
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        menuData = response.data.data;
      }
      
      console.log('처리된 메뉴 데이터:', menuData);
      setMenus(menuData);
      
    } catch (error) {
      console.error('메뉴 로드 실패:', error);
      setMenus([]);
    } finally {
      setMenuLoading(false);
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

  // 매장 정보와 리뷰 데이터를 통합해서 로드하는 함수
  const loadStoreData = async () => {
    try {
      setLoading(true);
      
      // 1. 매장 정보 로드
      const storeResponse = await storeService.getStoreDetail(storeId);
      console.log('매장 정보 API 응답:', storeResponse);
      
      // 응답 구조에 따른 매장 데이터 추출
      let storeData = null;
      if (storeResponse && storeResponse.success && storeResponse.data) {
        storeData = storeResponse.data;
      } else if (storeResponse && storeResponse.data) {
        storeData = storeResponse.data;
      } else if (storeResponse) {
        storeData = storeResponse;
      }

      // 2. 리뷰 데이터 로드
      const reviewResponse = await reviewService.getStoreReviews(storeId);
      console.log('리뷰 API 응답:', reviewResponse);
      
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

      // 3. 리뷰 통계 계산
      const reviewStats = calculateStoreReviewStats(activeReviews);
      
      // 4. 매장 데이터에 실제 리뷰 통계 적용
      const storeWithReviewStats = {
        ...storeData,
        rating: reviewStats.rating,
        reviewCount: reviewStats.reviewCount
      };

      console.log('최종 매장 데이터 (리뷰 통계 포함):', storeWithReviewStats);
      console.log('처리된 리뷰 데이터:', activeReviews);

      setStore(storeWithReviewStats);
      setReviews(activeReviews);
      
      // 5. 메뉴 데이터 로드
      await loadStoreMenus(storeId);
      
      // 6. AI 요약 데이터 로드
      await loadAiSummary(storeId);
      
    } catch (error) {
      console.error('매장 정보 또는 리뷰 로드 실패:', error);
      
      // 오류 발생 시에도 기본 매장 정보라도 표시하려고 시도
      try {
        const storeResponse = await storeService.getStoreDetail(storeId);
        let storeData = storeResponse?.data || storeResponse;
        setStore({
          ...storeData,
          rating: storeData?.rating || 0,
          reviewCount: storeData?.reviewCount || 0
        });
      } catch (storeError) {
        console.error('매장 정보 로드도 실패:', storeError);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() || '0';
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading || !store) {
    return (
      <Box className="mobile-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>로딩 중...</Typography>
        </Box>
        <Navigation />
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'white' }}>
        <Button onClick={() => navigate(-1)} sx={{ minWidth: 'auto', p: 1 }}>
          <ArrowBack />
        </Button>
        <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
          매장 상세
        </Typography>
      </Box>

      <Box className="content-area">
        {/* 매장 기본 정보 카드 - StoreManagement 스타일 적용 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            {/* 매장 이미지 - StoreManagement 스타일 */}
            {store.imageUrl && !imageError ? (
              <Box
                component="img"
                sx={{
                  width: '100%',
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mb: 2
                }}
                src={store.imageUrl}
                alt={store.storeName || store.name}
                onError={handleImageError}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: 150,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <StoreIcon sx={{ fontSize: 48, color: 'grey.500' }} />
              </Box>
            )}

            {/* 매장 기본 정보 - StoreManagement 스타일 */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {store.storeName || store.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              📍 {store.address}
            </Typography>
            {store.phone && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                📞 {store.phone}
              </Typography>
            )}
            {store.operatingHours && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                🕒 {store.operatingHours}
              </Typography>
            )}

            {/* 평점 및 리뷰 정보 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Star sx={{ color: '#ffc107', fontSize: 18 }} />
              <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                {store.rating ? store.rating.toFixed(1) : '0.0'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                ({formatNumber(store.reviewCount)} 리뷰)
              </Typography>
            </Box>
            
            {/* 매장 설명 */}
            {store.description && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                {store.description}
              </Typography>
            )}

            {/* 매장 태그 표시 */}
            {store.tags && store.tags.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  🏷️ 매장 태그
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {store.tags.slice(0, 6).map((tag, index) => (
                    <Chip 
                      key={index} 
                      label={tag} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                      sx={{ fontSize: '0.75rem', height: '24px' }}
                    />
                  ))}
                  {store.tags.length > 6 && (
                    <Chip 
                      label={`+${store.tags.length - 6}`} 
                      size="small" 
                      variant="outlined"
                      color="default"
                      sx={{ fontSize: '0.75rem', height: '24px' }}
                    />
                  )}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* AI 매장 요약 카드 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                mr: 1
              }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  AI
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                AI 매장 요약
              </Typography>
            </Box>
            
            {aiSummaryLoading ? (
              <Typography variant="body2" color="text.secondary">
                AI가 매장을 분석하고 있습니다...
              </Typography>
            ) : aiSummary && aiSummary.positiveSummary ? (
              <Typography variant="body2" sx={{ 
                lineHeight: 1.6,
                bgcolor: '#f8f9fa',
                p: 2,
                borderRadius: 1,
                borderLeft: '4px solid',
                borderLeftColor: 'primary.main'
              }}>
                {aiSummary.positiveSummary}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                아직 AI 분석 결과가 없습니다. 리뷰가 충분히 쌓이면 AI가 매장을 요약해드려요.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* 탭 메뉴 */}
        <Card sx={{ mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="메뉴" />
            <Tab label="리뷰" />
          </Tabs>
        </Card>

        {/* 탭 컨텐츠 */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              메뉴
            </Typography>
            {menuLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
                <Typography>메뉴를 불러오는 중...</Typography>
              </Box>
            ) : menus.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                등록된 메뉴가 없습니다.
              </Typography>
            ) : (
              <Box>
                {menus.map((menu) => (
                  <Card key={menu.menuId || menu.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* 메뉴 이미지 */}
                        <Avatar
                          src={menu.imageUrl || '/images/menu-default.jpg'}
                          sx={{ 
                            width: 60, 
                            height: 60,
                            borderRadius: 1 // 정사각형 모양
                          }}
                          variant="rounded"
                        />
                        
                        {/* 메뉴 정보 */}
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {menu.menuName || menu.name}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {formatPrice(menu.price)}원
                            </Typography>
                          </Box>
                          
                          {/* 메뉴 설명 */}
                          {menu.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {menu.description}
                            </Typography>
                          )}
                          
                          {/* 메뉴 카테고리 */}
                          {menu.category && (
                            <Chip 
                              label={menu.category} 
                              size="small" 
                              variant="outlined" 
                              sx={{ mr: 1 }}
                            />
                          )}
                          
                          {/* 메뉴 상태 */}
                          <Chip 
                            label={menu.available !== false ? '주문 가능' : '품절'} 
                            size="small" 
                            color={menu.available !== false ? 'success' : 'error'}
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              리뷰 ({formatNumber(store.reviewCount)})
            </Typography>
            {reviews.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                아직 리뷰가 없습니다.
              </Typography>
            ) : (
              reviews.map((review) => (
                <Card key={review.id || review.reviewId} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {(review.memberNickname || review.authorName || '익명').charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {review.memberNickname || review.authorName || '익명'}
                        </Typography>
                        <Rating value={review.rating || 0} size="small" readOnly />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {review.content || '리뷰 내용이 없습니다.'}
                    </Typography>
                    {review.ownerComment && (
                      <Box sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, mt: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                          <Message sx={{ fontSize: 14, mr: 0.5 }} />
                          사장님 답글
                        </Typography>
                        <Typography variant="body2">
                          {review.ownerComment}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}
      </Box>

      <Navigation />
    </Box>
  );
};

export default StoreDetail;