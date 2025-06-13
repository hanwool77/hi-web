#!/bin/bash

# AKS 클러스터에 프론트엔드 배포 스크립트 (Docker Build & Push 포함)

set -e

# 변수 설정
NAMESPACE="ns-hiorder"
RESOURCE_GROUP="rg-digitalgarage-03"
CLUSTER_NAME="aks-digitalgarage-03"
ACR_NAME="acrdigitalgarage03"
IMAGE_NAME="hiorder/frontend"

# 타임스탬프 생성
TIMESTAMP=$(date +'%y%m%d%H%M')

echo "🚀 Starting Frontend deployment to AKS with Docker build..."

# Azure CLI 로그인 확인
echo "📋 Checking Azure CLI login..."
az account show > /dev/null || { echo "❌ Please login to Azure CLI first!"; exit 1; }

# ACR 로그인
echo "🔐 Logging into Azure Container Registry..."
az acr login --name $ACR_NAME

# Docker 이미지 빌드
echo "🔨 Building Docker image..."
docker build -t $ACR_NAME.azurecr.io/$IMAGE_NAME:$TIMESTAMP -f deployment/container/Dockerfile .
docker tag $ACR_NAME.azurecr.io/$IMAGE_NAME:$TIMESTAMP $ACR_NAME.azurecr.io/$IMAGE_NAME:latest

# Docker 이미지 푸시
echo "📤 Pushing Docker image to ACR..."
docker push $ACR_NAME.azurecr.io/$IMAGE_NAME:$TIMESTAMP
docker push $ACR_NAME.azurecr.io/$IMAGE_NAME:latest

echo "✅ Docker image pushed successfully!"
echo "📦 Image: $ACR_NAME.azurecr.io/$IMAGE_NAME:$TIMESTAMP"

# AKS 클러스터 연결
echo "🔗 Connecting to AKS cluster..."
az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --overwrite-existing

# 네임스페이스 생성
echo "📦 Creating namespace if not exists..."
kubectl apply -f deployment/kubernetes/namespace.yaml

# ConfigMap 적용
echo "⚙️ Applying ConfigMap..."
kubectl apply -f deployment/kubernetes/configmap.yaml

# Deployment YAML에서 이미지 태그 업데이트 (최신 타임스탬프 사용)
echo "🔄 Updating deployment image tag..."
sed "s|image: $ACR_NAME.azurecr.io/$IMAGE_NAME:latest|image: $ACR_NAME.azurecr.io/$IMAGE_NAME:$TIMESTAMP|g" deployment/kubernetes/deployment.yaml > deployment/kubernetes/deployment-temp.yaml

# Deployment 적용 (업데이트된 이미지 태그 사용)
echo "🚀 Applying Deployment with new image..."
kubectl apply -f deployment/kubernetes/deployment-temp.yaml

# 임시 파일 삭제
rm deployment/kubernetes/deployment-temp.yaml

# Service 적용
echo "🌐 Applying Service..."
kubectl apply -f deployment/kubernetes/service.yaml

# 배포 상태 확인
echo "📊 Checking deployment status..."
kubectl rollout status deployment/frontend-deployment -n $NAMESPACE --timeout=600s

# 기존 pods 종료 대기
echo "⏳ Waiting for old pods to terminate..."
sleep 30

# Pod 상태 확인
echo "📋 Current Pod status:"
kubectl get pods -n $NAMESPACE -l app=frontend

# External IP 확인 (LoadBalancer 타입이므로)
echo "🌐 Waiting for External IP..."
echo "⏳ This may take a few minutes..."

# External IP가 할당될 때까지 대기
EXTERNAL_IP=""
for i in {1..30}; do
  EXTERNAL_IP=$(kubectl get svc frontend-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
  if [ ! -z "$EXTERNAL_IP" ] && [ "$EXTERNAL_IP" != "null" ]; then
    echo "✅ External IP assigned: $EXTERNAL_IP"
    break
  fi
  echo "⏳ Waiting for External IP... (attempt $i/30)"
  sleep 10
done

if [ -z "$EXTERNAL_IP" ] || [ "$EXTERNAL_IP" == "null" ]; then
  echo "⚠️ External IP not assigned yet. Check the service status manually."
  echo "   kubectl get svc frontend-service -n $NAMESPACE"
else
  echo "🎉 Frontend is now accessible at: http://$EXTERNAL_IP"
fi

# 서비스 정보 출력
echo "📋 Service information:"
kubectl get svc frontend-service -n $NAMESPACE

# Pod 상태 최종 확인
echo "📋 Final Pod status:"
kubectl get pods -n $NAMESPACE -l app=frontend

echo "✅ Frontend deployment completed successfully!"
echo ""
echo "📋 Deployed image: $ACR_NAME.azurecr.io/$IMAGE_NAME:$TIMESTAMP"
echo "📋 Quick commands for monitoring:"
echo "   kubectl get pods -n $NAMESPACE -l app=frontend"
echo "   kubectl get svc frontend-service -n $NAMESPACE"
echo "   kubectl logs -f deployment/frontend-deployment -n $NAMESPACE"
echo ""
echo "🔄 To rollback if needed:"
echo "   ./deployment/scripts/rollback.sh"