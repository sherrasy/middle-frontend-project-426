import type { components } from '@/shared/types/api-schema';
import { TEST_IDS } from '@/shared/constants/testids';
import { BaseCard } from '@/shared/ui/base-card';
import { Badge } from '@/shared/ui/badge';

type PromoItem = components['schemas']['PromoBlock'];

export const PromoItemCard = ({ promoItem }: { promoItem: PromoItem }) => {
  const { title, product } = promoItem;

  const badge = <Badge variant='primary'>{product.name.toUpperCase()}</Badge>;

  return (
    <BaseCard
      data={product}
      title={title}
      testId={TEST_IDS.home.item}
      badge={badge}
    />
  );
};
