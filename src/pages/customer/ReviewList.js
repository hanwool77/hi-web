import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Avatar, Rating,
  Chip, Button
} from '@mui/material';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import { reviewService } from '../../services/reviewService';
import Navigation from '../../components/common/Navigation';

const ReviewList = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyReviews();
  }, []);

  const loadMyReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getMyReviews();
      setReviews(response.data || []);
    } catch (error) {
      console.error('내 리뷰 목록 로드 실패:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      try {
        await reviewService.deleteReview(reviewId);
        setReviews(reviews.filter(review => review.id !== reviewId));
        alert('리뷰가 삭제되었습니다.');
      } catch (error) {
        console.error('리뷰 삭제 실패:', error);
        alert('리뷰 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate('/mypage')} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          내 리뷰 목록
        </Typography>
      </Box>

      <Box className="content-area">
        {loading ? (
          <Typography>로딩 중...</Typography>
        ) : reviews.length === 0 ? (
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              작성한 리뷰가 없습니다.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
            >
              매장 둘러보기
            </Button>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {review.storeName}
                    </Typography>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {review.content}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/reviews/${review.id}/edit`)}
                  >
                    수정
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    삭제
                  </Button>
                </Box>

                {review.ownerComment && (
                  <Box sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, mt: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
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

      <Navigation />
    </Box>
  );
};

export default ReviewList;
