import { ROUTES } from '@/shared/constants/routes';

export const AUTH_CONFIG = {
  login: {
    title: 'Вход',
    description: null,
    submitButtonText: 'Войти',
    linkText: 'Нет аккаунта?',
    linkLabel: 'Зарегистрироваться',
    linkTo: ROUTES.SIGNIN,
  },
  registration: {
    title: 'Регистрация',
    description:
      'Аккаунт нужен, чтобы оформить заказ и видеть историю покупок.',
    submitButtonText: 'Зарегистрироваться',
    linkText: 'Уже есть аккаунт?',
    linkLabel: 'Войти',
    linkTo: ROUTES.SIGNUP,
  },
} as const;
