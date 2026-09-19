import bcrypt from 'bcrypt';
import { eq, sql } from 'drizzle-orm';
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';
import { requireAuth } from '../middleware/auth.js';
import { sendApiError } from '../lib/helpers/send-api-error.js';
import {
  AuthResponse,
  AuthResponseData,
  LoginBody,
  LoginRequest,
  RegisterBody,
  RegisterRequest,
  User,
  UserData,
} from '../types/auth.js';
import {
  ApiError,
  ErrorData,
  ValidationError,
  ValidationErrorData,
} from '../types/common.js';
import { API_MESSAGES } from '../lib/messages.js';
import { generateToken, SALT_ROUNDS } from '../lib/helpers/generate-token.js';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{
    Body: RegisterBody;
    Reply: AuthResponseData | ValidationErrorData | ErrorData;
  }>('/register', {
    schema: {
      body: RegisterRequest,
      response: {
        200: AuthResponse,
        400: ValidationError,
        409: ApiError,
        500: ApiError,
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;
      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

      if (existingUser.length > 0) {
        return sendApiError(reply, 409, API_MESSAGES.auth.emailAlreadyTaken);
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const [newUser] = await db
        .insert(users)
        .values({ email: normalizedEmail, passwordHash })
        .returning();

      const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        sessionVersion: newUser.sessionVersion,
      });

      return reply.code(200).send({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name || undefined,
        },
      } satisfies AuthResponseData);
    },
  });

  fastify.post<{
    Body: LoginBody;
    Reply: AuthResponseData | ValidationErrorData | ErrorData;
  }>('/login', {
    schema: {
      body: LoginRequest,
      response: {
        200: AuthResponse,
        400: ValidationError,
        401: ApiError,
        500: ApiError,
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;
      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

      if (existingUser.length === 0) {
        return sendApiError(reply, 401, API_MESSAGES.auth.invalidCredentials);
      }

      const user = existingUser[0];
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return sendApiError(reply, 401, API_MESSAGES.auth.invalidCredentials);
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        sessionVersion: user.sessionVersion,
      });

      return reply.code(200).send({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
        },
      } satisfies AuthResponseData);
    },
  });

  fastify.post<{
    Reply: ErrorData | void;
  }>('/logout', {
    preHandler: [requireAuth],
    schema: {
      response: {
        204: { type: 'null' as const },
        401: ApiError,
        500: ApiError,
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.user) {
        return sendApiError(reply, 401, API_MESSAGES.auth.notAuthorized);
      }

      await db
        .update(users)
        .set({ sessionVersion: sql`${users.sessionVersion} + 1` })
        .where(eq(users.id, request.user.userId));

      return reply.code(204).send();
    },
  });

  fastify.get<{
    Reply: UserData | ErrorData;
  }>('/me', {
    preHandler: [requireAuth],
    schema: {
      response: {
        200: User,
        401: ApiError,
        500: ApiError,
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.user) {
        return sendApiError(reply, 401, API_MESSAGES.auth.notAuthorized);
      }

      const user = await db
        .select({ id: users.id, email: users.email, name: users.name })
        .from(users)
        .where(eq(users.id, request.user.userId))
        .limit(1);

      if (user.length === 0) {
        return sendApiError(reply, 404, API_MESSAGES.auth.userNotFound);
      }

      return reply.code(200).send({
        id: user[0].id,
        email: user[0].email,
        name: user[0].name || undefined,
      } satisfies UserData);
    },
  });
};
