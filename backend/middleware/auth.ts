import { eq } from 'drizzle-orm';
import type { preHandlerHookHandler } from 'fastify';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';
import { API_MESSAGES } from '../lib/messages.js';
import { JWT_SECRET } from '../lib/helpers/generate-token.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: number;
      email: string;
      sessionVersion: number;
    };
  }
}

export interface JwtPayload {
  userId: number;
  email: string;
  sessionVersion: number;
}

export const requireAuth: preHandlerHookHandler = async (request, reply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({
      code: 401,
      message: API_MESSAGES.auth.tokenNotProvided,
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await db
      .select({
        id: users.id,
        email: users.email,
        sessionVersion: users.sessionVersion,
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (user.length === 0) {
      return reply.code(401).send({
        code: 401,
        message: API_MESSAGES.auth.userNotFound,
      });
    }

    if (user[0].sessionVersion !== decoded.sessionVersion) {
      return reply.code(401).send({
        code: 401,
        message: API_MESSAGES.auth.sessionInvalid,
      });
    }

    request.user = {
      userId: user[0].id,
      email: user[0].email,
      sessionVersion: user[0].sessionVersion,
    };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return reply.code(401).send({
        code: 401,
        message: API_MESSAGES.auth.tokenExpired,
      });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return reply.code(401).send({
        code: 401,
        message: API_MESSAGES.auth.invalidToken,
      });
    }
    return reply.code(500).send({
      code: 500,
      message: API_MESSAGES.common.internalError,
    });
  }
};
