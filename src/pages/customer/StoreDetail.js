import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Chip, Tab, Tabs,
  Avatar, Grid, Rating
} from '@mui/material';
import { ArrowBack, Star, Edit, Message } from '@mui/icons-material';
import { storeService } from '../../services/storeService';
import { reviewService } from '../../services/reviewService';
import Navigation from '../../components/common/Navigation';

const StoreDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoreDetail();
    loadStoreReviews();
  }, [storeId]);

  const loadStoreDetail = async () => {
    try {
      const response = await storeService.getStoreDetail(storeId);
      setStore(response.data);
    } catch (error) {
      console.error('매장 정보 로드 실패:', error);
    }
  };

  const loadStoreReviews = async () => {
    try {
      const response = await reviewService.getStoreReviews(storeId);
      setReviews(response.data || []);
    } catch (error) {
      console.error('리뷰 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  if (loading || !store) {
    return (
      <Box className="mobile-container">
        <Box sx={{ p: 2 }}>
          <Typography>로딩 중...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      {/* 헤더 */}
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          매장 정보
        </Typography>
      </Box>

      <Box className="content-area">
        {/* 매장 이미지 */}
        <Box
          component="img"
          sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 1 }}
          src={store.image || '/images/store-default.jpg'}
          alt={store.name}
        />

        {/* 매장 기본 정보 */}
        <Card sx={{ mt: 2, mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {store.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              📍 {store.address}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              📞 {store.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              🕒 {store.operatingHours}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Star sx={{ color: '#ffc107', mr: 0.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                {store.rating?.toFixed(1) || '0.0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({formatNumber(store.reviewCount)}개 리뷰)
              </Typography>
            </Box>

            {/* 태그 */}
            {store.tags && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {store.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Box>
            )}

            {/* AI 한줄 요약 */}
            {store.aiSummary && (
              <Typography variant="body2" sx={{ 
                bgcolor: '#f5f5f5', 
                p: 1, 
                borderRadius: 1,
                fontStyle: 'italic' 
              }}>
                🤖 {store.aiSummary}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* 탭 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="메뉴" />
            <Tab label={`리뷰 (${reviews.length})`} />
          </Tabs>
        </Box>

        {/* 탭 내용 */}
        {tabValue === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                메뉴
              </Typography>
              {store.menus ? (
                <Grid container spacing={2}>
                  {store.menus.map((menu, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {menu.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {menu.description}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {formatNumber(menu.price)}원
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary">메뉴 정보가 없습니다.</Typography>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 1 && (
          <Box>
            <Button
              variant="contained"
              startIcon={<Edit />}
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => navigate(`/stores/${storeId}/review/write`)}
            >
              리뷰 작성하기
            </Button>

            {reviews.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                아직 리뷰가 없습니다.
              </Typography>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {review.memberNickname?.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {review.memberNickname}
                        </Typography>
                        <Rating value={review.rating} size="small" readOnly />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {review.content}
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
