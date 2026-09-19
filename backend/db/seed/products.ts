import { buildProduct } from '../../lib/data.js';
import type { DrizzleDB } from '../../types/index.js';
import { products } from '../schema/products.js';

export const seedProducts = async (db: DrizzleDB) => {
  const existingProducts = await db.select().from(products).limit(1);

  if (existingProducts.length > 0) {
    console.log('Seed skipped: products already exist');
    return;
  }

  const productsToSeed = Array.from({ length: 3 }, () => buildProduct());
  await db.insert(products).values(productsToSeed);

  console.log(`Seeded ${productsToSeed.length} products`);
};
