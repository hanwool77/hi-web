# 리뷰 기반 AI 피드백 시스템 🍽️

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.java.net/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Azure](https://img.shields.io/badge/Azure-Cloud-blue.svg)](https://azure.microsoft.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.30-blue?logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Docker-25.0-blue?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)


## 📖 프로젝트 개요

**하이소피 리뷰 피드백 시스템**은 소상공인을 위한 AI 기반 고객 피드백 관리 솔루션입니다. 다양한 플랫폼의 리뷰를 자동 수집·분석하고, AI가 생성한 맞춤형 실행계획을 통해 매장 운영 개선을 지원합니다.

### 🎯 핵심 기능
- **AI 피드백 마스터**: 피드백 분석 결과를 비용, 효과, 우선순위를 고려한 단계별 실행 계획으로 변환
- **멀티플랫폼 리뷰 통합관리**: 하이오더, 네이버, 카카오 등 주요 플랫폼 리뷰 자동 수집·통합
- **리뷰 시각화**: 고객 리뷰를 시각화하여 객관적 분석 지원

### 🌀 MVP 산출물
- 발표자료:
- Git Repo: 
  - 프론트엔드: https://gitea.cbiz.kubepia.net/dg04-hi/hi-web.git
  - 벡엔드: https://gitea.cbiz.kubepia.net/dg04-hi/hi-backend.git
  - manifest: https://gitea.cbiz.kubepia.net/dg04-hi/hi-manifest.git
- 시연 동영상:



## 🏗️ 시스템 아키텍처

### 물리아키텍쳐
![image](image/image.png)


### 마이크로서비스 구조
![image](image/마이크로서비스아키텍쳐.png)

### CI/CD 파이프라인

![iamge2](image/CICD_파이프라인.png)

### 기술 스택

#### 백엔드
- **Framework**: Spring Boot 3.4.0, Java 21
- **Architecture**: Clean Architecture (Hexagonal)
- **Database**: Azure PostgreSQL (서비스별 독립 DB)
- **Cache**: Azure Redis Cache
- **Messaging**: Azure Event Hub
- **AI Services**: OpenAI GPT, Claude AI, Azure Cognitive Services

#### 프론트엔드
- **Framework**: React 18+, Material-UI
- **State Management**: React Hooks
- **Deployment**: Azure Static Web Apps

#### 인프라 (Azure Cloud)
- **Container**: Azure Kubernetes Service (AKS)
- **Ingress**: Nginx Ingress Controller
- **Messaging**: Azure Event Hub (외부 리뷰 수집)
- **Storage**: Azure Blob Storage
- **CI/CD**: Git Action, ArgoCD

## 🚀 주요 기능

### 👥 고객 기능 
- **취향 기반 음식점 추천**: AI가 분석한 개인 취향과 위치 기반 맞춤 추천
- **영수증 리뷰 작성**: 영수증 인증을 통한 신뢰성 있는 리뷰 시스템
- **리뷰 반응 및 댓글**: 다른 고객과의 소통을 통한 커뮤니티 형성
- **태그 기반 매장 필터링**: 알레르기, 비건, 반려동물 동반 등 세부 조건 검색

### 🏪 점주 기능
- **AI 피드백 분석**: 리뷰 감정분석, 키워드 추출, 개선점 도출
- **실행계획 수립**: 단기/중기/장기 개선 계획 자동 생성 및 관리
- **멀티플랫폼 리뷰 통합**: Event Hub를 통한 네이버, 카카오, 구글 리뷰 자동 수집
- **매장 운영 분석**: 시간대별 주문 통계, 고객 연령대/성별 분석
- **리뷰 댓글 관리**: 고객 리뷰에 대한 사장님 답변 기능

### 🤖 AI 기능
- **감정 분석**: 리뷰의 긍정/부정/중립 감정 자동 분류
- **키워드 추출**: 맛, 서비스, 분위기 등 카테고리별 핵심 키워드 추출
- **개선 제안**: 비용 대비 효과를 고려한 구체적 개선 방안 제시
- **트렌드 분석**: 업종별, 지역별 트렌드 분석 및 벤치마킹

## 📁 프로젝트 구조

```
hiorder-feedback-system/
├── backend/                          # 백엔드 마이크로서비스
│   ├── member-service/               # 회원관리 서비스
│   ├── store-service/               # 매장운영 서비스
│   ├── review-service/              # 리뷰관리 서비스
│   ├── analytics-service/           # AI분석 서비스
│   ├── recommend-service/           # 추천 서비스
│   └── common/                      # 공통 라이브러리
├── infrastructure/                  # Kubernetes 배포 설정
│   ├── k8s/                        # Kubernetes manifests
└── docs/                           # 프로젝트 문서
    ├── api/                        # API 문서
    ├── architecture/               # 아키텍처 설계서
    └── deployment/                 # 배포 가이드
```

## 🛠️ 로컬 개발 환경 설정

### 사전 요구사항
- Java 21+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 6+

### 백엔드 실행

1. **저장소 클론**
```bash
git clone https://github.com/dg04-hi/hi-backend.git
```

2. **환경변수 설정**
```bash
# .env 파일 생성
cp .env.example .env

# 필수 환경변수 설정
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_DB=hiorder
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=password
export REDIS_HOST=localhost
export REDIS_PORT=6379
export OPENAI_API_KEY=your_openai_api_key
export AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection
export AZURE_EVENTHUB_CONNECTION_STRING=your_eventhub_connection
```

3. **의존성 설치 및 빌드**
```bash
./gradlew clean build
```

4. **Redis 초기화**
```bash
docker-compose up -d postgres redis
```

5. **서비스 실행**
```bash
# 모든 서비스 동시 실행
./gradlew bootRun --parallel

# 개별 서비스 실행
./gradlew :member-service:bootRun
./gradlew :store-service:bootRun
./gradlew :review-service:bootRun
./gradlew :analytics-service:bootRun
./gradlew :recommend-service:bootRun
```

### 프론트엔드 실행

1. **저장소 클론**
```bash
git clone https://github.com/dg04-hi/hi-backend.git
```

2. **의존성 설치**
```bash
npm install react-scripts
```
3. **개발 서버 실행**
```bash
npm start
```

## 🐳 Docker 실행

### Docker Compose로 전체 시스템 실행

1. **Docker Compose 설정**
```bash
cd docker
cp .env.example .env
# 환경변수 설정 후
```

2. **전체 시스템 실행**
```bash
docker-compose up -d
```

3. **서비스 접근**
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui.html

## ☁️ Azure 클라우드 배포

### 사전 준비

1. **Azure CLI 설치 및 로그인**
```bash
az login
az account set --subscription "your-subscription-id"
```

2. **리소스 그룹 생성**
```bash
az group create --name hiorder-feedback-rg --location koreacentral
```

### AKS 클러스터 배포

1. **AKS 클러스터 생성**
```bash
az aks create \
  --resource-group hiorder-feedback-rg \
  --name myAKSCluster \
  --node-count 1 \
  --generate-ssh-keys

```

2. **kubectl 설정**
```bash
az aks get-credentials --resource-group hiorder-feedback-rg --name hiorder-aks
```

3. **애플리케이션 배포**
```bash
cd ../k8s
kubectl apply -f namespace.yaml
kubectl apply -f configmap/
kubectl apply -f secrets/
kubectl apply -f deployments/
kubectl apply -f services/
kubectl apply -f ingress/
```

## 📊 API 문서

### Swagger UI 접근
- 로컬: http://localhost:8080/swagger-ui.html

### Ingress 라우팅 구조
```
도메인/경로                     → 서비스
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/                             → Frontend (React SPA)
/api/auth/*                   → Member Service
/api/members/*                → Member Service
/api/stores/*                 → Store Service
/api/reviews/*                → Review Service
/api/analytics/*              → Analytics Service
/api/recommend/*              → Recommend Service
```

### 외부 리뷰 수집 아키텍처

![image](image/외뷰리뷰수집아키텍쳐.png)

### 주요 API 엔드포인트

#### 인증 API
```
POST /api/auth/login          # 로그인
POST /api/auth/logout         # 로그아웃
POST /api/members/register    # 회원가입
POST /api/auth/refresh        # 토큰 갱신
```

#### 매장 관리 API
```
GET    /api/stores/my         # 내 매장 목록
POST   /api/stores           # 매장 등록
PUT    /api/stores/{id}      # 매장 수정
DELETE /api/stores/{id}      # 매장 삭제
```

#### 리뷰 관리 API
```
GET    /api/reviews/stores/{storeId}  # 매장 리뷰 조회
POST   /api/reviews                  # 리뷰 작성
PUT    /api/reviews/{id}             # 리뷰 수정
DELETE /api/reviews/{id}             # 리뷰 삭제
POST   /api/reviews/{id}/reactions   # 리뷰 반응
```

#### AI 분석 API
```
GET /api/analytics/stores/{storeId}           # 매장 분석 정보
GET /api/analytics/stores/{storeId}/feedback  # AI 피드백
GET /api/action-plans/stores/{storeId}        # 실행계획 목록
POST /api/action-plans                        # 실행계획 저장
```


## 📝 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.

## 👥 팀 소개

### 개발팀
- PO - 조익현
- 스크럼마스터 - 정하늘
- ui/ux 기획자 - 조익현, 조하늘, 전한울
- 컨텐츠 기획자 - 조익현, 조하늘, 전한울
- 프론트앤드 개발자 - 조익현, 조하늘, 전한울
- 백앤드 개발자 - 정유빈, 김규형, 이상현
- CI/CD - 정유빈, 김규형, 이상현
- TA - 정유빈, 김규형, 이상현
- QA - 정유빈, 김규형, 이상현
