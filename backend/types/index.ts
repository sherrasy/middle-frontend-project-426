import type { drizzle } from 'drizzle-orm/node-postgres';
import type * as schemas from '../db/schema/index.ts';

export type DrizzleDB = ReturnType<typeof drizzle<typeof schemas>>;

// Products
export type Product = typeof schemas.products.$inferSelect;
export type ProductInsert = typeof schemas.products.$inferInsert;

// Users
export type User = typeof schemas.users.$inferSelect;
export type UserInsert = typeof schemas.users.$inferInsert;
