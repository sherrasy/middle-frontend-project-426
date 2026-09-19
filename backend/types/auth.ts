import { Static } from '@sinclair/typebox';
import { components } from './api-schema.js';

export const { RegisterRequest, LoginRequest, AuthResponse, User } =
  components.schemas;

export type RegisterBody = Static<typeof RegisterRequest>;
export type LoginBody = Static<typeof LoginRequest>;
export type AuthResponseData = Static<typeof AuthResponse>;
export type UserData = Static<typeof User>;
