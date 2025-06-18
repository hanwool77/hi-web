import { analyticsApi } from './api';
import axios from 'axios';

export const analyticsService = {
  // 매장 분석 데이터 조회
  getStoreAnalytics: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}`);
    return response.data;
  },

  // 매장 통계 조회 (날짜 파라미터 추가)
  getStoreStatistics: async (storeId, startDate, endDate) => {
    // 기본값: 오늘부터 한달 전
    if (!startDate || !endDate) {
      const today = new Date();
      const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      
      endDate = today.toISOString().split('T')[0];
      startDate = oneMonthAgo.toISOString().split('T')[0];
    }
    
    const params = { startDate, endDate };
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/statistics`, { params });
    return response.data;
  },

  // AI 피드백 상세 조회
  getAIFeedbackDetail: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/ai-feedback`);
    return response.data;
  },

  // AI 피드백 요약 조회
  getAIFeedbackSummary: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/ai-feedback/summary`);
    return response.data;
  },

  // 리뷰 분석 조회 - days 파라미터만 추가
  getReviewAnalysis: async (storeId, days = 30) => {
    const params = { days };
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/review-analysis`, { params });
    return response.data;
  },

  // AI 분석 생성 요청 (긴 타임아웃 설정)
  generateAIAnalysis: async (storeId, request) => {
    // 런타임 설정에서 analytics 서비스 URL 가져오기
    const getServiceUrl = () => {
      const config = window.__runtime_config__ || {};
      if (config.API_GATEWAY_URL) {
        return config.API_GATEWAY_URL;
      }
      return config.ANALYTICS_SERVICE_URL || 'http://20.1.2.3:8084';
    };

    // 긴 타임아웃을 위한 별도 axios 인스턴스 생성
    const longTimeoutApi = axios.create({
      baseURL: getServiceUrl(),
      timeout: 30000, // 30초 타임아웃
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 토큰 추가
    const token = sessionStorage.getItem('token');
    if (token) {
      longTimeoutApi.defaults.headers.Authorization = `Bearer ${token}`;
    }

    const response = await longTimeoutApi.post(`/api/analytics/stores/${storeId}/ai-analysis`, request);
    return response.data;
  },

  // 실행 계획 저장
  saveActionPlan: async (data) => {
    const response = await analyticsApi.post('/api/action-plans', data);
    return response.data;
  },

  // 실행 계획 목록 조회
  getActionPlans: async (storeId) => {
    const response = await analyticsApi.get(`/api/action-plans/stores/${storeId}`);
    return response.data;
  },

  // 실행 계획 상세 조회
  getActionPlanDetail: async (planId) => {
    const response = await analyticsApi.get(`/api/action-plans/${planId}`);
    return response.data;
  },

  // 실행 계획 완료 처리
  completeActionPlan: async (planId, request = {}) => {
    const response = await analyticsApi.put(`/api/action-plans/${planId}/complete`, request);
    return response.data;
  },

  // 실행 계획 삭제 (신규 추가)
  deleteActionPlan: async (planId) => {
    const response = await analyticsApi.delete(`/api/action-plans/${planId}`);
    return response.data;
  },

  // AI 피드백 기반 실행계획 생성 (긴 타임아웃 설정)
  generateActionPlans: async (feedbackId, request) => {
    // 런타임 설정에서 analytics 서비스 URL 가져오기
    const getServiceUrl = () => {
      const config = window.__runtime_config__ || {};
      if (config.API_GATEWAY_URL) {
        return config.API_GATEWAY_URL;
      }
      return config.ANALYTICS_SERVICE_URL || 'http://20.1.2.3:8084';
    };

    // 긴 타임아웃을 위한 별도 axios 인스턴스 생성
    const longTimeoutApi = axios.create({
      baseURL: getServiceUrl(),
      timeout: 90000, // 90초 타임아웃
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 토큰 추가
    const token = sessionStorage.getItem('token');
    if (token) {
      longTimeoutApi.defaults.headers.Authorization = `Bearer ${token}`;
    }

    const response = await longTimeoutApi.post(`/api/analytics/ai-feedback/${feedbackId}/action-plans`, request);
    return response.data;
  }
};