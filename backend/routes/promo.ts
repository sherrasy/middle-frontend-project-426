import { eq } from 'drizzle-orm';
import { Type as T } from '@sinclair/typebox';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/index.js';
import { promoBlocks, products } from '../db/schema/index.js';
import { sendApiError } from '../lib/helpers/send-api-error.js';
import { API_MESSAGES } from '../lib/messages.js';
import { components } from '../types/api-schema.js';
import { ErrorData } from '../types/common.js';
import { PromoBlockType } from '../types/index.js';

export const promoRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Reply: PromoBlockType[] | ErrorData;
  }>('/promo', {
    schema: {
      response: {
        200: T.Array(components.schemas.PromoBlock),
        500: components.schemas.Error,
      },
    },
    handler: async (_, reply) => {
      try {
        const result = await db
          .select({
            id: promoBlocks.id,
            title: promoBlocks.title,
            description: promoBlocks.description,
            product: {
              id: products.id,
              name: products.name,
              price: products.price,
              description: products.description,
              image: products.image,
              isAccessible: products.isAccessible,
              categoryId: products.categoryId,
            },
          })
          .from(promoBlocks)
          .innerJoin(products, eq(promoBlocks.productId, products.id))
          .where(eq(products.isAccessible, true))
          .orderBy(promoBlocks.id);

        return reply.code(200).send(result satisfies PromoBlockType[]);
      } catch (error) {
        return sendApiError(reply, 500, API_MESSAGES.common.internalError);
      }
    },
  });
};
