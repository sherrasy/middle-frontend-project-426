import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutFormValues } from '../model/checkout.schema';
import { CheckoutForm } from './order-form';
import { ROUTES } from '@/shared/constants/routes';
import { Loader } from '@/shared/ui/loader';
import { OrderSummary } from './order-summary';
import { useCart } from '@/feature/add-to-cart';
import { useCartProducts } from '@/feature/add-to-cart/model/useCartProducts';
import { CreateOrderError, useCreateOrder } from '../model/createOrderMutation';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, isEmpty } = useCart();
  const { cartItems, totalPrice, isLoading } = useCartProducts();

  const { mutate, isPending, isSuccess } = useCreateOrder();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isEmpty() && !isSuccess) {
      navigate(ROUTES.CART, { replace: true });
    }
  }, [isEmpty, isLoading, isSuccess, navigate]);

  const handleSubmit = async (values: CheckoutFormValues) => {
    setServerError(null);

    const payload = {
      items: Object.entries(cart).map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity,
      })),
      deliveryMethod: values.deliveryMethod,
      recipientName: values.recipientName,
      recipientPhone: values.phone,
      deliveryAddress:
        values.deliveryMethod === 'delivery' ? values.address : undefined,
    };

    mutate(payload, {
      onError: (error: CreateOrderError) => {
        if ('problematicProducts' in error) {
          const problems = error.problematicProducts
            .map((p) => `Товар ID ${p.productId}: ${p.reason}`)
            .join('; ');
          setServerError(`Не удалось оформить заказ: ${problems}`);
        } else {
          setServerError(
            error.message ||
              'Не удалось оформить заказ. Проверьте данные или наличие товаров.',
          );
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className='max-w-6xl mx-auto px-6 py-8 flex justify-center'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-6 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>
        Оформление заказа
      </h1>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
        <CheckoutForm
          onSubmit={handleSubmit}
          serverError={serverError}
          isSubmitting={isPending}
        />

        <OrderSummary cartItems={cartItems} total={totalPrice} />
      </div>
    </div>
  );
};
