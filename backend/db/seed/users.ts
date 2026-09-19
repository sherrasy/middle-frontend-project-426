import { DEMO_USER } from '../../lib/consts.js';
import { buildUser } from '../../lib/data.js';
import { generatePasswordHash } from '../../lib/helpers/generate-demo-password.js';
import type { DrizzleDB } from '../../types/index.js';
import { users } from '../schema/users.js';
import { eq } from 'drizzle-orm';

export const seedUsers = async (db: DrizzleDB) => {
  const passwordHash = await generatePasswordHash();

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, DEMO_USER.email))
    .limit(1);

  if (existingUser.length > 0) {
    console.log(`Demo user exists. Updating password hash...`);

    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.email, DEMO_USER.email));

    console.log(`Password hash updated for ${DEMO_USER.email}`);
  } else {
    const demoUser = await buildUser({
      email: DEMO_USER.email,
      name: 'Demo User',
      passwordHash,
    });

    await db.insert(users).values(demoUser);
    console.log(`Seeded demo user: ${DEMO_USER.email} / ${DEMO_USER.password}`);
  }
};
