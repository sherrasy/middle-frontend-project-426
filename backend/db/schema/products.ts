import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull().unique(),
});

export const products = pgTable('products', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  description: text('description').notNull(),
  image: text('image'),
  isAccessible: boolean('is_accessible').notNull().default(true),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
});
