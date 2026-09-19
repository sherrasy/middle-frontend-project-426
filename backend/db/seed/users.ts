import { DEMO_USER } from '../../lib/consts.js';
import { buildUser } from '../../lib/data.js';
import { generatePasswordHash } from '../../lib/helpers/generate-demo-password.js';
import type { DrizzleDB } from '../../types/index.js';
import { users } from '../schema/users.js';

export const seedUsers = async (db: DrizzleDB) => {
  const existingUsers = await db.select().from(users).limit(1);

  if (existingUsers.length > 0) {
    console.log('Seed skipped: users already exist');
    return;
  }

  const passwordHash = await generatePasswordHash();

  const demoUser = await buildUser({
    email: DEMO_USER.email,
    name: 'Demo User',
    passwordHash,
  });

  await db.insert(users).values(demoUser);
  console.log(
    `Seeded 1 demo user (email: ${DEMO_USER.email}, password: "password")`,
  );
};
