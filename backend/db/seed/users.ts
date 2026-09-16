import { buildUser } from '../../lib/data.js';
import type { DrizzleDB } from '../../types/index.js';
import { users } from '../schema/users.js';

export const seedUsers = async (db: DrizzleDB) => {
  const existingUsers = await db.select().from(users).limit(1);

  if (existingUsers.length > 0) {
    console.log('Seed skipped: users already exist');
    return;
  }

  const demoUser = buildUser({
    email: 'demo+1785426603748@example.com',
    name: 'Demo User',
  });

  await db.insert(users).values(demoUser);
  console.log('Seeded 1 demo user (password: "password")');
};
