#!/bin/sh

# 환경 변수를 runtime-env.js에 주입 (hi-web 스타일)
cat <<EOF > /usr/share/nginx/html/runtime-env.js
window.__runtime_config__ = {
  AUTH_URL: '${AUTH_SERVICE_URL:-http://20.1.2.3/auth}',
  MEMBER_URL: '${MEMBER_SERVICE_URL:-http://20.1.2.3/member}',
  STORE_URL: '${STORE_SERVICE_URL:-http://20.1.2.3/store}', 
  REVIEW_URL: '${REVIEW_SERVICE_URL:-http://20.1.2.3/review}',
  ANALYTICS_URL: '${ANALYTICS_SERVICE_URL:-http://20.1.2.3/analytics}',
  RECOMMEND_URL: '${RECOMMEND_SERVICE_URL:-http://20.1.2.3/recommend}'
};
EOF

# nginx 시작
nginx -g 'daemon off;'