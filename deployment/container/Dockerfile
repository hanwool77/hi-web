# deployment/container/Dockerfile (entrypoint.sh 방식 - 가장 안전)
FROM node:18-alpine AS builder

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (npm install 사용)
RUN rm -f package-lock.json && npm install

# 소스 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# Production 단계
FROM nginx:alpine

# nginx 설정 파일 복사
COPY deployment/container/nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일 복사
COPY --from=builder /app/build /usr/share/nginx/html

# entrypoint 스크립트 생성 (Dockerfile 내에서 직접 생성)
RUN cat <<'EOF' > /docker-entrypoint.sh
#!/bin/sh
set -e

echo "🚀 Starting HiOrder Frontend..."
echo "📋 Generating runtime-env.js with current environment variables..."

# 환경 변수를 runtime-env.js에 주입
cat <<JSEOF > /usr/share/nginx/html/runtime-env.js
window.__runtime_config__ = {
  AUTH_SERVICE_URL: '${AUTH_SERVICE_URL:-http://20.1.2.3/auth}',
  MEMBER_SERVICE_URL: '${MEMBER_SERVICE_URL:-http://20.1.2.3/member}',
  STORE_SERVICE_URL: '${STORE_SERVICE_URL:-http://20.1.2.3/store}', 
  REVIEW_SERVICE_URL: '${REVIEW_SERVICE_URL:-http://20.1.2.3/review}',
  ANALYTICS_SERVICE_URL: '${ANALYTICS_SERVICE_URL:-http://20.1.2.3/analytics}',
  RECOMMEND_SERVICE_URL: '${RECOMMEND_SERVICE_URL:-http://20.1.2.3/recommend}'
};
JSEOF

echo "✅ runtime-env.js generated successfully"
echo "📄 Content:"
cat /usr/share/nginx/html/runtime-env.js

echo "🌐 Starting nginx..."
exec nginx -g 'daemon off;'
EOF

# 실행 권한 부여
RUN chmod +x /docker-entrypoint.sh

# 포트 노출
EXPOSE 80

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# entrypoint 설정
ENTRYPOINT ["/docker-entrypoint.sh"]