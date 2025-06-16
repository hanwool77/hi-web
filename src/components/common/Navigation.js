//* src/components/common/Navigation.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Box, 
  FormControl, 
  Select, 
  MenuItem,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { Analytics, Store, Person } from '@mui/icons-material';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';

const OwnerNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedStoreId, setSelectedStoreId, stores, loading, error, refreshStores } = useSelectedStore();
  
  // 현재 경로에 따른 네비게이션 value 결정
  const getValue = () => {
    const path = location.pathname;
    console.log('현재 경로:', path);
    
    // 매장관리 관련 경로들 - 두 번째 탭(1)
    if (path === '/owner/management' ||
        path.includes('/management') || 
        path.includes('/menu') || 
        path.includes('/reviews') || 
        path.includes('/info') ||
        (path.includes('/store') && !path.includes('/analytics'))) {
      return 1;
    }
    
    // 마이페이지 - 세 번째 탭(2)
    if (path.includes('/mypage')) {
      return 2;
    }
    
    // 분석 관련 또는 기본 - 첫 번째 탭(0)
    return 0;
  };

  const handleStoreChange = (newStoreId) => {
    console.log('매장 변경:', newStoreId);
    setSelectedStoreId(newStoreId);
    
    // 매장 변경 시 현재 페이지가 분석 페이지라면 새 매장의 분석 페이지로 이동
    if (location.pathname.includes('/analytics/')) {
      navigate(`/owner/analytics/${newStoreId}`);
    }
  };

  // 네비게이션 버튼 클릭 처리
  const handleNavigation = (newValue) => {
    console.log('네비게이션 버튼 클릭:', newValue);
    console.log('현재 경로:', location.pathname);
    console.log('선택된 매장 ID:', selectedStoreId);
    
    switch (newValue) {
      case 0:
        // 분석 페이지
        if (selectedStoreId) {
          console.log(`분석 페이지로 이동: /owner/analytics/${selectedStoreId}`);
          navigate(`/owner/analytics/${selectedStoreId}`);
        } else {
          console.log('매장이 선택되지 않음, 매장 목록 새로고침 시도');
          refreshStores();
          // 매장이 없으면 기본 점주 페이지로
          navigate('/owner');
        }
        break;
        
      case 1:
        // 매장관리 페이지
        console.log('매장관리 페이지로 이동');
        navigate('/owner/management');
        break;
        
      case 2:
        // 마이페이지
        console.log('마이페이지로 이동');
        navigate('/owner/mypage');
        break;
        
      default:
        break;
    }
  };

  return (
    <>
      {/* 매장 선택 드롭다운 */}
      {!loading && stores.length > 0 && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 8, 
            right: 8, 
            zIndex: 1000,
            bgcolor: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            padding: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: 150
          }}
        >
          <FormControl size="small" fullWidth>
            <Select
              value={selectedStoreId || ''}
              onChange={(e) => handleStoreChange(e.target.value)}
              displayEmpty
              sx={{ 
                fontSize: '0.875rem',
                '& .MuiSelect-select': {
                  padding: '4px 8px'
                }
              }}
            >
              {selectedStoreId === null && (
                <MenuItem value="" disabled>
                  매장 선택
                </MenuItem>
              )}
              {stores.map((store) => (
                <MenuItem key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* 로딩 표시 */}
      {loading && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 8, 
            right: 8, 
            zIndex: 1000,
            bgcolor: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            padding: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <CircularProgress size={16} />
        </Box>
      )}

      {/* 에러 표시 */}
      {error && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 8, 
            right: 8, 
            zIndex: 1000,
            maxWidth: 200
          }}
        >
          <Alert severity="error" size="small">
            {error}
          </Alert>
        </Box>
      )}

      {/* 하단 네비게이션 */}
      <BottomNavigation
        className="bottom-navigation"
        value={getValue()}
        onChange={(event, newValue) => handleNavigation(newValue)}
      >
        <BottomNavigationAction label="분석" icon={<Analytics />} />
        <BottomNavigationAction label="매장관리" icon={<Store />} />
        <BottomNavigationAction label="마이페이지" icon={<Person />} />
      </BottomNavigation>
    </>
  );
};

export default OwnerNavigation;