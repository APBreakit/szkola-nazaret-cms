#!/bin/sh

echo "=== STARTING SCHOOL CMS STARTUP SCRIPT ==="
echo "Current directory: $(pwd)"
echo "Environment: DATABASE_URL is $(if [ -z "$DATABASE_URL" ]; then echo "EMPTY"; else echo "SET"; fi)"

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate || echo "Prisma generate failed, continuing..."

# Pushing database schema
echo "Pushing database schema..."
npx prisma db push --accept-data-loss || echo "Prisma db push failed, continuing..."

# Seeding initial data
echo "Seeding initial data..."
npx tsx prisma/seed.ts || echo "Prisma seed failed, continuing..."

# Start the application
echo "Starting Next.js..."
node server.js || echo "Next.js server failed to start! Keeping container alive for debugging..."

# Keep container alive if node server.js fails
sleep 3600
