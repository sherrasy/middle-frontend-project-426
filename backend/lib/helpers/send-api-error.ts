import type { FastifyReply } from 'fastify';

type ErrorCode = 400 | 401 | 404 | 409 | 500;

export const sendApiError = (
  reply: FastifyReply,
  code: ErrorCode,
  message: string,
) => reply.code(code).send({ code, message });
