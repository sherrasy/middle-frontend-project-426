import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { products } from './products.js';

export const promoBlocks = pgTable('promo_blocks', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id)
    .unique(),
});
