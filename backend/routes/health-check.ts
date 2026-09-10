import type { FastifyPluginAsync } from 'fastify';

export const healthCheck: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async () => ({ status: 'ok' }));
};
