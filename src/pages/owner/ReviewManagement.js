//* src/pages/owner/ReviewManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Rating,
  Chip,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { Reply, Star, Person } from '@mui/icons-material';
import { reviewService } from '../../services/reviewService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerHeader from '../../components/common/OwnerHeader';
import Navigation from '../../components/common/Navigation';

const ReviewManagement = () => {
  const navigate = useNavigate();
  const { selectedStoreId, selectedStore } = useSelectedStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDialog, setReplyDialog] = useState({ open: false, review: null });
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (selectedStoreId) {
      loadReviews();
    } else {
      setReviews([]);
      setLoading(false);
    }
  }, [selectedStoreId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getStoreReviews(selectedStoreId);
      setReviews(response.data || []);
    } catch (error) {
      console.error('리뷰 목록 로드 실패:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (review) => {
    setReplyDialog({ open: true, review });
    setReplyText(review.ownerReply || '');
  };

  const handleSaveReply = async () => {
    try {
      await reviewService.replyToReview(replyDialog.review.id, replyText);
      setReplyDialog({ open: false, review: null });
      setReplyText('');
      loadReviews();
      alert('답글이 저장되었습니다.');
    } catch (error) {
      console.error('답글 저장 실패:', error);
      alert('답글 저장에 실패했습니다.');
    }
  };

  const getReviewTypeColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'error';
  };

  const getReviewTypeText = (rating) => {
    if (rating >= 4) return '긍정';
    if (rating >= 3) return '보통';
    return '부정';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <OwnerHeader 
          title="리뷰 관리"
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
        title="리뷰 관리"
        subtitle={selectedStore ? `${selectedStore.name} 리뷰` : '매장을 선택해주세요'}
        showStoreSelector={true}
        backPath="/owner/store-management"
      />
      
      <Box className="content-area">
        {!selectedStoreId ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Star sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                리뷰를 관리할 매장을 선택해주세요
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                우측 상단에서 매장을 선택할 수 있습니다
              </Typography>
            </CardContent>
          </Card>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Star sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                등록된 리뷰가 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                고객들의 첫 번째 리뷰를 기다려보세요
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box>
            {/* 리뷰 통계 */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  📊 리뷰 현황
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {reviews.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      총 리뷰
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0).toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      평균 평점
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {reviews.filter(r => r.ownerReply).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      답변 완료
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* 리뷰 목록 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent>
                    {/* 리뷰 헤더 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {review.customerName || '익명'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(review.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={getReviewTypeText(review.rating)}
                        color={getReviewTypeColor(review.rating)}
                        size="small"
                      />
                    </Box>

                    {/* 평점 */}
                    <Box sx={{ mb: 2 }}>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>

                    {/* 리뷰 내용 */}
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {review.content}
                    </Typography>

                    {/* 사장님 답글 */}
                    {review.ownerReply && (
                      <Box sx={{ 
                        bgcolor: 'grey.50', 
                        p: 2, 
                        borderRadius: 1, 
                        mb: 2,
                        borderLeft: '3px solid',
                        borderLeftColor: 'primary.main'
                      }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                          💬 사장님 답글
                        </Typography>
                        <Typography variant="body2">
                          {review.ownerReply}
                        </Typography>
                      </Box>
                    )}

                    {/* 답글 버튼 */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        startIcon={<Reply />}
                        onClick={() => handleReply(review)}
                        color={review.ownerReply ? 'secondary' : 'primary'}
                      >
                        {review.ownerReply ? '답글 수정' : '답글 작성'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* 답글 작성 다이얼로그 */}
        <Dialog 
          open={replyDialog.open} 
          onClose={() => setReplyDialog({ open: false, review: null })}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            사장님 답글 {replyDialog.review?.ownerReply ? '수정' : '작성'}
          </DialogTitle>
          <DialogContent>
            {replyDialog.review && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Rating value={replyDialog.review.rating} readOnly size="small" />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {replyDialog.review.content}
                </Typography>
              </Box>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="답글 내용"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="고객에게 정중하고 친절한 답글을 작성해주세요."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyDialog({ open: false, review: null })}>
              취소
            </Button>
            <Button onClick={handleSaveReply} variant="contained">
              저장
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
      <Navigation />
    </Box>
  );
};

export default ReviewManagement;