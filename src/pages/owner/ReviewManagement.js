//* src/pages/owner/ReviewManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  TextField
} from '@mui/material';
import { ArrowBack, Reply } from '@mui/icons-material';
import { reviewApi } from '../../services/api';
import OwnerNavigation from '../../components/common/Navigation';

const ReviewManagement = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadReviews();
  }, [storeId]);

  const loadReviews = async () => {
    try {
      const response = await reviewApi.get(`/api/reviews/stores/${storeId}`);
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('리뷰 목록 로드 실패:', error);
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
      await reviewApi.post(`/api/reviews/${selectedReview.id}/reply`, {
        reply: replyText
      });
      setOpenReplyDialog(false);
      loadReviews();
    } catch (error) {
      console.error('답글 저장 실패:', error);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'POSITIVE': return 'success';
      case 'NEGATIVE': return 'error';
      default: return 'default';
    }
  };

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
          onClick={() => navigate(`/owner/stores/${storeId}/management`)}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            내 매장 리뷰
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {/* 리뷰 목록 */}
        {reviews.map((review) => (
          <Card key={review.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {review.customerName}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
                <Chip 
                  label={review.sentiment === 'POSITIVE' ? '긍정' : review.sentiment === 'NEGATIVE' ? '부정' : '중립'} 
                  size="small" 
                  color={getSentimentColor(review.sentiment)}
                />
              </Box>
              
              <Typography variant="body2" sx={{ mb: 2 }}>
                {review.content}
              </Typography>
              
              {review.ownerReply && (
                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                    사장님 답글
                  </Typography>
                  <Typography variant="body2">
                    {review.ownerReply}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<Reply />}
                  onClick={() => handleReply(review)}
                >
                  {review.ownerReply ? '답글 수정' : '답글 작성'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* 답글 작성 다이얼로그 */}
        <Dialog open={openReplyDialog} onClose={() => setOpenReplyDialog(false)} fullWidth>
          <DialogTitle>사장님 답글</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="고객에게 답글을 작성해주세요..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReplyDialog(false)}>취소</Button>
            <Button onClick={handleSaveReply} variant="contained">저장</Button>
          </DialogActions>
        </Dialog>
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default ReviewManagement;