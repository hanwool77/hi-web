import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { Home, Search, Assignment, Person } from '@mui/icons-material';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getValue = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname.includes('/search')) return 1;
    if (location.pathname.includes('/reviews')) return 2;
    if (location.pathname.includes('/mypage')) return 3;
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
              navigate('/');
              break;
            case 1:
              navigate('/search');
              break;
            case 2:
              navigate('/reviews');
              break;
            case 3:
              navigate('/mypage');
              break;
            default:
              break;
          }
        }}
      >
        <BottomNavigationAction label="홈" icon={<Home />} />
        <BottomNavigationAction label="검색" icon={<Search />} />
        <BottomNavigationAction label="리뷰" icon={<Assignment />} />
        <BottomNavigationAction label="마이페이지" icon={<Person />} />
      </BottomNavigation>
    </Box>
  );
};

export default Navigation;


