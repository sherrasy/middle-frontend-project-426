import type { FastifyInstance } from 'fastify';
import { healthCheck } from './health-check.js';
import { testError } from './test-error.js';
import { authRoutes } from './auth.js';

export const registerRoutes = async (app: FastifyInstance) => {
  await app.register(healthCheck, { prefix: '/api' });
  await app.register(testError, { prefix: '/api' });
  await app.register(authRoutes, { prefix: '/api/auth' });
};
