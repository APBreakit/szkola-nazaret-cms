import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("CRITICAL: DATABASE_URL is not defined in environment variables!")
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
