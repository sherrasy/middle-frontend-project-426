import type { DrizzleDB } from '../../types/index.js';
import { seedUsers } from './users.js';
import { seedProducts } from './products.js';

export default async function runSeeds(db: DrizzleDB) {
  console.log('Starting database seeding...');

  await seedUsers(db);
  await seedProducts(db);

  console.log('Database seeding completed');
}
