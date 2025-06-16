//* src/pages/owner/ReviewManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Rating,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Avatar,
  Alert
} from '@mui/material';
import { ArrowBack, Reply, RateReview } from '@mui/icons-material';
import { reviewApi } from '../../services/api';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/Navigation';

const ReviewManagement = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedStoreId) {
      loadReviews();
    }
  }, [selectedStoreId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewApi.get(`/api/reviews/stores/${selectedStoreId}`);
      
      // API 응답 데이터 구조 확인
      console.log('API 응답:', response.data);
      
      // 응답 데이터가 배열인지 확인하고 설정
      if (Array.isArray(response.data)) {
        setReviews(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setReviews(response.data.data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('리뷰 목록 로드 실패:', error);
      setError('리뷰를 불러오는 중 오류가 발생했습니다.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.ownerReply || '');
    setOpenReplyDialog(true);
  };

  const handleSaveReply = async () => {
    try {
      await reviewApi.post(`/api/reviews/${selectedReview.reviewId}/reply`, {
        reply: replyText
      });
      setOpenReplyDialog(false);
      loadReviews();
    } catch (error) {
      console.error('답글 저장 실패:', error);
      alert('답글 저장에 실패했습니다.');
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <Box sx={{ 
          p: 2, 
          bgcolor: '#2c3e50', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ArrowBack 
            onClick={() => navigate('/owner/management')}
            sx={{ cursor: 'pointer' }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            내 매장 리뷰
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

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
          onClick={() => navigate('/owner/management')}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            내 매장 리뷰
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          고객 리뷰 관리 ({reviews.length}개)
        </Typography>

        {/* 리뷰가 없는 경우 */}
        {!loading && reviews.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            bgcolor: '#f8f9fa',
            borderRadius: 1,
            border: '1px dashed #dee2e6'
          }}>
            <RateReview sx={{ fontSize: 48, color: '#6c757d', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              등록된 매장 리뷰가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              고객들이 리뷰를 작성하면 여기에 표시됩니다
            </Typography>
          </Box>
        ) : (
          /* 리뷰 목록 */
          reviews.map((review) => (
            <Card key={review.reviewId} sx={{ mb: 2 }}>
              <CardContent>
                {/* 리뷰 헤더 */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: '#2c3e50' }}>
                    {review.memberNickname ? review.memberNickname[0] : 'U'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {review.memberNickname || '익명'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(review.createdAt)}
                    </Typography>
                  </Box>
                  <Rating value={review.rating || 0} size="small" readOnly />
                </Box>

                {/* 리뷰 내용 */}
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                  {review.content}
                </Typography>

                {/* 리뷰 이미지 */}
                {review.imageUrls && review.imageUrls.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {review.imageUrls.map((imageUrl, index) => (
                      <Box
                        key={index}
                        component="img"
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: 1, 
                          objectFit: 'cover',
                          border: '1px solid #dee2e6'
                        }}
                        src={imageUrl}
                        alt={`리뷰 이미지 ${index + 1}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* 좋아요/싫어요 수 */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    label={`👍 ${review.likeCount || 0}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                  <Chip 
                    label={`👎 ${review.dislikeCount || 0}`}
                    size="small"
                    variant="outlined"
                    color="default"
                  />
                </Box>

                {/* 점주 답글 영역 */}
                {review.ownerReply ? (
                  <Box sx={{ 
                    bgcolor: '#f8f9fa', 
                    p: 2, 
                    borderRadius: 1, 
                    mt: 2,
                    border: '1px solid #e9ecef'
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                      사장님 답글
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {review.ownerReply}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(review.replyCreatedAt)}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => handleReply(review)}
                        sx={{ color: '#6c757d' }}
                      >
                        수정
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Reply />}
                    onClick={() => handleReply(review)}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    답글 작성하기
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}

        {/* 답글 작성 다이얼로그 */}
        <Dialog 
          open={openReplyDialog} 
          onClose={() => setOpenReplyDialog(false)} 
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {selectedReview?.ownerReply ? '답글 수정' : '답글 작성'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, p: 1, bgcolor: '#f8f9fa', borderRadius: 1 }}>
              "{selectedReview?.content}"
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="고객에게 정중하고 친절한 답글을 작성해주세요... (10자 이상 100자 미만)"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              margin="normal"
              helperText={`${replyText.length}/100자`}
              inputProps={{ maxLength: 100 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReplyDialog(false)}>
              취소
            </Button>
            <Button 
              onClick={handleSaveReply} 
              variant="contained"
              disabled={replyText.length < 10}
            >
              {selectedReview?.ownerReply ? '수정' : '작성'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default ReviewManagement;