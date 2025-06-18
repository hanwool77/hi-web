//* src/pages/owner/StoreInfo.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  TextField,
  Button,
  Grid,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,        // ✅ 추가
  AccordionSummary, // ✅ 추가
  AccordionDetails  // ✅ 추가
} from '@mui/material';
import { Save, Store, ExpandMore  } from '@mui/icons-material';
import { storeApi } from '../../services/api';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerHeader from '../../components/common/OwnerHeader';
import Navigation from '../../components/common/Navigation';
import { storeService } from '../../services/storeService'; // ✅ 추가


const StoreInfo = () => {
  const navigate = useNavigate();
  const { selectedStoreId, selectedStore, loadStores } = useSelectedStore();
  const [storeInfo, setStoreInfo] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    operatingHours: '',
    category: '',
    tags: [],
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

    // ✅ 새로 추가할 상태들
  const [availableTags, setAvailableTags] = useState([]);
  const [tagsByCategory, setTagsByCategory] = useState({});
  const [tagsLoading, setTagsLoading] = useState(true);

  const categories = [
    '한식', '양식', '일식', '중식', '카페', '디저트', '패스트푸드', '분식', '치킨', '피자'
  ];


  useEffect(() => {
    if (selectedStoreId) {
      loadStoreInfo();
      loadTags(); // ✅ 태그 로드 추가
    } else {
      setLoading(false);
    }
  }, [selectedStoreId]);

    // ✅ 5. 태그 로드 함수 추가 (StoreRegistration.js와 동일)
  const loadTags = async () => {
    try {
      setTagsLoading(true);
      console.log('태그 목록 로딩 시작...');
      
      const tags = await storeService.getAllTags();
      console.log('처리된 태그 목록:', tags);
      
      setAvailableTags(tags);
      
      // 카테고리별로 태그 그룹화 (AllTagResponse 구조: {id, tagCategory, tagName})
      const groupedTags = tags.reduce((acc, tag) => {
        const category = tag.tagCategory || '기타';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(tag);
        return acc;
      }, {});
      
      console.log('카테고리별 태그:', groupedTags);
      setTagsByCategory(groupedTags);
      
    } catch (error) {
      console.error('태그 목록 로드 실패:', error);
      
      // 에러 시 기본 태그 사용
      const defaultTags = [
        { id: 1, tagCategory: 'FOOD_TYPE', tagName: '한식' },
        { id: 2, tagCategory: 'FOOD_TYPE', tagName: '양식' },
        { id: 3, tagCategory: 'FOOD_TYPE', tagName: '일식' },
        { id: 4, tagCategory: 'FOOD_TYPE', tagName: '중식' },
        { id: 5, tagCategory: 'HEALTH', tagName: '비건' },
        { id: 6, tagCategory: 'HEALTH', tagName: '할랄' },
        { id: 7, tagCategory: 'ATMOSPHERE', tagName: '혼밥' },
        { id: 8, tagCategory: 'ATMOSPHERE', tagName: '반려동물동반' },
        { id: 9, tagCategory: 'SERVICE', tagName: '저염' },
        { id: 10, tagCategory: 'SERVICE', tagName: '무글루텐' },
        { id: 11, tagCategory: 'SERVICE', tagName: '테이크아웃' },
        { id: 12, tagCategory: 'SERVICE', tagName: '배달' },
        { id: 13, tagCategory: 'SERVICE', tagName: '주차가능' },
        { id: 14, tagCategory: 'SERVICE', tagName: '와이파이' }
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

  // ✅ 6. 카테고리 표시명 변환 함수 추가 (StoreRegistration.js와 동일)
  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      'TASTE': '맛',
      'ATMOSPHERE': '분위기',
      'ALLERGY': '알러지',
      'SERVICE': '서비스',
      'PRICE': '가격대',
      'FOOD_TYPE': '음식 종류',
      'HEALTH': '건강 정보'
    };
    return categoryNames[category] || category;
  };

  const loadStoreInfo = async () => {
    try {
      setLoading(true);
      const response = await storeApi.get(`/api/stores/${selectedStoreId}`);
      const data = response.data.data || {};
      setStoreInfo({
        name: data.storeName || '',
        description: data.description || '',
        address: data.address || '',
        phone: data.phone || '',
        operatingHours: data.operatingHours || '',
        category: data.category || '',
        tags: data.tags || [],
        imageUrl: data.imageUrl || '/images/store-default.jpg' // ✅ 추가
      });
    } catch (error) {
      console.error('매장 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

const handleSave = async () => {
  try {
    setSaving(true);
    
    // ✅ 백엔드 API 필드명에 맞게 데이터 구조 변경
    const updateData = {
      storeName: storeInfo.name,        // ✅ name → storeName
      address: storeInfo.address,
      description: storeInfo.description,
      phone: storeInfo.phone,
      operatingHours: storeInfo.operatingHours,
      tags: storeInfo.tags,
      imageUrl: storeInfo.imageUrl
    };
    
    console.log('매장 수정 요청 데이터:', updateData);
    
    await storeApi.put(`/api/stores/${selectedStoreId}`, updateData);
    alert('매장 정보가 저장되었습니다.');
    await loadStores();
    
  } catch (error) {
    console.error('매장 정보 저장 실패:', error);
    console.error('에러 응답:', error.response?.data);
    
    // ✅ 더 자세한 에러 메시지 표시
    const errorMessage = error.response?.data?.message || '저장에 실패했습니다.';
    alert(`저장 실패: ${errorMessage}`);
    
  } finally {
    setSaving(false);
  }
};

  const handleInputChange = (field, value) => {
    setStoreInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ✅ 7. handleTagToggle 함수 수정 (AllTagResponse 구조 지원 + 클릭 기록)
  const handleTagToggle = async (tag) => {
    // AllTagResponse 구조: { id, tagCategory, tagName } 또는 기존 문자열
    const tagName = typeof tag === 'string' ? tag : tag.tagName;
    
    setStoreInfo(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName) 
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName]
    }));

    // 태그 클릭 이벤트 기록 (tag 객체이고 id가 있는 경우만)
    if (typeof tag === 'object' && tag.id) {
      try {
        await storeService.recordTagClick(tag.id);
      } catch (error) {
        console.warn('태그 클릭 기록 실패:', error);
      }
    }
  };

  // ✅ 이미지 업로드 함수 추가
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검사 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    try {
      setImageUploading(true);

      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'store');
      formData.append('relatedId', selectedStoreId);

      console.log('🔄 이미지 업로드 시작:', file.name);

      // 이미지 업로드 API 호출
      const uploadResponse = await storeApi.post('/api/files/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ 이미지 업로드 성공:', uploadResponse.data);

      // 응답에서 이미지 URL 추출
      const imageUrl = uploadResponse.data.data?.url || uploadResponse.data.url;
      
      if (imageUrl) {
        // storeInfo 상태 업데이트
        setStoreInfo(prev => ({
          ...prev,
          imageUrl: imageUrl
        }));

        console.log('🖼️ 이미지 URL 업데이트:', imageUrl);
        alert('이미지가 업로드되었습니다. 저장 버튼을 클릭하여 변경사항을 저장하세요.');
      } else {
        throw new Error('이미지 URL을 받지 못했습니다.');
      }

    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setImageUploading(false);
      // 파일 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // ✅ 이미지 변경 버튼 클릭 핸들러 추가
  const handleImageChangeClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <OwnerHeader 
          title="매장 정보 관리"
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
        title="매장 정보 관리"
        subtitle={selectedStore ? `${selectedStore.name} 정보` : '매장을 선택해주세요'}
        showStoreSelector={true}
        backPath="/owner/store-management"
      />
      
      <Box className="content-area">
        {!selectedStoreId ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Store sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                정보를 수정할 매장을 선택해주세요
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                우측 상단에서 매장을 선택할 수 있습니다
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box>
            {/* 기본 정보 */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  🏪 기본 정보
                </Typography>
                {/* ✅ 매장 이미지 섹션 추가 */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                    매장 이미지
                  </Typography>
                  
                  {/* 숨겨진 파일 입력 */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  
                  <Box
                    sx={{
                      width: '100%',
                      height: 180,
                      borderRadius: 1,
                      mb: 2,
                      overflow: 'hidden',
                      backgroundColor: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #e9ecef',
                      position: 'relative'
                    }}
                  >
                    {storeInfo.imageUrl && storeInfo.imageUrl !== '/images/store-default.jpg' ? (
                      <Box
                        component="img"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        src={storeInfo.imageUrl}
                        alt={storeInfo.name || '매장 이미지'}
                        onError={(e) => {
                          console.log('이미지 로드 실패:', storeInfo.imageUrl);
                          // 이미지 로드 실패 시 기본 표시로 전환
                          setStoreInfo(prev => ({ ...prev, imageUrl: '/images/store-default.jpg' }));
                        }}
                      />
                    ) : (
                      // 기본 이미지 표시 영역
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: '#6c757d'
                        }}
                      >
                        <Store sx={{ fontSize: 50, mb: 1, opacity: 0.6 }} />
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {storeInfo.name || '매장명'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {storeInfo.category || '카테고리'} · {storeInfo.address ? storeInfo.address.split(' ').slice(0, 2).join(' ') : '위치'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          이미지 준비중
                        </Typography>
                      </Box>
                    )}
                    
                    {/* 업로딩 중 표시 */}
                    {imageUploading && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <CircularProgress size={40} sx={{ color: 'white', mb: 1 }} />
                          <Typography variant="body2">업로드 중...</Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  
                  {/* 이미지 변경 버튼 */}
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    onClick={handleImageChangeClick}
                    disabled={imageUploading}
                  >
                    {imageUploading ? '업로드 중...' : '이미지 변경'}
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="매장명"
                      value={storeInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="매장 설명"
                      value={storeInfo.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      variant="outlined"
                      multiline
                      rows={3}
                      placeholder="매장을 소개하는 간단한 설명을 입력해주세요"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>카테고리</InputLabel>
                      <Select
                        value={storeInfo.category}
                        label="카테고리"
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 연락처 정보 */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  📞 연락처 정보
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="주소"
                      value={storeInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      variant="outlined"
                      placeholder="도로명 주소를 입력해주세요"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="전화번호"
                      value={storeInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      variant="outlined"
                      placeholder="010-1234-5678"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="운영시간"
                      value={storeInfo.operatingHours}
                      onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                      variant="outlined"
                      placeholder="예: 월-금 09:00-22:00, 토-일 10:00-21:00"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

          {/* 태그 섹션 - 수정된 부분 */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  매장 특징 태그
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  매장의 특징을 나타내는 태그를 선택해주세요. (선택된 태그: {storeInfo.tags.length}개)
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
                              key={tag.id}
                              label={tag.tagName}
                              onClick={() => handleTagToggle(tag)}
                              variant={storeInfo.tags.includes(tag.tagName) ? 'filled' : 'outlined'}
                              color={storeInfo.tags.includes(tag.tagName) ? 'primary' : 'default'}
                              clickable
                              sx={{
                                '&:hover': {
                                  backgroundColor: storeInfo.tags.includes(tag.tagName) ? 'primary.dark' : 'action.hover'
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
                        onClick={() => handleTagToggle(tag)}
                        variant={storeInfo.tags.includes(tag.tagName || tag) ? 'filled' : 'outlined'}
                        color={storeInfo.tags.includes(tag.tagName || tag) ? 'primary' : 'default'}
                        clickable
                      />
                    ))}
                  </Box>
                )}
                
                {/* 선택된 태그 미리보기 */}
                {storeInfo.tags.length > 0 && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      선택된 태그:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {storeInfo.tags.map((tagName) => (
                        <Chip
                          key={tagName}
                          label={tagName}
                          size="small"
                          color="primary"
                          onDelete={() => handleTagToggle({ tagName })}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* 저장 버튼 */}
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={saving}
                  fullWidth
                >
                  {saving ? '저장 중...' : '매장 정보 저장'}
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
      
      <Navigation />
    </Box>
  );
};

export default StoreInfo;