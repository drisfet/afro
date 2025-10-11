#!/bin/bash

echo "Stopping development servers..."

# Find and kill processes using ports 9000 (backend) and 8000 (frontend)
lsof -ti:9000 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# A more general approach to kill the specific npm dev processes if the ports change
pkill -f "npm run dev"

echo "All development servers stopped."
