//* src/services/storeService.js
import { storeApi } from './api';

export const storeService = {
  // 내 매장 목록 조회 (점주용)
  getMyStores: async () => {
    try {
      const response = await storeApi.get('/api/stores/my');
      return response.data;
    } catch (error) {
      console.error('내 매장 목록 조회 실패:', error);
      throw error;
    }
  },

  // 매장 상세 정보 조회
  getStoreDetail: async (storeId) => {
    try {
      const response = await storeApi.get(`/api/stores/${storeId}`);
      return response.data;
    } catch (error) {
      console.error('매장 상세 정보 조회 실패:', error);
      throw error;
    }
  },

  // 매장 등록
  createStore: async (storeData) => {
    try {
      const response = await storeApi.post('/api/stores', storeData);
      return response.data;
    } catch (error) {
      console.error('매장 등록 실패:', error);
      throw error;
    }
  },

  // 매장 정보 수정
  updateStore: async (storeId, storeData) => {
    try {
      const response = await storeApi.put(`/api/stores/${storeId}`, storeData);
      return response.data;
    } catch (error) {
      console.error('매장 정보 수정 실패:', error);
      throw error;
    }
  },

  // 매장 삭제
  deleteStore: async (storeId) => {
    try {
      const response = await storeApi.delete(`/api/stores/${storeId}`);
      return response.data;
    } catch (error) {
      console.error('매장 삭제 실패:', error);
      throw error;
    }
  },

  // 매장 메뉴 조회
  getStoreMenus: async (storeId) => {
    try {
      const response = await storeApi.get(`/api/stores/${storeId}/menus`);
      return response.data;
    } catch (error) {
      console.error('매장 메뉴 조회 실패:', error);
      throw error;
    }
  },

  // 매장명으로 검색 - 백엔드 API와 일치 ⭐
  searchStoresByName: async (storeName) => {
    try {
      console.log('🔍 매장명 검색 API 호출:', storeName);
      const response = await storeApi.get(`/api/stores/search/storeName/${encodeURIComponent(storeName)}`);
      console.log('✅ 매장명 검색 API 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 매장명 검색 실패:', error);
      throw error;
    }
  },

  // 종합 매장 검색 (기존 /api/stores/search 사용)
  searchStores: async (keyword, options = {}) => {
    try {
      console.log('🔍 매장 종합 검색 API 호출:', keyword, options);
      
      const params = new URLSearchParams();
      
      // 필수 파라미터: keyword
      if (keyword) {
        params.append('keyword', keyword);
      }
      
      // 선택적 파라미터들
      if (options.category) {
        params.append('category', options.category);
      }
      if (options.tags) {
        params.append('tags', options.tags);
      }
      if (options.latitude) {
        params.append('latitude', options.latitude);
      }
      if (options.longitude) {
        params.append('longitude', options.longitude);
      }
      if (options.radius) {
        params.append('radius', options.radius);
      }
      if (options.page) {
        params.append('page', options.page);
      }
      if (options.size) {
        params.append('size', options.size);
      }
      
      const queryString = params.toString();
      const url = `/api/stores/search${queryString ? `?${queryString}` : ''}`;
      
      console.log('📡 종합 검색 API URL:', url);
      
      const response = await storeApi.get(url);
      console.log('✅ 매장 종합 검색 API 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 매장 종합 검색 실패:', error);
      throw error;
    }
  },

  // 태그 관련 API들
  getStoreTags: async (storeId) => {
    try {
      const response = await storeApi.get(`/api/stores/${storeId}/tags`);
      console.log('매장 태그 조회 API 응답:', response.data);
      
      let tags = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // { success: true, data: [...] } 형태인 경우
        tags = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        // 직접 배열인 경우
        tags = response.data;
      } else {
        console.warn('예상하지 못한 태그 응답 구조:', response.data);
        tags = [];
      }
      
      return tags;
    } catch (error) {
      console.error('태그 목록 조회 실패:', error);
      throw error;
    }
  },

  // 인기 태그 조회
  getTopClickedTags: async () => {
    try {
      const response = await storeApi.get('/api/stores/tags/top-clicked');
      return response.data;
    } catch (error) {
      console.error('인기 태그 조회 실패:', error);
      throw error;
    }
  },

  // 태그 클릭 기록
  recordTagClick: async (tagId) => {
    try {
      const response = await storeApi.post(`/api/stores/tags/${tagId}/click`);
      return response.data;
    } catch (error) {
      console.error('태그 클릭 기록 실패:', error);
      throw error;
    }
  },

  // 전체 매장 목록 조회
  getAllStores: async () => {
    try {
      const response = await storeApi.get('/api/stores/stores/all');
      return response.data;
    } catch (error) {
      console.error('전체 매장 목록 조회 실패:', error);
      throw error;
    }
  },

  // 카테고리별 매장 조회
  getStoresByCategory: async (category) => {
    try {
      console.log('카테고리별 매장 조회 API 호출:', category);
      const response = await storeApi.get(`/api/stores/stores/category/${encodeURIComponent(category)}`);
      console.log(`카테고리 "${category}" API 응답:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`카테고리 "${category}" 매장 조회 실패:`, error);
      throw error;
    }
  }
};