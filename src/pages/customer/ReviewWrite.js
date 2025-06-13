import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Rating, Card, CardContent,
  Alert, Input
} from '@mui/material';
import { ArrowBack, Camera, Star } from '@mui/icons-material';
import { reviewService } from '../../services/reviewService';
import { storeService } from '../../services/storeService';
import Navigation from '../../components/common/Navigation';

const ReviewWrite = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    rating: 5,
    receiptImage: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [canWrite, setCanWrite] = useState(false);

  useEffect(() => {
    loadStoreInfo();
    checkWriteCondition();
  }, [storeId]);

  const loadStoreInfo = async () => {
    try {
      const response = await storeService.getStoreDetail(storeId);
      setStore(response.data);
    } catch (error) {
      console.error('매장 정보 로드 실패:', error);
    }
  };

  const checkWriteCondition = async () => {
    try {
      const response = await reviewService.checkWriteCondition(storeId);
      if (response.data.canWrite) {
        setCanWrite(true);
      } else {
        setError(response.data.reason);
      }
    } catch (error) {
      console.error('리뷰 작성 조건 확인 실패:', error);
      setError('리뷰 작성 조건 확인에 실패했습니다.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) { // 15MB
        setError('이미지 크기는 15MB 이하여야 합니다.');
        return;
      }
      setFormData(prev => ({
        ...prev,
        receiptImage: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.content.length < 10 || formData.content.length > 100) {
      setError('리뷰는 10자 이상 100자 미만으로 작성해주세요.');
      setLoading(false);
      return;
    }

    try {
      const reviewData = {
        ...formData,
        storeId: parseInt(storeId)
      };
      
      await reviewService.createReview(reviewData);
      alert('리뷰가 작성되었습니다.');
      navigate(`/stores/${storeId}`);
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      setError(error.response?.data?.message || '리뷰 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!canWrite) {
    return (
      <Box className="mobile-container">
        <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
          <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            리뷰 작성
          </Typography>
        </Box>
        <Box className="content-area">
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error || '리뷰를 작성할 수 없습니다.'}
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
          >
            돌아가기
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          리뷰 작성
        </Typography>
      </Box>

      <Box className="content-area">
        {store && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {store.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {store.address}
              </Typography>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                평점
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating
                  value={formData.rating}
                  onChange={handleRatingChange}
                  size="large"
                />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {formData.rating}점
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                리뷰 내용
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="content"
                placeholder="매장 이용 후기를 자세히 작성해주세요. (10-100자)"
                value={formData.content}
                onChange={handleChange}
                helperText={`${formData.content.length}/100자`}
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                영수증 사진 (선택)
              </Typography>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                startAdornment={<Camera sx={{ mr: 1 }} />}
              />
              {formData.receiptImage && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  선택된 파일: {formData.receiptImage.name}
                </Typography>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? '작성 중...' : '리뷰 작성하기'}
          </Button>
        </form>
      </Box>

      <Navigation />
    </Box>
  );
};

export default ReviewWrite;
