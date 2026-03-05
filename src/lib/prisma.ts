import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("CRITICAL: DATABASE_URL is not defined in environment variables!")
  }

  // Note: Prisma naturally picks up DATABASE_URL from environment variables.
  // Explicitly passing it via datasources is sometimes required for dynamic URLs,
  // but it needs correct typing or a simple cast if the schema allows it.
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
