import { eq } from 'drizzle-orm';
import { categoryNames } from '../../lib/consts.js';
import { categories, products } from '../schema/products.js';
import { buildProduct } from '../../lib/data.js';
import { faker } from '@faker-js/faker';
import { DrizzleDB } from '../../types/index.js';

export const seedProducts = async (db: DrizzleDB) => {
  const createdCategories = [];

  for (const name of categoryNames) {
    const [cat] = await db
      .insert(categories)
      .values({ name })
      .onConflictDoNothing()
      .returning();

    if (!cat) {
      const [existing] = await db
        .select()
        .from(categories)
        .where(eq(categories.name, name))
        .limit(1);
      createdCategories.push(existing);
    } else {
      createdCategories.push(cat);
    }
  }

  const productsToInsert = [];

  productsToInsert.push(
    buildProduct({
      name: 'Товар без картинки',
      categoryId: createdCategories[0].id,
      image: null,
      price: 1500,
    }),
    buildProduct({
      name: 'Недоступный товар',
      categoryId: createdCategories[1].id,
      isAccessible: false,
      price: 150000,
    }),
    buildProduct({
      name: 'Дешевый товар ',
      categoryId: createdCategories[2].id,
      price: 990,
    }),
  );

  for (const cat of createdCategories) {
    for (let i = 0; i < 12; i++) {
      productsToInsert.push(
        buildProduct({
          categoryId: cat.id,
          price: faker.number.int({ min: 2000, max: 80000 }),
        }),
      );
    }
  }

  for (const prod of productsToInsert) {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.name, prod.name))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(products).values(prod);
    }
  }

  console.log(
    `✅ Seed completed: ${createdCategories.length} categories, ${productsToInsert.length} products.`,
  );
};
