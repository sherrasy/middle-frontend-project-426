import { eq } from 'drizzle-orm';
import { DrizzleDB } from '../../types/index.js';
import { promoBlocks } from '../schema/promo.js';
import { products } from '../schema/products.js';

export const seedPromoBlocks = async (db: DrizzleDB) => {
  const existingPromo = await db
    .select({ id: promoBlocks.id })
    .from(promoBlocks)
    .limit(1);

  if (existingPromo.length > 0) {
    console.log('Seed skipped: promo blocks already exist');
    return;
  }

  const availableProducts = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(eq(products.isAccessible, true))
    .limit(5);

  if (availableProducts.length < 2) {
    console.warn(
      '⚠️ Seed warning: Not enough accessible products in DB to create promo blocks.',
    );
    return;
  }
  const promoData = [
    {
      title: 'Максимальная производительность на будущее',
      description: `Флагманский выбор для энтузиастов. ${availableProducts[0].name} справится с любыми задачами и играми в 4K.`,
      productId: availableProducts[0].id,
    },
    {
      title: 'Идеальный старт для сборки ПК',
      description: `Надежное решение по доступной цене. ${availableProducts[1].name} — хит продаж этого месяца.`,
      productId: availableProducts[1].id,
    },
  ];

  if (availableProducts.length >= 3) {
    promoData.push({
      title: 'Выбор наших покупателей',
      description: `${availableProducts[2].name} — стабильное качество и отличные отзывы. Успейте забрать по выгодной цене.`,
      productId: availableProducts[2].id,
    });
  }

  await db.insert(promoBlocks).values(promoData);

  console.log(`✅ Seed completed: ${promoData.length} promo blocks added.`);
};
