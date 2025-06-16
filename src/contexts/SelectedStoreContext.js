//* src/contexts/SelectedStoreContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storeApi } from '../services/api';

const SelectedStoreContext = createContext();

export const useSelectedStore = () => {
  const context = useContext(SelectedStoreContext);
  if (!context) {
    throw new Error('useSelectedStore must be used within SelectedStoreProvider');
  }
  return context;
};

export const SelectedStoreProvider = ({ children }) => {
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 내 매장 목록 로드 및 첫 번째 매장 자동 선택
  useEffect(() => {
    loadMyStores();
  }, []);

  const loadMyStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await storeApi.get('/api/stores/my');
      console.log('매장 목록 API 응답:', response.data);
      
      // API 응답 구조에 따라 데이터 추출
      let storeList = [];
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        storeList = response.data.data;
      } else if (Array.isArray(response.data)) {
        storeList = response.data;
      }
      
      setStores(storeList);
      
      // 저장된 매장 ID 확인 (sessionStorage 사용)
      const savedStoreId = sessionStorage.getItem('selectedStoreId');
      
      if (savedStoreId && storeList.find(store => store.storeId === parseInt(savedStoreId))) {
        // 저장된 매장 ID가 유효하면 사용
        const storeId = parseInt(savedStoreId);
        setSelectedStoreId(storeId);
        console.log('저장된 매장 ID 사용:', storeId);
      } else if (storeList.length > 0) {
        // 그렇지 않으면 첫 번째 매장 선택
        const firstStoreId = storeList[0].storeId;
        setSelectedStoreId(firstStoreId);
        sessionStorage.setItem('selectedStoreId', firstStoreId.toString());
        console.log('첫 번째 매장 자동 선택:', firstStoreId);
      } else {
        // 매장이 없는 경우
        setSelectedStoreId(null);
        sessionStorage.removeItem('selectedStoreId');
        console.log('매장이 없음');
      }
    } catch (error) {
      console.error('매장 목록 로드 실패:', error);
      setError('매장 목록을 불러올 수 없습니다.');
      
      // 에러 발생 시에도 빈 배열로 설정
      setStores([]);
      setSelectedStoreId(null);
      sessionStorage.removeItem('selectedStoreId');
    } finally {
      setLoading(false);
    }
  };

  // 매장 ID 변경 시 sessionStorage에 저장
  const handleSetSelectedStoreId = (storeId) => {
    console.log('매장 ID 변경:', storeId);
    setSelectedStoreId(storeId);
    if (storeId) {
      sessionStorage.setItem('selectedStoreId', storeId.toString());
    } else {
      sessionStorage.removeItem('selectedStoreId');
    }
  };

  // 매장 목록 새로고침 함수
  const refreshStores = () => {
    console.log('매장 목록 새로고침');
    loadMyStores();
  };

  return (
    <SelectedStoreContext.Provider 
      value={{ 
        selectedStoreId, 
        setSelectedStoreId: handleSetSelectedStoreId,
        stores,
        loading,
        error,
        refreshStores
      }}
    >
      {children}
    </SelectedStoreContext.Provider>
  );
};