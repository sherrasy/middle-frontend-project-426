import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useCart } from '@/feature/add-to-cart';
import { ordersApi } from '@/entities/order/api/ordersApi';
import { createOrder } from '../api/createOrderApi';
import { CreateOrderRequest, Order } from '@/entities/order';
import { components } from '@/shared/types/api-schema';

export type CreateOrderError =
  | components['schemas']['ValidationError']
  | components['schemas']['OrderCreationError']
  | components['schemas']['Error'];

export const useCreateOrder = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearCart } = useCart();

  return useMutation<Order, CreateOrderError, CreateOrderRequest>({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCart();

      queryClient.invalidateQueries({ queryKey: [ordersApi.baseKey, 'list'] });
      console.log(data);
      navigate(ROUTES.SUCCESS, { state: { order: data } });
    },
  });
};
