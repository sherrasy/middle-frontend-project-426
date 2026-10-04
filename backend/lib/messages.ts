export const API_MESSAGES = {
  auth: {
    tokenNotProvided: 'Токен авторизации не предоставлен',
    userNotFound: 'Пользователь не найден',
    sessionInvalid: 'Сессия недействительна. Пожалуйста, войдите снова',
    tokenExpired: 'Токен истёк',
    invalidToken: 'Невалидный токен',
    emailAlreadyTaken: 'Этот email уже зарегистрирован',
    invalidCredentials: 'Неверный email или пароль',
    notAuthorized: 'Не авторизован',
  },
  common: {
    internalError: 'Внутренняя ошибка сервера',
    validationError: 'Ошибка валидации данных',
    notFound: 'Данные не найдены',
  },
  order: {
    creationFailed: 'Невозможно создать заказ из-за проблем с товарами',
    productNotAccessible: 'Товар временно недоступен для покупки',
    productNotFound: 'Товар не найден',
    invalidAddress: 'Адрес доставки обязателен при выборе курьерской доставки',
  },
} as const;
