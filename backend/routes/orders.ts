import { Type as T } from '@sinclair/typebox';
import { and, desc, eq, inArray } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/index.js';
import { orderItems, orders } from '../db/schema/index.js';
import { sendApiError } from '../lib/helpers/send-api-error.js';
import { validateOrder } from '../lib/helpers/validate-order.js';
import { API_MESSAGES } from '../lib/messages.js';
import { requireAuth } from '../middleware/auth.js';
import { components } from '../types/api-schema.js';
import { ErrorData, ValidationErrorData } from '../types/common.js';
import {
  CreateOrderRequestT,
  OrderCreationErrorT,
  OrderListT,
  OrderT,
} from '../types/orders.js';

export const orderRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{
    Body: CreateOrderRequestT;
    Reply: OrderT | ValidationErrorData | OrderCreationErrorT | ErrorData;
  }>('/', {
    preHandler: [requireAuth],
    schema: {
      body: components.schemas.CreateOrderRequest,
      response: {
        201: components.schemas.Order,
        400: T.Union([
          components.schemas.OrderCreationError,
          components.schemas.ValidationError,
        ]),
        401: components.schemas.Error,
        500: components.schemas.Error,
      },
    },
    handler: async (request, reply) => {
      if (!request.user) {
        return sendApiError(reply, 401, API_MESSAGES.auth.notAuthorized);
      }

      const {
        items,
        deliveryMethod,
        recipientName,
        recipientPhone,
        deliveryAddress,
      } = request.body;

      if (!items || items.length === 0) {
        return sendApiError(reply, 400, 'Корзина пуста');
      }

      if (deliveryMethod === 'delivery' && !deliveryAddress?.trim()) {
        return sendApiError(reply, 400, API_MESSAGES.order.invalidAddress);
      }

      const { problematicProducts, snapshots, totalAmount } =
        await validateOrder(items);

      if (problematicProducts.length > 0) {
        return reply.code(400).send({
          code: 400,
          message: API_MESSAGES.order.creationFailed,
          problematicProducts,
        } satisfies OrderCreationErrorT);
      }

      const currentUser = request.user;

      const [createdOrder] = await db.transaction(async (tx) => {
        const [newOrder] = await tx
          .insert(orders)
          .values({
            userId: currentUser.userId,
            deliveryMethod,
            recipientName,
            recipientPhone,
            deliveryAddress:
              deliveryMethod === 'delivery' ? (deliveryAddress ?? null) : null,
            totalAmount,
          })
          .returning();

        await tx.insert(orderItems).values(
          snapshots.map((item) => ({
            ...item,
            orderId: newOrder.id,
          })),
        );

        return [newOrder];
      });

      return reply.code(201).send({
        ...createdOrder,
        createdAt: createdOrder.createdAt.toISOString(),
        items: snapshots,
      } satisfies OrderT);
    },
  });

  fastify.get<{
    Reply: OrderListT | ErrorData;
  }>('/', {
    preHandler: [requireAuth],
    schema: {
      response: {
        200: components.schemas.OrderList,
        401: components.schemas.Error,
        500: components.schemas.Error,
      },
    },
    handler: async (request, reply) => {
      if (!request.user) {
        return sendApiError(reply, 401, API_MESSAGES.auth.notAuthorized);
      }

      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, request.user.userId))
        .orderBy(desc(orders.createdAt));

      if (userOrders.length === 0) {
        return reply
          .code(200)
          .send({ items: [], total: 0 } satisfies OrderListT);
      }

      const orderIds = userOrders.map((o) => o.id);
      const allItems = await db
        .select()
        .from(orderItems)
        .where(inArray(orderItems.orderId, orderIds));

      const ordersWithItems = userOrders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
        items: allItems.filter((item) => item.orderId === order.id),
      }));

      return reply.code(200).send({
        items: ordersWithItems,
        total: ordersWithItems.length,
      } satisfies OrderListT);
    },
  });

  fastify.get<{
    Params: { id: number };
    Reply: OrderT | ErrorData;
  }>('/:id', {
    preHandler: [requireAuth],
    schema: {
      params: T.Object({
        id: T.Integer({ format: 'int32' }),
      }),
      response: {
        200: components.schemas.Order,
        401: components.schemas.Error,
        404: components.schemas.Error,
        500: components.schemas.Error,
      },
    },
    handler: async (request, reply) => {
      if (!request.user) {
        return sendApiError(reply, 401, 'Не авторизован');
      }

      const orderId = request.params.id;

      const order = await db
        .select()
        .from(orders)
        .where(
          and(eq(orders.id, orderId), eq(orders.userId, request.user.userId)),
        )
        .limit(1);

      if (order.length === 0) {
        return sendApiError(reply, 404, API_MESSAGES.common.notFound);
      }
      const currentOrder = order[0];
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, currentOrder.id));

      return reply.code(200).send({
        ...currentOrder,
        createdAt: currentOrder.createdAt.toISOString(),
        items,
      } satisfies OrderT);
    },
  });
};
