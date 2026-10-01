import { inArray } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { products } from '../../db/schema/index.js';
import { OrderItemT, ProblematicProductT } from '../../types/orders.js';
import { API_MESSAGES } from '../messages.js';

interface CartItem {
  productId: number;
  quantity: number;
}

export const validateOrder = async (cartItems: CartItem[]) => {
  const productIds = cartItems.map((i) => i.productId);

  const dbProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  const problematicProducts: ProblematicProductT[] = [];
  const snapshots: OrderItemT[] = [];
  let totalAmount = 0;

  for (const item of cartItems) {
    const product = dbProducts.find((p) => p.id === item.productId);

    if (!product) {
      problematicProducts.push({
        productId: item.productId,
        reason: API_MESSAGES.order.productNotFound,
      });
      continue;
    }

    if (!product.isAccessible) {
      problematicProducts.push({
        productId: item.productId,
        reason: API_MESSAGES.order.productNotAccessible,
      });
      continue;
    }

    const total = product.price * item.quantity;
    totalAmount += total;

    snapshots.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: item.quantity,
      total,
    });
  }

  return { problematicProducts, snapshots, totalAmount };
};
