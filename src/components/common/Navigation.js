//* src/components/common/Navigation.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Person, Store, Assessment } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  // 사용자 역할에 따라 다른 네비게이션 표시
  const getNavigationItems = () => {
    if (user?.role === 'USER') {
      return [
        { label: '홈', icon: <Home />, path: '/customer/main' },
        { label: '마이페이지', icon: <Person />, path: '/customer/mypage' }
      ];
    } else if (user?.role === 'OWNER') {
      return [
        { label: '분석', icon: <Assessment />, path: '/owner' },
        { label: '매장관리', icon: <Store />, path: '/owner/store-management' },
        { label: '마이페이지', icon: <Person />, path: '/owner/mypage' }
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();
  
  // 로딩 중이거나 user가 없으면 렌더링하지 않음
  if (loading || !user || navigationItems.length === 0) {
    return null;
  }
  
  const getCurrentValue = () => {
    const currentPath = location.pathname;
    
    // 정확한 매치를 위해 더 구체적인 경로부터 확인
    for (let i = 0; i < navigationItems.length; i++) {
      const item = navigationItems[i];
      
      // 정확한 경로 매치
      if (currentPath === item.path) {
        return i;
      }
      
      // 하위 경로 매치 (단, /owner는 제외하여 더 구체적인 경로 우선)
      if (item.path !== '/owner' && currentPath.startsWith(item.path + '/')) {
        return i;
      }
    }
    
    // /owner로 시작하는 경로인 경우에만 분석(index 0) 반환
    // 단, 다른 구체적인 경로가 아닌 경우에만
    if (currentPath.startsWith('/owner') && 
        !currentPath.startsWith('/owner/store-management') && 
        !currentPath.startsWith('/owner/mypage')) {
      return 0;
    }
    
    return 0;
  };

  const handleNavigationChange = (event, newValue) => {
    if (navigationItems[newValue]) {
      navigate(navigationItems[newValue].path);
    }
  };

  return (
    <BottomNavigation
      value={getCurrentValue()}
      onChange={handleNavigationChange}
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        zIndex: 1000
      }}
    >
      {navigationItems.map((item, index) => (
        <BottomNavigationAction
          key={index}
          label={item.label}
          icon={item.icon}
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem'
            }
          }}
        />
      ))}
    </BottomNavigation>
  );
};

export default Navigation;