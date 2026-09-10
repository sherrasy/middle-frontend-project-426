import type { FastifyInstance } from 'fastify';
import { healthCheck } from './health-check.js';

export const registerRoutes = async (app: FastifyInstance) => {
  await app.register(healthCheck, { prefix: '/api' });
};
