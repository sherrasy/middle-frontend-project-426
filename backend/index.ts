import 'dotenv/config';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { registerRoutes } from './routes/index.js';
import seed from './db/seed.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schemas from './db/schema.js';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

const app = Fastify({ logger: true });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema: schemas });

await migrate(db, { migrationsFolder: path.join(__dirname, 'drizzle') });
await seed(db);

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

const port = Number(process.env.PORT) || 3000;
await app.listen({ port, host: '0.0.0.0' });
