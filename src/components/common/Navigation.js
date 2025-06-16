//* src/components/common/Navigation.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Box, FormControl, Select, MenuItem } from '@mui/material';
import { Analytics, Store, Person } from '@mui/icons-material';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';

const OwnerNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedStoreId, setSelectedStoreId } = useSelectedStore();
  
  const getValue = () => {
    if (location.pathname.includes('/owner') && (location.pathname.includes('/analytics') || location.pathname.includes('/ai-feedback') || location.pathname.includes('/action-plan') || location.pathname === '/owner' || location.pathname === '/owner/')) return 0;
    if (location.pathname.includes('/owner/stores') && location.pathname.includes('/management')) return 1;
    if (location.pathname.includes('/owner/mypage')) return 2;
    return 0;
  };

  const stores = [
    { id: 1, name: '분식천국' },
    { id: 2, name: '맛있는 한식당' }
  ];

  const handleStoreChange = (newStoreId) => {
    setSelectedStoreId(newStoreId);
    
    // 현재 페이지에 따라 적절한 URL로 이동
    if (location.pathname.includes('/management')) {
      navigate(`/owner/stores/${newStoreId}/management`);
    } else if (location.pathname.includes('/analytics')) {
      navigate(`/owner/stores/${newStoreId}/analytics`);
    } else if (location.pathname.includes('/ai-feedback')) {
      navigate(`/owner/stores/${newStoreId}/ai-feedback`);
    } else if (location.pathname.includes('/action-plan')) {
      navigate(`/owner/stores/${newStoreId}/action-plan`);
    } else {
      navigate('/owner');
    }
  };

  return (
    <>
      {/* 매장 선택 드롭다운 */}
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
          maxWidth: '140px'
        }}
      >
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={selectedStoreId}
            onChange={(e) => handleStoreChange(e.target.value)}
            displayEmpty
            variant="standard"
            sx={{ 
              fontSize: '11px',
              '& .MuiSelect-select': {
                padding: '4px 24px 4px 8px',
                fontSize: '11px'
              }
            }}
          >
            {stores.map((store) => (
              <MenuItem key={store.id} value={store.id} sx={{ fontSize: '12px' }}>
                {store.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <BottomNavigation
        className="bottom-navigation"
        value={getValue()}
        onChange={(event, newValue) => {
          switch (newValue) {
            case 0:
              navigate('/owner');
              break;
            case 1:
              navigate(`/owner/stores/${selectedStoreId}/management`);
              break;
            case 2:
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