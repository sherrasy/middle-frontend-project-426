import { count } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/index.js';
import { categories, products } from '../db/schema/index.js';
import { sendApiError } from '../lib/helpers/send-api-error.js';
import { API_MESSAGES } from '../lib/messages.js';
import { components } from '../types/api-schema.js';
import type {
  CatalogQueryType,
  CategoryType,
  ProductListType,
} from '../types/catalog.js';
import { ErrorData, ValidationErrorData } from '../types/common.js';
import { getProductConditions } from '../lib/helpers/get-product-conditions.js';
import { Type as T } from '@sinclair/typebox';

export const catalogRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Reply: CategoryType[] | ErrorData;
  }>('/categories', {
    schema: {
      response: {
        200: T.Array(components.schemas.Category),
        500: components.schemas.Error,
      },
    },
    handler: async (_, reply) => {
      try {
        const result = await db
          .select()
          .from(categories)
          .orderBy(categories.name);

        return reply.code(200).send(result satisfies CategoryType[]);
      } catch (error) {
        return sendApiError(reply, 500, API_MESSAGES.common.internalError);
      }
    },
  });

  fastify.get<{
    Querystring: CatalogQueryType;
    Reply: ProductListType | ValidationErrorData | ErrorData;
  }>('/products', {
    schema: {
      querystring: components.schemas.CatalogQuery,
      response: {
        200: components.schemas.ProductList,
        400: components.schemas.ValidationError,
        500: components.schemas.Error,
      },
    },
    handler: async (request, reply) => {
      const query = request.query;

      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? 12;

      const whereClause = getProductConditions(query);

      try {
        const countResult = await db
          .select({ count: count() })
          .from(products)
          .where(whereClause);

        const total = countResult[0]?.count ?? 0;
        const totalPages = Math.ceil(total / pageSize);

        const items = await db
          .select()
          .from(products)
          .where(whereClause)
          .limit(pageSize)
          .offset((page - 1) * pageSize);

        const responseData: ProductListType = {
          items,
          total,
          page,
          pageSize,
          totalPages,
        };

        return reply.code(200).send(responseData satisfies ProductListType);
      } catch (error) {
        return sendApiError(reply, 500, API_MESSAGES.common.internalError);
      }
    },
  });
};
