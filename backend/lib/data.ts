import { faker } from '@faker-js/faker';
import type { ProductInsert } from '../types/index.js';

export function buildProduct(
  params: Partial<ProductInsert> = {},
): ProductInsert {
  return {
    name: faker.commerce.productName(),
    ...params,
  };
}
