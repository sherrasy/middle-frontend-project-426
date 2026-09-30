import { useCart } from '@/feature/add-to-cart';
import { useQueries } from '@tanstack/react-query';
import { productApi } from '@/entities/product/api/productApi';
import { components } from '@/shared/types/api-schema';

export interface CartItem {
  productId: string;
  quantity: number;
  product: components['schemas']['Product'] | undefined;
  isLoading: boolean;
  isError: boolean;
}

interface UseCartPageResult {
  cartItems: CartItem[];
  totalPrice: number;
  totalItems: number;
  isEmptyCart: boolean;
  isLoading: boolean;
}

export const useCartProducts = (): UseCartPageResult => {
  const { cart, isEmpty } = useCart();
  const isEmptyCart = isEmpty();

  const productQueries = useQueries({
    queries: Object.keys(cart).map((productId) => ({
      ...productApi.getProductQueryOptions(productId),
      enabled: !!productId,
    })),
  });

  const isLoading = productQueries.some((query) => query.isLoading);

  const cartItems = Object.entries(cart)
    .map(([productId, quantity], index) => {
      const query = productQueries[index];
      return {
        productId,
        quantity,
        product: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
      };
    })
    .filter((item) => !item.isLoading);

  const totalPrice = cartItems.reduce((sum, item) => {
    if (item.product && item.product.isAccessible) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => {
    if (item.product?.isAccessible) {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  return {
    cartItems,
    totalPrice,
    totalItems,
    isEmptyCart,
    isLoading,
  };
};
