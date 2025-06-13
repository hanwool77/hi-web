# 환경 변수를 runtime-env.js에 주입
cat <<EOF > /usr/share/nginx/html/runtime-env.js
window.__runtime_config__ = {
  // Backend Services (External IP 사용)
  AUTH_SERVICE_URL: '${AUTH_SERVICE_URL:-http://20.1.2.3:8081}',
  MEMBER_SERVICE_URL: '${MEMBER_SERVICE_URL:-http://20.1.2.3:8081}',
  STORE_SERVICE_URL: '${STORE_SERVICE_URL:-http://20.1.2.3:8082}',
  REVIEW_SERVICE_URL: '${REVIEW_SERVICE_URL:-http://20.1.2.3:8083}',
  ANALYTICS_SERVICE_URL: '${ANALYTICS_SERVICE_URL:-http://20.1.2.3:8084}',
  RECOMMEND_SERVICE_URL: '${RECOMMEND_SERVICE_URL:-http://20.1.2.3:8085}',
  
  // API Gateway (Ingress Host 사용)
  API_GATEWAY_URL: '${API_GATEWAY_URL:-http://hiorder.example.com}',
  
  // 앱 설정
  APP_VERSION: '${APP_VERSION:-1.0.0}',
  ENVIRONMENT: '${ENVIRONMENT:-production}'
};
EOF

# nginx 시작
nginx -g 'daemon off;'