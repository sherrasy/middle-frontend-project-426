import {
  integer,
  pgTable,
  text,
  timestamp,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { timestamps } from './common.js';

export const deliveryMethodEnum = pgEnum('delivery_method', [
  'delivery',
  'pickup',
]);
export const orderStatusEnum = pgEnum('order_status', ['paid']);

export const orders = pgTable(
  'orders',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: orderStatusEnum('status').notNull().default('paid'),
    deliveryMethod: deliveryMethodEnum('delivery_method').notNull(),
    recipientName: text('recipient_name').notNull(),
    recipientPhone: text('recipient_phone').notNull(),
    deliveryAddress: text('delivery_address'),
    totalAmount: integer('total_amount').notNull(),
    ...timestamps,
  },
  (table) => [
    index('orders_user_id_idx').on(table.userId),
    index('orders_user_created_at_idx').on(table.userId, table.createdAt),
  ],
);

export const orderItems = pgTable(
  'order_items',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: integer('product_id').notNull(),
    productName: text('product_name').notNull(),
    price: integer('price').notNull(),
    quantity: integer('quantity').notNull(),
    total: integer('total').notNull(),
  },
  (table) => [index('order_items_order_id_idx').on(table.orderId)],
);
