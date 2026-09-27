import type { components } from '@/shared/types/api-schema';
import { TEST_IDS } from '@/shared/constants/testids';
import { BaseCard } from '@/shared/ui/base-card';

type Product = components['schemas']['Product'];

export const ProductCard = ({ product }: { product: Product }) => {
  const { isAccessible } = product;

  const badge = (
    <span
      className={`px-3 py-1 rounded-md text-xs font-semibold ${
        isAccessible ? 'bg-green-100 text-green-700' : 'bg-gray-400 text-white'
      }`}
      data-testid={TEST_IDS.catalog.itemAvailability}
      data-available={isAccessible}
    >
      {isAccessible ? 'В НАЛИЧИИ' : 'НЕТ В НАЛИЧИИ'}
    </span>
  );

  const action = (
    <button
      type='button'
      disabled={!isAccessible}
      onClick={() => {}}
      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
        isAccessible
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`}
    >
      В корзину
    </button>
  );

  return (
    <BaseCard
      data={product}
      testId={TEST_IDS.catalog.item}
      badge={badge}
      action={action}
    />
  );
};
