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
  const { selectedStoreId, setSelectedStoreId, stores, loading, error } = useSelectedStore();
  
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
    setSelectedStoreId(newStoreId);
    // 매장 변경 시에는 현재 페이지 유지
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
            padding: '4px 8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            maxWidth: '160px',
            minWidth: '120px'
          }}
        >
          <FormControl size="small" fullWidth>
            <Select
              value={selectedStoreId || ''}
              onChange={(e) => handleStoreChange(e.target.value)}
              displayEmpty
              variant="standard"
              sx={{ 
                fontSize: '12px',
                '& .MuiSelect-select': {
                  padding: '4px 24px 4px 8px',
                  fontSize: '12px'
                },
                '& .MuiSelect-icon': {
                  fontSize: '16px'
                }
              }}
            >
              {selectedStoreId === null && (
                <MenuItem value="" disabled>
                  <Typography variant="caption" color="text.secondary">
                    매장 선택
                  </Typography>
                </MenuItem>
              )}
              {stores.map((store) => (
                <MenuItem key={store.storeId} value={store.storeId}>
                  <Typography variant="caption" sx={{ fontSize: '12px' }}>
                    {store.storeName}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* 로딩 상태 */}
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

      {/* 하단 네비게이션 */}
      <BottomNavigation
        className="bottom-navigation"
        value={getValue()}
        onChange={(event, newValue) => {
          console.log('네비게이션 버튼 클릭:', newValue);
          console.log('현재 경로:', location.pathname);
          console.log('선택된 매장 ID:', selectedStoreId);
          
          switch (newValue) {
            case 0:
              // 첫 번째 버튼: 분석
              console.log('분석 페이지로 이동');
              if (selectedStoreId) {
                navigate(`/owner/analytics/${selectedStoreId}`);
              } else {
                navigate('/owner');
              }
              break;
              
            case 1:
              // 두 번째 버튼: 매장관리
              console.log('매장관리 페이지로 이동 - /owner/management');
              navigate('/owner/management');
              break;
              
            case 2:
              // 세 번째 버튼: 마이페이지
              console.log('마이페이지로 이동');
              navigate('/owner/mypage');
              break;
              
            default:
              break;
          }
        }}
      >
        <BottomNavigationAction label="분석" icon={<Analytics />} />
        <BottomNavigationAction label="매장관리" icon={<Store />} />
        <BottomNavigationAction label="마이페이지" icon={<Person />} />
      </BottomNavigation>
    </>
  );
};

export default OwnerNavigation;