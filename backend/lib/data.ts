import { faker } from '@faker-js/faker';
import type { ProductInsert, UserInsert } from '../types/index.js';
import { generatePasswordHash } from './helpers/generate-demo-password.js';

export function buildProduct(
  params: Partial<ProductInsert> = {},
): ProductInsert {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.number.int({ min: 1000, max: 150000 }),
    image: faker.datatype.boolean({ probability: 0.9 })
      ? faker.image.url()
      : null,
    isAccessible: faker.datatype.boolean({ probability: 0.9 }),
    categoryId: params.categoryId ?? 1,
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
