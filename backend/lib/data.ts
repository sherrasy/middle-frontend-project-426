import { faker } from '@faker-js/faker';
import type { ProductInsert } from '../types/index.js';
import { UserInsert } from '../index.js';

export function buildProduct(
  params: Partial<ProductInsert> = {},
): ProductInsert {
  return {
    name: faker.commerce.productName(),
    ...params,
  };
}

const DEMO_PASSWORD_HASH =
  '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGfa3ZlW';

export function buildUser(params: Partial<UserInsert> = {}): UserInsert {
  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    passwordHash: DEMO_PASSWORD_HASH,
    ...params,
  };
}
