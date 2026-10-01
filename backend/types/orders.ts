import { Static } from '@sinclair/typebox';
import { components } from './api-schema.js';

export const {
  Order,
  OrderItem,
  OrderList,
  OrderCreationError,
  OrderStatus,
  CreateOrderRequest,
  ProblematicProduct,
} = components.schemas;

export type OrderT = Static<typeof Order>;
export type OrderItemT = Static<typeof OrderItem>;
export type OrderListT = Static<typeof OrderList>;
export type OrderCreationErrorT = Static<typeof OrderCreationError>;
export type OrderStatusT = Static<typeof OrderStatus>;
export type CreateOrderRequestT = Static<typeof CreateOrderRequest>;
export type ProblematicProductT = Static<typeof ProblematicProduct>;
