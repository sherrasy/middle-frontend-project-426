import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { timestamps } from './common.js';

export const products = pgTable('products', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  ...timestamps,
});
