//* src/services/externalService.js
import { storeApi } from './api';
import axios from 'axios';

// 외부 플랫폼 동기화를 위한 긴 타임아웃 API 인스턴스 생성
const createLongTimeoutApi = () => {
  // 런타임 설정에서 store 서비스 URL 가져오기
  const getServiceUrl = () => {
    const config = window.__runtime_config__ || {};
    if (config.API_GATEWAY_URL) {
      return config.API_GATEWAY_URL;
    }
    return config.STORE_SERVICE_URL || 'http://20.1.2.3:8082';
  };

  const api = axios.create({
    baseURL: getServiceUrl(),
    timeout: 30000, // 30초 타임아웃
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 토큰 추가
  api.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('memberId');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('selectedStoreId');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const externalService = {
  // 외부 플랫폼 리뷰 동기화 (30초 타임아웃)
  syncReviews: async (storeId, platform, externalStoreId) => {
    const longTimeoutApi = createLongTimeoutApi();
    const response = await longTimeoutApi.post(`/api/external/stores/${storeId}/sync-reviews`, {
      platform,
      externalStoreId
    });
    return response.data;
  },

  // 모든 연동된 플랫폼 리뷰 동기화 (30초 타임아웃)
  syncAllReviews: async (storeId) => {
    const longTimeoutApi = createLongTimeoutApi();
    const response = await longTimeoutApi.post(`/api/external/stores/${storeId}/sync-all-reviews`);
    return response.data;
  },

  // 외부 플랫폼 계정 연동 (기본 타임아웃 사용)
  connectPlatform: async (storeId, platform, credentials) => {
    const response = await storeApi.post(`/api/external/stores/${storeId}/connect`, {
      platform,
      ...credentials
    });
    return response.data;
  },

  // 외부 플랫폼 연동 해제 (기본 타임아웃 사용)
  disconnectPlatform: async (storeId, platformId) => {
    const response = await storeApi.delete(`/api/external/stores/${storeId}/disconnect/${platformId}`);
    return response.data;
  },

  // 플랫폼 연동 상태 조회 (기본 타임아웃 사용)
  getPlatformStatus: async (storeId) => {
    const response = await storeApi.get(`/api/external/stores/${storeId}/platforms`);
    return response.data;
  }
};