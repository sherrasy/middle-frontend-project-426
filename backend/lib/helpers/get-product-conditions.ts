import { and, eq, ilike, gte, lte } from 'drizzle-orm';
import { products } from '../../db/schema/products.js';
import type { CatalogQueryType } from '../../types/catalog.js';

export function getProductConditions(query: CatalogQueryType) {
  const conditions = [];

  if (query.categoryId !== undefined) {
    conditions.push(eq(products.categoryId, query.categoryId));
  }

  if (query.search && query.search.trim() !== '') {
    conditions.push(ilike(products.name, `%${query.search.trim()}%`));
  }

  if (query.priceFrom !== undefined) {
    conditions.push(gte(products.price, query.priceFrom));
  }

  if (query.priceTo !== undefined) {
    conditions.push(lte(products.price, query.priceTo));
  }

  if (query.onlyAvailable === true) {
    conditions.push(eq(products.isAccessible, true));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}
