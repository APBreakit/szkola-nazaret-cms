#!/bin/sh
set -e

# Run migrations/db push if DATABASE_URL is present
if [ -n "$DATABASE_URL" ]; then
  echo "Prisma DATABASE_URL detected. Synchronizing database..."
  npx prisma db push --accept-data-loss || echo "Prisma sync failed, checking if DB is reachable..."
fi

# Start the application
echo "Starting Next.js..."
node server.js
