import { Static } from '@sinclair/typebox';
import { components } from './api-schema.js';

export const { ValidationError, Error: ApiError } = components.schemas;

export type ValidationErrorData = Static<typeof ValidationError>;
export type ErrorData = Static<typeof ApiError>;
