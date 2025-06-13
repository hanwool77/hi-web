import api from './api';

export const recommendService = {
  // 개인화 매장 추천
  getPersonalizedStores: async (requestData) => {
    const response = await api.post('/api/recommend/stores', requestData);
    return response.data;
  },

  // 주변 매장 추천
  getNearbyStores: async (latitude, longitude, radius = 5000, category = null, page = 0, size = 20) => {
    const response = await api.get('/api/recommend/stores/nearby', {
      params: { latitude, longitude, radius, category, page, size }
    });
    return response.data;
  },

  // 인기 매장 추천
  getPopularStores: async (category = null, page = 0, size = 20) => {
    const response = await api.get('/api/recommend/stores/popular', {
      params: { category, page, size }
    });
    return response.data;
  }
};
