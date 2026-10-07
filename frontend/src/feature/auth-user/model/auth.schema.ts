import { UI_MESSAGES } from '@/shared/constants/form-field-data';
import * as Yup from 'yup';

const MESSAGE = UI_MESSAGES.validation;

export const authSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email(MESSAGE.emailInvalid)
    .required(MESSAGE.required),
  password: Yup.string().min(6, MESSAGE.passwordMin).required(MESSAGE.required),
});

export type AuthFormValues = Yup.InferType<typeof authSchema>;
