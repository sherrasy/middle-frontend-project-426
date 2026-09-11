import type { FastifyInstance } from 'fastify';
import { healthCheck } from './health-check.js';
import { testError } from './test-error.js';

export const registerRoutes = async (app: FastifyInstance) => {
  await app.register(healthCheck, { prefix: '/api' });
  await app.register(testError, { prefix: '/api' });
};
