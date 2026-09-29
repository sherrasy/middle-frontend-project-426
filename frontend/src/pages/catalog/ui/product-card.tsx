import type { components } from '@/shared/types/api-schema';
import { TEST_IDS } from '@/shared/constants/testids';
import { BaseCard } from '@/shared/ui/base-card';
import { Badge } from '@/shared/ui/badge';
import { AddToCartButton } from '@/shared/ui/addToCartButton';
import { useCart } from '@/feature/add-to-cart';

type Product = components['schemas']['Product'];

export const ProductCard = ({ product }: { product: Product }) => {
  const { id, isAccessible } = product;
  const { addToCart } = useCart();

  const badge = (
    <Badge
      variant={isAccessible ? 'success' : 'muted'}
      data-testid={TEST_IDS.catalog.itemAvailability}
      data-available={isAccessible}
    >
      {isAccessible ? 'В НАЛИЧИИ' : 'НЕТ В НАЛИЧИИ'}
    </Badge>
  );

  const action = (
    <AddToCartButton
      isAccessible={isAccessible}
      onClick={() => addToCart(id)}
    />
  );

  return (
    <BaseCard
      data={product}
      testIds={{
        root: TEST_IDS.catalog.item,
        title: TEST_IDS.catalog.itemName,
        price: TEST_IDS.catalog.itemPrice,
      }}
      badge={badge}
      action={action}
    />
  );
};
