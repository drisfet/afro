#!/bin/bash

# Exit script on error
set -e

# Start the backend server
echo "Starting Medusa backend server on port 9000..."
cd /workspaces/afro/afro-store
npm run dev &
BACKEND_PID=$!

# Wait for backend to be ready with a simple health check
echo "Waiting for backend to be ready..."
while ! curl -s http://localhost:9000/health | grep -q "OK"; do
    echo "Backend not ready yet. Waiting..."
    sleep 5
done

echo "Backend is ready!"
echo "Admin URL: https://${CODESPACE_NAME}-9000.app.github.dev/app"

# Start the frontend server
echo "Starting Next.js storefront on port 8000..."
cd /workspaces/afro/afro-store-storefront
npm run dev &
FRONTEND_PID=$!

# Wait for both processes to complete
wait $BACKEND_PID
wait $FRONTEND_PID
