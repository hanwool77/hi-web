//* src/components/common/Navigation.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Box, 
  Select, 
  MenuItem, 
  FormControl,
  Typography,
  CircularProgress
} from '@mui/material';
import { Assessment, Store, Person } from '@mui/icons-material';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';

const OwnerNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedStoreId, setSelectedStoreId, stores, loading, refreshStores } = useSelectedStore();

  // 현재 선택된 네비게이션 값 계산
  const getValue = () => {
    if (location.pathname.includes('/owner/analytics')) return 0;
    if (location.pathname.includes('/owner/management') || 
        location.pathname.includes('/owner/stores') ||
        location.pathname === '/owner') return 1;
    if (location.pathname.includes('/owner/mypage')) return 2;
    return 0; // 기본값을 분석으로 설정
  };

  // 매장 변경 핸들러
  const handleStoreChange = (storeId) => {
    console.log('매장 변경:', storeId);
    setSelectedStoreId(storeId);
    
    // 매장 변경 시 해당 매장의 분석 페이지로 이동
    if (storeId) {
      navigate(`/owner/analytics/${storeId}`);
    }
  };

  // 네비게이션 클릭 핸들러
  const handleNavigationChange = (event, newValue) => {
    console.log('네비게이션 클릭:', newValue);
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
              {stores.map((store) => (
                <MenuItem key={store.storeId} value={store.storeId}>
                  <Typography variant="body2">
                    {store.storeName || store.name || `매장 ${store.storeId}`}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* 하단 네비게이션 */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 375,
          zIndex: 1000,
          bgcolor: 'white',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <BottomNavigation
          value={getValue()}
          onChange={handleNavigationChange}
        >
          <BottomNavigationAction label="분석" icon={<Assessment />} />
          <BottomNavigationAction label="매장관리" icon={<Store />} />
          <BottomNavigationAction label="마이페이지" icon={<Person />} />
        </BottomNavigation>
      </Box>
    </>
  );
};

export default OwnerNavigation;