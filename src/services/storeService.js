import { storeApi } from './api';

export const storeService = {
  // 매장 목록 조회
  getStores: async (params = {}) => {
    const response = await storeApi.get('/api/stores', { params });
    return response.data;
  },

  // 매장 상세 조회
  getStoreDetail: async (storeId) => {
    const response = await storeApi.get(`/api/stores/${storeId}`);
    return response.data;
  },

  // 매장 등록
  createStore: async (storeData) => {
    const response = await storeApi.post('/api/stores', storeData);
    return response.data;
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

  // 점주 매장 목록
  getOwnerStores: async () => {
    const response = await storeApi.get('/api/stores/owner');
    return response.data;
  }
};