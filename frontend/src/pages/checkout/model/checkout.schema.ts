import * as Yup from 'yup';
import { DELIVERY_METHODS, UI_MESSAGES } from '../lib/consts';

const MESSAGE = UI_MESSAGES.validation;

export const checkoutSchema = Yup.object({
  deliveryMethod: Yup.string()
    .oneOf([DELIVERY_METHODS.DELIVERY, DELIVERY_METHODS.PICKUP])
    .required(MESSAGE.required),
  recipientName: Yup.string()
    .trim()
    .min(2, 'Минимум 2 символа')
    .required(MESSAGE.required),
  phone: Yup.string()
    .matches(/^\+?\d{10,18}$/, MESSAGE.phoneInvalid)
    .required(MESSAGE.required),
  address: Yup.string()
    .trim()
    .when('deliveryMethod', {
      is: DELIVERY_METHODS.DELIVERY,
      then: (schema) => schema.required(MESSAGE.required),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export type CheckoutFormValues = Yup.InferType<typeof checkoutSchema>;
