import { integer, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamps } from './common.js';

export const users = pgTable(
  'users',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    name: text('name'),
    sessionVersion: integer('session_version').notNull().default(1),
    ...timestamps,
  },
  (table) => [uniqueIndex('users_email_idx').on(table.email)],
);
