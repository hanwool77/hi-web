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

  // 내 매장 목록 로드 및 첫 번째 매장 자동 선택
  useEffect(() => {
    loadMyStores();
  }, []);

  const loadMyStores = async () => {
    try {
      const response = await storeApi.get('/api/stores/my');
      const storeList = response.data.data || [];
      setStores(storeList);
      
      // 저장된 매장 ID 확인
      const savedStoreId = localStorage.getItem('selectedStoreId');
      
      if (savedStoreId && storeList.find(store => store.id === parseInt(savedStoreId))) {
        // 저장된 매장 ID가 유효하면 사용
        setSelectedStoreId(parseInt(savedStoreId));
      } else if (storeList.length > 0) {
        // 그렇지 않으면 첫 번째 매장 선택
        setSelectedStoreId(storeList[0].id);
        localStorage.setItem('selectedStoreId', storeList[0].id.toString());
      }
    } catch (error) {
      console.error('매장 목록 로드 실패:', error);
      // API 실패 시 임시 매장 데이터 생성 (개발용)
      const tempStores = [
        { id: 1, name: '테스트 매장 1' },
        { id: 2, name: '테스트 매장 2' },
        { id: 3, name: '테스트 매장 3' }
      ];
      setStores(tempStores);
      
      // 저장된 매장 ID 확인
      const savedStoreId = localStorage.getItem('selectedStoreId');
      if (savedStoreId) {
        setSelectedStoreId(parseInt(savedStoreId));
      } else {
        setSelectedStoreId(tempStores[0].id);
        localStorage.setItem('selectedStoreId', tempStores[0].id.toString());
      }
    } finally {
      setLoading(false);
    }
  };

  // 매장 ID 변경 시 로컬스토리지에 저장
  const handleSetSelectedStoreId = (storeId) => {
    setSelectedStoreId(storeId);
    localStorage.setItem('selectedStoreId', storeId.toString());
  };

  return (
    <SelectedStoreContext.Provider 
      value={{ 
        selectedStoreId, 
        setSelectedStoreId: handleSetSelectedStoreId,
        stores,
        loading
      }}
    >
      {children}
    </SelectedStoreContext.Provider>
  );
};