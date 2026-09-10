import type { drizzle } from 'drizzle-orm/node-postgres';
import type * as schemas from '../db/schema.ts';

export type DrizzleDB = ReturnType<typeof drizzle<typeof schemas>>;

export type ProductInsert = typeof schemas.products.$inferInsert;
