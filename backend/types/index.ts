import type { drizzle } from 'drizzle-orm/node-postgres';
import type * as schemas from '../db/schema/index.ts';
import { Static } from '@sinclair/typebox';
import { components } from './api-schema.js';

export const { PromoBlock } = components.schemas;

export type DrizzleDB = ReturnType<typeof drizzle<typeof schemas>>;

// Products
export type Product = typeof schemas.products.$inferSelect;
export type ProductInsert = typeof schemas.products.$inferInsert;
export type PromoBlockType = Static<typeof PromoBlock>;
// Users
export type User = typeof schemas.users.$inferSelect;
export type UserInsert = typeof schemas.users.$inferInsert;
