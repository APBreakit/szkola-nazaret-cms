#!/bin/sh
set -e

echo "=== STARTING SCHOOL CMS STARTUP SCRIPT ==="
echo "Current directory: $(pwd)"
echo "Environment: DATABASE_URL is $(if [ -z "$DATABASE_URL" ]; then echo "EMPTY"; else echo "SET"; fi)"

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Pushing database schema
echo "Pushing database schema..."
npx prisma db push --accept-data-loss

# Start the application
echo "Starting Next.js..."
node server.js
