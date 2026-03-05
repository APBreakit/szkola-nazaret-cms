#!/bin/sh
set -e

# Run migrations/db push if DATABASE_URL is present
if [ -n "$DATABASE_URL" ]; then
  echo "Prisma DATABASE_URL is set. Testing connection and pushing schema..."
  npx prisma db push --accept-data-loss || echo "Prisma db push FAILED. Proceeding to startup anyway..."
fi

# Start the application
echo "Starting Next.js..."
node server.js
