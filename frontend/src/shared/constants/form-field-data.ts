export const UI_MESSAGES = {
  validation: {
    required: 'Обязательное поле',
    phoneInvalid: 'Некорректный номер телефона',
    emailInvalid: 'Некорректный email',
    passwordMin: 'Минимум 6 символов',
    recipientNameMin: 'Минимум 2 символа',
  },
  delivery: {
    delivery: 'Доставка',
    pickup: 'Самовывоз',
  },
};

export const FIELD_LIMITS = {
  phone: { maxLength: 18 },
  recipientName: { maxLength: 100 },
  address: { maxLength: 300 },
  passwor: { minLength: 6 },
};

export const PLACEHOLDERS = {
  recipientName: 'Иван Петров',
  phone: '+79990001122',
  address: 'ул. Ленина, 15, кв. 42',
  email: 'Введите email',
  password: 'Введите пароль',
};
