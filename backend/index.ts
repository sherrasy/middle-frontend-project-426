import 'dotenv/config';
import * as Sentry from '@sentry/node';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { registerRoutes } from './routes/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import type { FastifyError } from 'fastify';
import * as schemas from './db/schema/index.js';
import runSeeds from './db/seed/index.js';

export type DrizzleDB = ReturnType<typeof drizzle<typeof schemas>>;

// Users
export type User = typeof schemas.users.$inferSelect;
export type UserInsert = typeof schemas.users.$inferInsert;

// Products
export type Product = typeof schemas.products.$inferSelect;
export type ProductInsert = typeof schemas.products.$inferInsert;

const SENTRY_DSN = process.env['SENTRY_DSN'];
Sentry.init({ dsn: SENTRY_DSN });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

const app = Fastify({ logger: true });

Sentry.setupFastifyErrorHandler(app);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema: schemas });

await migrate(db, { migrationsFolder: path.join(__dirname, 'drizzle') });
await runSeeds(db);

await registerRoutes(app);

const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  await app.register(fastifyStatic, { root: publicDir });

  app.setNotFoundHandler((req, reply) => {
    if (req.raw.url?.startsWith('/api/')) {
      return reply.code(404).send({ error: 'Not Found' });
    }
    reply
      .type('text/html')
      .send(fs.createReadStream(path.join(publicDir, 'index.html')));
  });
}

app.setErrorHandler((error: FastifyError, request, reply) => {
  Sentry.captureException(error);
  reply.code(error.statusCode || 500).send({ error: error.message });
});

const port = Number(process.env.PORT) || 3000;
await app.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    Sentry.captureException(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
