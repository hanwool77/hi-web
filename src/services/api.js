import axios from 'axios';

// 런타임 설정에서 각 서비스 URL 가져오기
const getServiceUrl = (serviceName) => {
  const config = window.__runtime_config__ || {};
  
  // API Gateway를 사용하는 경우
  if (config.API_GATEWAY_URL) {
    return config.API_GATEWAY_URL;
  }
  
  // 각 서비스별 URL 사용
  switch (serviceName) {
    case 'auth':
    case 'member':
      return config.AUTH_SERVICE_URL || config.MEMBER_SERVICE_URL || 'http://20.1.2.3:8081';
    case 'store':
      return config.STORE_SERVICE_URL || 'http://20.1.2.3:8082';
    case 'review':
      return config.REVIEW_SERVICE_URL || 'http://20.1.2.3:8083';
    case 'analytics':
      return config.ANALYTICS_SERVICE_URL || 'http://20.1.2.3:8084';
    case 'recommend':
      return config.RECOMMEND_SERVICE_URL || 'http://20.1.2.3:8085';
    default:
      return config.API_GATEWAY_URL || 'http://20.1.2.3:8080';
  }
};

// 각 서비스별 axios 인스턴스 생성
const createServiceApi = (serviceName) => {
  const api = axios.create({
    baseURL: getServiceUrl(serviceName),
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터 - 토큰 추가
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 - 에러 처리
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // 토큰 만료 시 로그아웃
        localStorage.removeItem('token');
        localStorage.removeItem('memberId');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return api;
};

// 각 서비스별 API 인스턴스
export const authApi = createServiceApi('auth');
export const memberApi = createServiceApi('member');
export const storeApi = createServiceApi('store');
export const reviewApi = createServiceApi('review');
export const analyticsApi = createServiceApi('analytics');
export const recommendApi = createServiceApi('recommend');

// 기본 API (하위 호환성)
export default authApi;