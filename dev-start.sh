#!/bin/bash

# Local development startup script
set -e

echo "🌙 Starting Moonbase Development Environment"

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up..."
    pkill -f "moonbase" || true
    pkill -f "airlock" || true
    docker-compose down || true
}

trap cleanup EXIT

# Build artifacts-ts
echo "📦 Building artifacts-ts..."
cd artifacts-ts
npm install
npm run build
cd ..

# Build and start Moonbase
echo "🚀 Building and starting Moonbase..."
cd moonbase
npm install
npm run build

# Start Moonbase in background
echo "🌙 Starting Moonbase on port 4343..."
node server.js &
MOONBASE_PID=$!

cd ..

# Build Airlock
echo "🔐 Building Airlock..."
cd airlock/airlock-ts
npm install
npm run build
cd ../..

# Start Airlock React frontend
echo "⚛️  Starting Airlock React frontend..."
cd airlock/airlock-react
npm install
npm start &
AIRLOCK_PID=$!

cd ../..

echo ""
echo "✅ Development environment started!"
echo ""
echo "🌙 Moonbase API: http://localhost:4343"
echo "⚛️  Airlock React: http://localhost:3000"
echo ""
echo "🔍 Health checks:"
echo "   curl http://localhost:4343/"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
