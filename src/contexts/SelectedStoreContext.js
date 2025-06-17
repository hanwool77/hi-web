import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { storeService } from '../services/storeService';

const SelectedStoreContext = createContext();

export const useSelectedStore = () => {
  const context = useContext(SelectedStoreContext);
  if (!context) {
    throw new Error('useSelectedStore must be used within a SelectedStoreProvider');
  }
  return context;
};

export const SelectedStoreProvider = ({ children }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 매장 목록 로드
  const loadStores = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('매장 목록 로드 시작');
      
      const response = await storeService.getMyStores();
      console.log('매장 목록 응답:', response);
      
      if (response.success && response.data) {
        // 필드명 통일: storeName -> name으로 변환하여 기존 코드와 호환
        const storesWithName = response.data.map(store => ({
          ...store,
          name: store.storeName // storeName을 name으로 복사
        }));
        
        setStores(storesWithName);
        
        // 매장이 있으면 저장된 ID를 우선 복원하고, 없으면 첫 번째 매장 선택
        const savedStoreId = localStorage.getItem('selectedStoreId');
        if (savedStoreId && storesWithName.some(store => store.storeId === parseInt(savedStoreId))) {
          setSelectedStoreId(parseInt(savedStoreId));
          console.log('저장된 매장 복원:', savedStoreId);
        } else if (storesWithName.length > 0) {
          const firstStoreId = storesWithName[0].storeId;
          setSelectedStoreId(firstStoreId);
          localStorage.setItem('selectedStoreId', firstStoreId.toString());
          console.log('첫 번째 매장 자동 선택:', firstStoreId);
        } else {
          setSelectedStoreId(null);
          localStorage.removeItem('selectedStoreId');
          console.log('등록된 매장이 없음');
        }
      } else {
        console.error('매장 목록 로드 실패:', response.message);
        setError(response.message || '매장 목록을 불러올 수 없습니다.');
        setStores([]);
        setSelectedStoreId(null);
      }
    } catch (error) {
      console.error('매장 목록 로드 중 오류:', error);
      setError('매장 목록을 불러오는 중 오류가 발생했습니다.');
      setStores([]);
      setSelectedStoreId(null);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 인증 상태 변경 시 매장 목록 로드
  useEffect(() => {
    // 인증 로딩이 완료된 후에만 처리
    if (!authLoading) {
      if (isAuthenticated() && user?.role === 'OWNER') {
        loadStores();
      } else {
        setStores([]);
        setSelectedStoreId(null);
        setLoading(false);
        setError(null);
      }
    }
  }, [user, isAuthenticated, authLoading]);

  const selectStore = (storeId) => {
    setSelectedStoreId(storeId);
    if (storeId) {
      localStorage.setItem('selectedStoreId', storeId.toString());
    } else {
      localStorage.removeItem('selectedStoreId');
    }
  };

  const refreshStores = () => {
    if (!authLoading && isAuthenticated() && user?.role === 'OWNER') {
      loadStores();
    }
  };

  const selectedStore = stores.find(store => store.storeId === selectedStoreId) || null;

  const value = {
    selectedStoreId,
    selectedStore,
    stores,
    loading,
    error,
    selectStore,
    refreshStores
  };

  return (
    <SelectedStoreContext.Provider value={value}>
      {children}
    </SelectedStoreContext.Provider>
  );
};