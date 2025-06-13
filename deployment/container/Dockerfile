# deployment/container/Dockerfile (간단한 해결책)
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

# 포트 노출
EXPOSE 80

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# 간단한 CMD 방식 - 환경변수 주입 후 nginx 실행
CMD sh -c 'echo "window.__runtime_config__ = { \
  AUTH_SERVICE_URL: \"${AUTH_SERVICE_URL:-http://20.1.2.3/auth}\", \
  MEMBER_SERVICE_URL: \"${MEMBER_SERVICE_URL:-http://20.1.2.3/member}\", \
  STORE_SERVICE_URL: \"${STORE_SERVICE_URL:-http://20.1.2.3/store}\", \
  REVIEW_SERVICE_URL: \"${REVIEW_SERVICE_URL:-http://20.1.2.3/review}\", \
  ANALYTICS_SERVICE_URL: \"${ANALYTICS_SERVICE_URL:-http://20.1.2.3/analytics}\", \
  RECOMMEND_SERVICE_URL: \"${RECOMMEND_SERVICE_URL:-http://20.1.2.3/recommend}\" \
};" > /usr/share/nginx/html/runtime-env.js && \
echo "✅ runtime-env.js generated:" && \
cat /usr/share/nginx/html/runtime-env.js && \
nginx -g "daemon off;"'