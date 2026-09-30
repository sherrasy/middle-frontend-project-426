import { CheckoutFormValues } from '../model/checkout.schema';
import { CheckoutForm } from './order-form';
import { OrderSummary } from './order-summary';

export const CheckoutPage = () => {
  const handleSubmit = async (values: CheckoutFormValues) => {
    console.log('Order submitted:', values);
  };

  return (
    <div className='max-w-6xl mx-auto px-6 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>
        Оформление заказа
      </h1>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
        <div className='lg:col-span-3'>
          <CheckoutForm onSubmit={handleSubmit} serverError={null} />
        </div>

        <div className='lg:col-span-2'>
          <OrderSummary items={[]} total={1000} />
        </div>
      </div>
    </div>
  );
};
