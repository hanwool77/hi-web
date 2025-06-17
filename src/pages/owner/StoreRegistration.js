import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  Alert, Chip, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { storeService } from '../../services/storeService';
import OwnerNavigation from '../../components/common/OwnerNavigation';

const StoreRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    category: '',
    operatingHours: '',
    description: '',
    tags: []
  });
  const [availableTags] = useState([
    '한식', '양식', '일식', '중식', '카페', '디저트', '패스트푸드',
    '비건', '채식', '할랄', '반려동물 동반', '혼밥', '저염', '청결인증'
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    '한식', '양식', '일식', '중식', '카페', '디저트', '패스트푸드',
    '치킨', '피자', '분식', '베이커리', '기타'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagClick = (tag) => {
    if (formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter(t => t !== tag)
      });
    } else {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await storeService.createStore(formData);
      alert('매장이 등록되었습니다.');
      navigate('/owner/store-registration');
    } catch (error) {
      console.error('매장 등록 실패:', error);
      setError(error.response?.data?.message || '매장 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate('/owner')} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          매장 등록
        </Typography>
      </Box>

      <Box className="content-area">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                기본 정보
              </Typography>
              <TextField
                fullWidth
                name="storeName"
                label="매장명"
                value={formData.storeName}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="address"
                label="주소"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="phone"
                label="전화번호"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>카테고리</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="카테고리"
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                name="operatingHours"
                label="운영시간"
                placeholder="예: 09:00 - 22:00"
                value={formData.operatingHours}
                onChange={handleChange}
                margin="normal"
                required
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                매장 설명
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="매장 소개"
                placeholder="매장의 특징, 대표 메뉴 등을 소개해주세요."
                value={formData.description}
                onChange={handleChange}
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                태그 설정
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                매장의 특징을 나타내는 태그를 선택해주세요.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagClick(tag)}
                    variant={formData.tags.includes(tag) ? 'filled' : 'outlined'}
                    color={formData.tags.includes(tag) ? 'primary' : 'default'}
                    clickable
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? '등록 중...' : '매장 등록하기'}
          </Button>
        </form>
      </Box>

      <OwnerNavigation />
    </Box>
  );
};

export default StoreRegistration;