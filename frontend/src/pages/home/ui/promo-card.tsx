import type { components } from '@/shared/types/api-schema';
import { TEST_IDS } from '@/shared/constants/testids';
import { BaseCard } from '@/shared/ui/base-card';

type PromoItem = components['schemas']['PromoBlock'];

export const PromoItemCard = ({ promoItem }: { promoItem: PromoItem }) => {
  const { title, product } = promoItem;

  const badge = (
    <span className='px-3 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700'>
      {product.name.toUpperCase()}
    </span>
  );

  return (
    <BaseCard
      data={product}
      title={title}
      testId={TEST_IDS.home.item}
      badge={badge}
    />
  );
};
