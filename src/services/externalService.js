//* src/services/externalService.js
import { storeApi } from './api';

export const externalService = {
  // 외부 플랫폼 리뷰 동기화
  syncReviews: async (storeId, platform, externalStoreId) => {
    const response = await storeApi.post(`/api/external/stores/${storeId}/sync-reviews`, {
      platform,
      externalStoreId
    });
    return response.data;
  },

  // 모든 연동된 플랫폼 리뷰 동기화
  syncAllReviews: async (storeId) => {
    const response = await storeApi.post(`/api/external/stores/${storeId}/sync-all-reviews`);
    return response.data;
  },

  // 외부 플랫폼 계정 연동
  connectPlatform: async (storeId, platform, credentials) => {
    const response = await storeApi.post(`/api/external/stores/${storeId}/connect`, {
      platform,
      ...credentials
    });
    return response.data;
  },

  // 외부 플랫폼 연동 해제
  disconnectPlatform: async (storeId, platformId) => {
    const response = await storeApi.delete(`/api/external/stores/${storeId}/disconnect/${platformId}`);
    return response.data;
  },

  // 플랫폼 연동 상태 조회
  getPlatformStatus: async (storeId) => {
    const response = await storeApi.get(`/api/external/stores/${storeId}/platforms`);
    return response.data;
  }
};