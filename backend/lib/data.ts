import { faker } from '@faker-js/faker';
import type { ProductInsert, UserInsert } from '../types/index.js';
import { generatePasswordHash } from './helpers/generate-demo-password.js';

export function buildProduct(
  params: Partial<ProductInsert> = {},
): ProductInsert {
  return {
    name: faker.commerce.productName(),
    ...params,
  };
}

export async function buildUser(
  params: Partial<UserInsert> = {},
): Promise<UserInsert> {
  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    passwordHash: await generatePasswordHash(),
    ...params,
  };
}
