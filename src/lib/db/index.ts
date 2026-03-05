import { prisma } from "../prisma";

// Shim to support both sql.query and tagged template sql`SELECT...`
export const sql = (async (strings: TemplateStringsArray, ...values: any[]) => {
  // Simple conversion of tagged template to Prisma queryRawUnsafe
  // Note: This is a basic conversion, assumes $1, $2 etc if values are provided
  // But actually the ref project uses standard template literal interpolation
  // which might be unsafe if not handled correctly.

  let query = strings[0];
  for (let i = 1; i < strings.length; i++) {
    query += `$${i}` + strings[i];
  }

  return await (prisma as any).$queryRawUnsafe(query, ...values);
}) as any;

sql.query = async (query: string, params: any[] = []) => {
  return await (prisma as any).$queryRawUnsafe(query, ...params);
};
