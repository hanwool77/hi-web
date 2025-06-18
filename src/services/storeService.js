//* src/services/storeService.js
import { storeApi } from './api';

export const storeService = {
  // 매장 등록
  createStore: async (storeData) => {
    const response = await storeApi.post('/api/stores', {
      storeName: storeData.name,
      address: storeData.address,
      description: storeData.description,
      phone: storeData.phone,
      operatingHours: storeData.operatingHours,
      category: storeData.category,
      tags: storeData.tags,
      menus: storeData.menus || []
    });
    return response.data;
  },

  // 내 매장 목록 조회
  getMyStores: async () => {
    try {
      const response = await storeApi.get('/api/stores/my');
      console.log('getMyStores API 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('매장 목록 조회 실패:', error);
      throw error;
    }
  },

  // ✅ StoresList.js에서 사용하는 getOwnerStores 메서드 추가 (getMyStores와 동일)
  getOwnerStores: async () => {
    try {
      const response = await storeApi.get('/api/stores/my');
      console.log('getOwnerStores API 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('매장 목록 조회 실패:', error);
      throw error;
    }
  },

  // 매장 상세 조회
  getStoreDetail: async (storeId) => {
    try {
      console.log('🌐 API 호출 시작:', `/api/stores/${storeId}`);
      
      const response = await storeApi.get(`/api/stores/${storeId}`);
      
      console.log('🌐 원시 HTTP 응답:', response);
      console.log('🌐 응답 데이터:', response.data);
      console.log('🌐 응답 상태:', response.status);
      console.log('🌐 응답 헤더:', response.headers);
      
      // imageUrl 특별 확인
      if (response.data && response.data.data) {
        console.log('🖼️ imageUrl in response.data.data:', response.data.data.imageUrl);
      }
      if (response.data) {
        console.log('🖼️ imageUrl in response.data:', response.data.imageUrl);
      }
      
      return response.data;
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  },

  // 매장 수정
  updateStore: async (storeId, storeData) => {
    const response = await storeApi.put(`/api/stores/${storeId}`, storeData);
    return response.data;
  },

  // 매장 삭제
  deleteStore: async (storeId) => {
    const response = await storeApi.delete(`/api/stores/${storeId}`);
    return response.data;
  },

  // 매장 검색
  searchStores: async (searchParams) => {
    const response = await storeApi.get('/api/stores/search', {
      params: searchParams
    });
    return response.data;
  },

  // 사용 가능한 태그 목록 조회 (추가됨)
  getAllTags: async () => {
    try {
      const response = await storeApi.get('/api/stores/tags');
      console.log('태그 API 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('태그 목록 조회 실패:', error);
      throw error;
    }
  },

  // 인기 태그 조회 (추가됨)
  getTopClickedTags: async () => {
    try {
      const response = await storeApi.get('/api/stores/tags/top-clicked');
      return response.data;
    } catch (error) {
      console.error('인기 태그 조회 실패:', error);
      throw error;
    }
  },

  // 태그 클릭 기록 (추가됨)
  recordTagClick: async (tagId) => {
    try {
      const response = await storeApi.post(`/api/stores/tags/${tagId}/click`);
      return response.data;
    } catch (error) {
      console.error('태그 클릭 기록 실패:', error);
      throw error;
    }
  }
};