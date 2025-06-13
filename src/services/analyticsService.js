import { analyticsApi } from './api';

export const analyticsService = {
  // 매장 분석 데이터 조회
  getStoreAnalytics: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}`);
    return response.data;
  },

  // AI 피드백 상세 조회
  getAIFeedbackDetail: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/ai-feedback`);
    return response.data;
  },

  // 매장 통계 조회
  getStoreStatistics: async (storeId, startDate, endDate) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/statistics`, {
      params: { startDate, endDate }
    });
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

  // 실행 계획 저장
  saveActionPlan: async (data) => {
    const response = await analyticsApi.post('/api/action-plans', data);
    return response.data;
  }
};