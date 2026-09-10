import { buildProduct } from '../lib/data.js';
import type { DrizzleDB } from '../types/index.js';
import * as schemas from './schema.js';

export default async (db: DrizzleDB) => {
  const existing = await db.select().from(schemas.products).limit(1);

  if (existing.length > 0) {
    console.log('Seed skipped: products already exist');
    return;
  }

  const products = Array.from({ length: 3 }, () => buildProduct());
  await db.insert(schemas.products).values(products);

  console.log(`Seeded ${products.length} products`);
};
