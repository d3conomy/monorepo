#!/bin/bash

# Deploy Moonbase and Airlock to Kubernetes
set -e

echo "🚀 Deploying Moonbase and Airlock..."

# Build Docker images
echo "📦 Building Docker images..."
cd moonbase
docker build -t moonbase:latest .
cd ../airlock/airlock-ts
docker build -t airlock:latest .
cd ../..

# Deploy with Helm
echo "⛵ Deploying with Helm..."

# Deploy Moonbase
helm upgrade --install moonbase helm/moonbase --namespace moonbase --create-namespace

# Deploy Airlock
helm upgrade --install airlock helm/airlock --namespace airlock --create-namespace

echo "✅ Deployment complete!"
echo ""
echo "📡 Moonbase API: kubectl port-forward -n moonbase svc/moonbase 4343:4343"
echo "🔐 Airlock API: kubectl port-forward -n airlock svc/airlock 4343:4343"
echo ""
echo "🔍 Check status:"
echo "   kubectl get pods -n moonbase"
echo "   kubectl get pods -n airlock"
