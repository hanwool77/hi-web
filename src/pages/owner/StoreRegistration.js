import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  Alert, Chip, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { ArrowBack, ExpandMore } from '@mui/icons-material';
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
  
  // 상태 추가
  const [availableTags, setAvailableTags] = useState([]);
  const [tagsByCategory, setTagsByCategory] = useState({});
  const [tagsLoading, setTagsLoading] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    '한식', '양식', '일식', '중식', '카페', '디저트', '패스트푸드',
    '치킨', '피자', '분식', '베이커리', '기타'
  ];

  // 컴포넌트 마운트 시 태그 목록 로드
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
  try {
    setTagsLoading(true);
    console.log('🏷️ 태그 목록 로딩 시작...');
    
    const response = await storeService.getAvailableTags();
    console.log('✅ 태그 목록 API 응답:', response);
    
    // ApiResponse 구조: { success: true, data: [...] }
    const tags = response.data || [];
    console.log('📋 태그 목록 (총 ' + tags.length + '개):', tags);
    
    if (tags.length === 0) {
      console.warn('⚠️ 태그 목록이 비어있습니다. 기본 태그를 사용합니다.');
      throw new Error('태그 목록이 비어있습니다.');
    }
    
    setAvailableTags(tags);
    
    // 카테고리별로 그룹화
    const groupedTags = tags.reduce((acc, tag) => {
      const category = tag.tagCategory || '기타';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tag);
      return acc;
    }, {});
    
    console.log('📂 카테고리별 태그 그룹:', groupedTags);
    setTagsByCategory(groupedTags);
    
  } catch (error) {
    console.error('❌ 태그 목록 로드 실패:', error);
    console.log('매장 등록에서 태그 목록을 불러오는데 실패했습니다. 기본 태그를 사용합니다.');
    
    // 에러 시 기본 태그 사용 (fallback)
    const defaultTags = [
      { tagName: '한식', tagCategory: 'FOOD' },
      { tagName: '양식', tagCategory: 'FOOD' },
      { tagName: '일식', tagCategory: 'FOOD' },
      { tagName: '중식', tagCategory: 'FOOD' },
      { tagName: '비건', tagCategory: 'DIETARY' },
      { tagName: '할랄', tagCategory: 'DIETARY' },
      { tagName: '혼밥', tagCategory: 'ATMOSPHERE' },
      { tagName: '반려동물 동반', tagCategory: 'ATMOSPHERE' },
      { tagName: '청결인증', tagCategory: 'CERTIFICATION' }
    ];
    setAvailableTags(defaultTags);
    
    const groupedDefaultTags = defaultTags.reduce((acc, tag) => {
      const category = tag.tagCategory || '기타';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tag);
      return acc;
    }, {});
    setTagsByCategory(groupedDefaultTags);
    
  } finally {
    setTagsLoading(false);
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagClick = async (tag) => {
    const tagName = tag.tagName || tag; // tag 객체 또는 문자열 모두 지원
    
    if (formData.tags.includes(tagName)) {
      // 태그 제거
      setFormData({
        ...formData,
        tags: formData.tags.filter(t => t !== tagName)
      });
    } else {
      // 태그 추가
      setFormData({
        ...formData,
        tags: [...formData.tags, tagName]
      });
      
      // 태그 클릭 이벤트 기록 (tagId가 있는 경우만)
      if (tag.id || tag.tagId) {
        try {
          await storeService.recordTagClick(tag.id || tag.tagId);
        } catch (error) {
          console.warn('태그 클릭 기록 실패:', error);
          // 에러가 발생해도 태그 선택 자체는 계속 진행
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('매장 등록 요청 데이터:', formData);
      await storeService.createStore(formData);
      alert('매장이 등록되었습니다.');
      navigate('/owner/stores-list');
    } catch (error) {
      console.error('매장 등록 실패:', error);
      setError(error.response?.data?.message || '매장 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      'FOOD': '🍽️ 음식 종류',
      'DIETARY': '🥗 식단 특성',
      'ATMOSPHERE': '🏪 분위기',
      'ALLERGY': '⚠️ 알레르기',
      'CERTIFICATION': '✅ 인증',
      'SERVICE': '🛎️ 서비스',
      'TASTE': '🌶️ 맛 특성'
    };
    return categoryNames[category] || `📌 ${category}`;
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
          onClick={() => navigate('/owner/mypage')}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            매장 등록
          </Typography>
          <Typography variant="body2">
            새로운 매장 정보를 등록해주세요
          </Typography>
        </Box>
      </Box>

      <Box className="content-area">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* 기본 정보 */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                기본 정보
              </Typography>
              <TextField
                fullWidth
                label="매장명"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="주소"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="전화번호"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>카테고리</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
                label="운영시간"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleChange}
                placeholder="예: 월-금 09:00-21:00, 토-일 10:00-20:00"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="매장 설명"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="매장의 특징이나 소개를 입력해주세요"
              />
            </CardContent>
          </Card>

          {/* 태그 설정 */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                태그 설정
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                매장의 특징을 나타내는 태그를 선택해주세요. (선택된 태그: {formData.tags.length}개)
              </Typography>
              
              {tagsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  <Typography>태그 목록을 불러오는 중...</Typography>
                </Box>
              ) : Object.keys(tagsByCategory).length > 0 ? (
                // 카테고리별 태그 표시
                Object.entries(tagsByCategory).map(([category, tags]) => (
                  <Accordion key={category} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {getCategoryDisplayName(category)} ({tags.length}개)
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tags.map((tag) => (
                          <Chip
                            key={tag.id || tag.tagName}
                            label={tag.tagName}
                            onClick={() => handleTagClick(tag)}
                            variant={formData.tags.includes(tag.tagName) ? 'filled' : 'outlined'}
                            color={formData.tags.includes(tag.tagName) ? 'primary' : 'default'}
                            clickable
                            sx={{
                              '&:hover': {
                                backgroundColor: formData.tags.includes(tag.tagName) ? 'primary.dark' : 'action.hover'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                // 카테고리가 없거나 로딩 실패 시 전체 태그를 한 번에 표시
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableTags.map((tag) => (
                    <Chip
                      key={tag.id || tag.tagName || tag}
                      label={tag.tagName || tag}
                      onClick={() => handleTagClick(tag)}
                      variant={formData.tags.includes(tag.tagName || tag) ? 'filled' : 'outlined'}
                      color={formData.tags.includes(tag.tagName || tag) ? 'primary' : 'default'}
                      clickable
                    />
                  ))}
                </Box>
              )}
              
              {/* 선택된 태그 미리보기 */}
              {formData.tags.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    선택된 태그:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.tags.map((tagName) => (
                      <Chip
                        key={tagName}
                        label={tagName}
                        size="small"
                        color="primary"
                        onDelete={() => handleTagClick({ tagName })}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || tagsLoading}
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