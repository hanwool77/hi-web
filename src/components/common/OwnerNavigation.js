import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { Dashboard, Store, Person } from '@mui/icons-material';

const OwnerNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getValue = () => {
    if (location.pathname === '/owner' || location.pathname.includes('/owner/stores')) return 0;
    if (location.pathname.includes('/owner/analytics') || location.pathname.includes('/owner/management')) return 1;
    if (location.pathname.includes('/owner/mypage')) return 2;
    return 0;
  };

  return (
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
        onChange={(event, newValue) => {
          switch (newValue) {
            case 0:
              navigate('/owner');
              break;
            case 1:
              navigate('/owner/stores');
              break;
            case 2:
              navigate('/owner/mypage');
              break;
            default:
              break;
          }
        }}
      >
        <BottomNavigationAction label="대시보드" icon={<Dashboard />} />
        <BottomNavigationAction label="매장관리" icon={<Store />} />
        <BottomNavigationAction label="마이페이지" icon={<Person />} />
      </BottomNavigation>
    </Box>
  );
};

export default OwnerNavigation;
