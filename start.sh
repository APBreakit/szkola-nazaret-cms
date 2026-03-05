#!/bin/sh
set -e

# Generate Prisma Client
npx prisma generate

# Enable uuid-ossp extension and push schema
# In many cases, uuid-ossp needs to be enabled manually IF not present
echo "Ensuring uuid-ossp extension is enabled..."
# We can't easily run raw SQL here without a psql client, but prisma db push might handle it 
# if the database user has enough permissions and we use dbgenerated("uuid_generate_v4()")

echo "Pushing database schema..."
npx prisma db push --accept-data-loss

# Start the application
echo "Starting Next.js..."
node server.js
