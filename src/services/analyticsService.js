//* src/services/analyticsService.js - API 엔드포인트 수정
import { analyticsApi } from './api';

export const analyticsService = {
  // 매장 분석 데이터 조회
  getStoreAnalytics: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}`);
    return response.data;
  },

  // AI 피드백 조회 - API 엔드포인트 변경: GET → POST, URL 변경
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

  // 매장 리뷰 분석
  getReviewAnalytics: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/reviews`);
    return response.data;
  },

  // 매장 주문 데이터 분석
  getOrderAnalytics: async (storeId) => {
    const response = await analyticsApi.get(`/api/analytics/stores/${storeId}/orders`);
    return response.data;
  }
};