#!/bin/bash
# Load environment variables from .env.local
set -a
source /app/.env.local 2>/dev/null || true
set +a

# Start Next.js
exec yarn start
