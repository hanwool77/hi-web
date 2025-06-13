FROM node:18-alpine AS builder

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 전체 의존성 설치 (개발 의존성 포함)
RUN npm install

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

# 런타임 환경 설정 스크립트 복사
COPY deployment/container/runtime-env.sh /usr/local/bin/runtime-env.sh
RUN chmod +x /usr/local/bin/runtime-env.sh

# 포트 노출
EXPOSE 80

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# 실행
CMD ["/usr/local/bin/runtime-env.sh"]