import fastifyStatic from '@fastify/static';
import * as Sentry from '@sentry/node';
import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import type { FastifyError } from 'fastify';
import Fastify from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './db/index.js';
import runSeeds from './db/seed/index.js';
import { registerRoutes } from './routes/index.js';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { API_MESSAGES } from './lib/messages.js';
import { sendApiError } from './lib/helpers/send-api-error.js';

const SENTRY_DSN = process.env['SENTRY_DSN'];
Sentry.init({ dsn: SENTRY_DSN });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

Sentry.setupFastifyErrorHandler(app);

await migrate(db, { migrationsFolder: path.join(__dirname, 'drizzle') });
await runSeeds(db);

app.setErrorHandler((error: FastifyError, _, reply) => {
  Sentry.captureException(error);

  if (error.validation) {
    const details = error.validation.map((v) => ({
      field:
        v.params?.missingProperty ||
        v.params?.additionalProperty ||
        v.instancePath ||
        'unknown',
      message: v.message,
    }));

    return reply.code(400).send({
      code: 400,
      message: API_MESSAGES.common.validationError,
      details,
    });
  }

  if (error.code === 'FST_ERR_FAILED_ERROR_SERIALIZATION') {
    console.error('Serialization error:', error.message);
    return sendApiError(reply, 500, API_MESSAGES.common.internalError);
  }

  reply.code(error.statusCode || 500).send({
    code: error.statusCode || 500,
    message: error.message,
  });
});

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
await app.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    Sentry.captureException(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
