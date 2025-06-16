//* src/services/analyticsService.js
import { analyticsApi } from './api';

export const analyticsService = {
  // 매장 분석 데이터 조회
  getStoreAnalytics: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}`);
    return response.data;
  },

  // 매장 통계 조회 (새로 추가)
  getStoreStatistics: async (storeId, startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/statistics`, { params });
    return response.data;
  },

  // AI 피드백 상세 조회 (새로 추가)
  getAIFeedbackDetail: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/ai-feedback`);
    return response.data;
  },

  // AI 피드백 요약 조회 (새로 추가)
  getAIFeedbackSummary: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/feedback/summary`);
    return response.data;
  },

  // 리뷰 분석 조회 (새로 추가)
  getReviewAnalytics: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/analysis`);
    return response.data;
  },

  // AI 분석 생성 요청 (새로 추가)
  generateAIAnalysis: async (storeId, request) => {
    const response = await analyticsApi.post(`/api/analytics/stores/${storeId}/ai-analysis`, request);
    return response.data;
  },

  // AI 피드백 조회 - 기존 메서드 (호환성을 위해 유지)
  getAIFeedback: async (storeId, days = 30) => {
    const response = await analyticsApi.post(`/api/analytics/stores/${storeId}/ai-analysis`, {
      days: days,
      generateActionPlan: true
    });
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

  // 매장 주문 데이터 분석
  getOrderAnalytics: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/orders`);
    return response.data;
  }
};