import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { TEST_IDS } from '@/shared/constants/testids';
import { OrderSuccessBanner } from './success-banner';
import { OrderSuccessSummary } from './order-summary';
import { SuccessTotal } from './total';
import { components } from '@/shared/types/api-schema';

type Order = components['schemas']['Order'];

export const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order as Order | undefined;

  if (!order) {
    navigate(ROUTES.CABINET, { replace: true });
    return null;
  }

  const recipientData = `${order.recipientName}, ${order.recipientPhone}`;

  return (
    <div data-testid={TEST_IDS.order.success} className='w-full max-w-6xl'>
      <OrderSuccessBanner order={order} />

      <div className='flex gap-6 w-full'>
        <OrderSuccessSummary items={order.items} />
        <SuccessTotal total={order.totalAmount} recipientData={recipientData} />
      </div>
    </div>
  );
};
