export const UI_MESSAGES = {
  validation: {
    required: 'Обязательное поле',
    phoneInvalid: 'Некорректный номер телефона',
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
};

export const PLACEHOLDERS = {
  recipientName: 'Иван Петров',
  phone: '+79990001122',
  address: 'ул. Ленина, 15, кв. 42',
};

export const DELIVERY_METHODS = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
} as const;
