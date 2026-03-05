#!/bin/sh

echo "=== STARTING SCHOOL CMS STARTUP SCRIPT ==="
echo "Current directory: $(pwd)"
echo "Environment: DATABASE_URL is $(if [ -z "$DATABASE_URL" ]; then echo "EMPTY"; else echo "SET"; fi)"

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Pushing database schema
echo "Pushing database schema..."
npx prisma db push --accept-data-loss || echo "Prisma db push failed, continuing anyway..."

# Seeding initial data
echo "Seeding initial data..."
npx prisma db seed || echo "Prisma seed failed, continuing anyway..."

# Start the application
echo "Starting Next.js..."
exec node server.js
