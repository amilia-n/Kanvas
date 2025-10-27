#!/bin/bash

# Test script that orchestrates the complete testing pipeline
set -e

echo "🧪 Starting Express App Test Pipeline"

# Cleanup function - turn down the test containers and clean up their files
cleanup() {
    echo "🧹 Cleaning up test containers..."
    docker-compose -f docker-compose.test.yml down -v --remove-orphans 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
    echo "✅ Cleanup complete"
}

# trap will make sure that cleanup always runs regardless of if the test fails or succeeds
trap cleanup EXIT

echo "📦 Building test containers..."
docker-compose -f docker-compose.test.yml build

echo "🗄️ Starting test database..."
docker-compose -f docker-compose.test.yml up -d test-db

echo "⏳ Waiting for test database to be ready..."
docker-compose -f docker-compose.test.yml exec -T test-db sh -c 'until pg_isready -U postgres -d kanvas_test; do sleep 1; done'

echo "🌱 Initializing and seeding test database..."
docker-compose -f docker-compose.test.yml run --rm test-runner sh -c "node ./src/db/init.js && node ./src/db/seed.js"

echo "🚀 Running tests..."
docker-compose -f docker-compose.test.yml run --rm test-runner

echo "🎉 All tests completed successfully!"