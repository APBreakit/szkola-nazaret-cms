FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install package manager
RUN npm install -g pnpm

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN pnpm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Extract standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy and setup startup script
COPY --from=builder --chown=nextjs:nodejs /app/start.sh ./start.sh
RUN chmod +x ./start.sh

# Ensure prisma binaries are available in standalone
# Prisma binaries are usually in node_modules/.pnpm/@prisma+client@...
# Standing next.js output usually handles this, but we keep prisma CLI for db push in start.sh
RUN npm install -g prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["./start.sh"]
