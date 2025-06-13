import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Chip, Button,
  Alert, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import api from '../../services/api';
import Navigation from '../../components/common/Navigation';

const PreferenceSettings = () => {
  const navigate = useNavigate();
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [healthInfo, setHealthInfo] = useState('');
  const [spicyLevel, setSpicyLevel] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailableTags();
    loadCurrentPreferences();
  }, []);

  const loadAvailableTags = async () => {
    try {
      const response = await api.get('/api/members/preferences/tags');
      setAvailableTags(response.data || []);
    } catch (error) {
      console.error('태그 목록 로드 실패:', error);
    }
  };

  const loadCurrentPreferences = async () => {
    try {
      const response = await api.get('/api/members/preferences');
      if (response.data) {
        setSelectedTags(response.data.tags || []);
        setHealthInfo(response.data.healthInfo || '');
        setSpicyLevel(response.data.spicyLevel || '');
      }
    } catch (error) {
      console.error('현재 취향 정보 로드 실패:', error);
    }
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      await api.post('/api/members/preferences', {
        tags: selectedTags,
        healthInfo,
        spicyLevel
      });
      alert('취향 정보가 저장되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('취향 정보 저장 실패:', error);
      setError(error.response?.data?.message || '취향 정보 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate('/mypage')} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          취향 설정
        </Typography>
      </Box>

      <Box className="content-area">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              음식 취향 태그
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              좋아하는 음식 종류나 특징을 선택해주세요.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableTags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  variant={selectedTags.includes(tag.name) ? 'filled' : 'outlined'}
                  color={selectedTags.includes(tag.name) ? 'primary' : 'default'}
                  clickable
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              건강 정보
            </Typography>
            <FormControl fullWidth>
              <InputLabel>건강 상태</InputLabel>
              <Select
                value={healthInfo}
                onChange={(e) => setHealthInfo(e.target.value)}
                label="건강 상태"
              >
                <MenuItem value="">선택 안함</MenuItem>
                <MenuItem value="비건">비건</MenuItem>
                <MenuItem value="베지테리안">베지테리안</MenuItem>
                <MenuItem value="다이어트">다이어트 중</MenuItem>
                <MenuItem value="당뇨">당뇨</MenuItem>
                <MenuItem value="고혈압">고혈압</MenuItem>
                <MenuItem value="알레르기">알레르기 있음</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              매운맛 선호도
            </Typography>
            <FormControl fullWidth>
              <InputLabel>매운맛 정도</InputLabel>
              <Select
                value={spicyLevel}
                onChange={(e) => setSpicyLevel(e.target.value)}
                label="매운맛 정도"
              >
                <MenuItem value="">선택 안함</MenuItem>
                <MenuItem value="MILD">순한맛</MenuItem>
                <MenuItem value="MEDIUM">보통맛</MenuItem>
                <MenuItem value="HOT">매운맛</MenuItem>
                <MenuItem value="VERY_HOT">매우 매운맛</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? '저장 중...' : '저장하기'}
        </Button>
      </Box>

      <Navigation />
    </Box>
  );
};

export default PreferenceSettings;
