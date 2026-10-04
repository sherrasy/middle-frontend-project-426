import { ROUTES } from '@/shared/constants/routes';
import { TEST_IDS } from '@/shared/constants/testids';
import { formatPrice } from '@/shared/lib/formatters';
import { Link, useNavigate } from 'react-router-dom';

interface SuccessTotalProps {
  total: number;
  recipientData: string;
}

export const SuccessTotal = ({ total, recipientData }: SuccessTotalProps) => {
  const navigate = useNavigate();
  const handleCheckoutRedirect = () => navigate(ROUTES.CABINET);

  return (
    <div className='w-full max-w-md'>
      <div className='bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5 sticky top-6'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500 text-base'>Итого</span>
          <span
            className='text-2xl font-bold text-gray-900'
            data-testid={TEST_IDS.order.total}
          >
            {formatPrice(total)}
          </span>
        </div>

        <span className='text-gray-500 text-sm '>
          Получатель: {recipientData}
        </span>

        <button
          className='w-full py-3.5 px-4 rounded-lg font-medium text-base text-white
                     bg-blue-500 hover:bg-blue-600 transition-colors duration-200 cursor-pointer'
          onClick={handleCheckoutRedirect}
        >
          Мои заказы
        </button>

        <Link
          to={ROUTES.CATALOG}
          className='text-center text-base font-medium  text-blue-500 hover:text-blue-600 transition-colors cursor-pointer'
        >
          Вернуться в каталог
        </Link>
      </div>
    </div>
  );
};
