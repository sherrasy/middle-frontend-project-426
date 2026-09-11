import type { FastifyPluginAsync } from 'fastify';

export const testError: FastifyPluginAsync = async (fastify) => {
  fastify.get('/test-error', async () => {
    throw new Error('Sentry test error');
  });
};
