//* src/contexts/SelectedStoreContext.js
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
      console.log('매장 목록 API 원본 응답:', response);
      
      // ✅ 다양한 응답 형식에 대응
      let storeData = [];
      
      if (response && response.success && Array.isArray(response.data)) {
        // ApiResponse<List<Store>> 형식
        storeData = response.data;
      } else if (response && Array.isArray(response.data)) {
        // { data: Store[] } 형식
        storeData = response.data;
      } else if (Array.isArray(response)) {
        // Store[] 직접 반환 형식
        storeData = response;
      } else if (response && response.data && !Array.isArray(response.data)) {
        // data가 객체인 경우 (단일 매장?)
        storeData = [response.data];
      } else {
        console.warn('예상과 다른 응답 형식:', response);
        storeData = [];
      }
      
      console.log('파싱된 매장 데이터:', storeData);
      
      if (storeData.length > 0) {
        // 필드명 통일: storeName -> name으로 변환하여 기존 코드와 호환
        const storesWithName = storeData.map(store => ({
          ...store,
          name: store.storeName || store.name, // storeName을 name으로 복사/변환
          id: store.storeId || store.id // storeId를 id로 복사/변환
        }));
        
        setStores(storesWithName);
        
        // 매장이 있으면 저장된 ID를 우선 복원하고, 없으면 첫 번째 매장 선택
        const savedStoreId = localStorage.getItem('selectedStoreId');
        const savedStoreIdNum = savedStoreId ? parseInt(savedStoreId) : null;
        
        if (savedStoreIdNum && storesWithName.some(store => (store.storeId || store.id) === savedStoreIdNum)) {
          setSelectedStoreId(savedStoreIdNum);
          console.log('저장된 매장 복원:', savedStoreIdNum);
        } else if (storesWithName.length > 0) {
          const firstStoreId = storesWithName[0].storeId || storesWithName[0].id;
          setSelectedStoreId(firstStoreId);
          localStorage.setItem('selectedStoreId', firstStoreId.toString());
          console.log('첫 번째 매장 자동 선택:', firstStoreId);
        }
      } else {
        console.log('등록된 매장이 없음');
        setStores([]);
        setSelectedStoreId(null);
        localStorage.removeItem('selectedStoreId');
      }
    } catch (error) {
      console.error('매장 목록 로드 중 오류:', error);
      console.error('오류 상세:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          '매장 목록을 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      setStores([]);
      setSelectedStoreId(null);
      localStorage.removeItem('selectedStoreId');
    } finally {
      setLoading(false);
    }
  };

  // 인증된 사용자이고 점주인 경우에만 매장 목록 로드
  useEffect(() => {
    if (!authLoading && isAuthenticated() && user?.role === 'OWNER') {
      loadStores();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, user?.role]);

  // 매장 선택 함수
  const selectStore = (storeId) => {
    setSelectedStoreId(storeId);
    if (storeId) {
      localStorage.setItem('selectedStoreId', storeId.toString());
    } else {
      localStorage.removeItem('selectedStoreId');
    }
  };

  // 선택된 매장 정보 가져오기
  const selectedStore = stores.find(store => 
    (store.storeId || store.id) === selectedStoreId
  );

  const value = {
    selectedStoreId,
    selectedStore,
    stores,
    loading,
    error,
    selectStore,
    loadStores, // 외부에서 다시 로드할 수 있도록 노출
  };

  return (
    <SelectedStoreContext.Provider value={value}>
      {children}
    </SelectedStoreContext.Provider>
  );
};