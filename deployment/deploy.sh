#!/bin/bash

# AKS 클러스터에 프론트엔드 배포 스크립트

set -e

# 변수 설정
NAMESPACE="ns-hiorder"
RESOURCE_GROUP="rg-digitalgarage-03"
CLUSTER_NAME="aks-digitalgarage-03"
ACR_NAME="acrdigitalgarage03"

echo "🚀 Starting Frontend deployment to AKS..."

# Azure CLI 로그인 확인
echo "📋 Checking Azure CLI login..."
az account show > /dev/null || { echo "❌ Please login to Azure CLI first!"; exit 1; }

# AKS 클러스터 연결
echo "🔗 Connecting to AKS cluster..."
az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --overwrite-existing

# 네임스페이스 생성
echo "📦 Creating namespace if not exists..."
kubectl apply -f deployment/kubernetes/namespace.yaml

# ConfigMap 적용
echo "⚙️ Applying ConfigMap..."
kubectl apply -f deployment/kubernetes/configmap.yaml

# Deployment 적용
echo "🚀 Applying Deployment..."
kubectl apply -f deployment/kubernetes/deployment.yaml

# Service 적용
echo "🌐 Applying Service..."
kubectl apply -f deployment/kubernetes/service.yaml

# 배포 상태 확인
echo "📊 Checking deployment status..."
kubectl rollout status deployment/frontend-deployment -n $NAMESPACE --timeout=300s

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
else
  echo "🎉 Frontend is now accessible at: http://$EXTERNAL_IP"
fi

# 서비스 정보 출력
echo "📋 Service information:"
kubectl get svc frontend-service -n $NAMESPACE

# Pod 상태 확인
echo "📋 Pod status:"
kubectl get pods -n $NAMESPACE -l app=frontend

echo "✅ Frontend deployment completed successfully!"
echo ""
echo "📋 Quick commands for monitoring:"
echo "   kubectl get pods -n $NAMESPACE -l app=frontend"
echo "   kubectl get svc frontend-service -n $NAMESPACE"
echo "   kubectl logs -f deployment/frontend-deployment -n $NAMESPACE"