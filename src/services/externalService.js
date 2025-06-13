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

  // 외부 플랫폼 계정 연동
  connectPlatform: async (storeId, platform, credentials) => {
    const response = await storeApi.post(`/api/external/stores/${storeId}/connect`, {
      platform,
      ...credentials
    });
    return response.data;
  }
};