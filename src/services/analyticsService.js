//* src/services/analyticsService.js
import { analyticsApi } from './api';

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

  // 리뷰 분석 조회
  getReviewAnalysis: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/review-analysis`);
    return response.data;
  },

  // AI 분석 생성 요청
  generateAIAnalysis: async (storeId, request) => {
    const response = await analyticsApi.post(`/api/analytics/stores/${storeId}/ai-analysis`, request);
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
  }
};