import { Order } from '@/entities/order';

export const ORDER_FIXTURE: Order = {
  id: 1001,
  createdAt: '2026-10-01T12:00:00Z',
  status: 'paid',
  deliveryMethod: 'delivery',
  recipientName: 'Иван Петров',
  recipientPhone: '+70000000000',
  deliveryAddress: 'ул. Примерная, д. 1',
  totalAmount: 43980,
  items: [
    {
      productId: 1,
      productName: 'AMD Ryzen 5 7600X',
      quantity: 2,
      price: 21990,
      total: 43980,
    },
  ],
};

