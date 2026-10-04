import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AxiosError } from 'axios';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation<
    Order,
    AxiosError<CreateOrderError>,
    CreateOrderRequest
  >({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCart();
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: [ordersApi.baseKey, 'list'] });
      navigate(ROUTES.SUCCESS, { state: { order: data } });
    },
    onError: (error: AxiosError<CreateOrderError>) => {
      const serverError = error.response?.data;

      if (serverError && 'problematicProducts' in serverError) {
        const problems = serverError.problematicProducts
          .map((p) => p.reason)
          .join('; ');
        setErrorMessage(`Не удалось оформить заказ: ${problems}`);
      } else {
        setErrorMessage(serverError?.message || 'Не удалось оформить заказ');
      }
    },
  });

  return { ...mutation, errorMessage };
};
