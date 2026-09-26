import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import { categoryNames } from '../../lib/consts.js';
import { buildProduct } from '../../lib/data.js';
import { DrizzleDB } from '../../types/index.js';
import { categories, products } from '../schema/products.js';

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

  const [existingProduct] = await db
    .select({ id: products.id })
    .from(products)
    .limit(1);

  if (existingProduct) {
    console.log('Seed skipped: products already exist');
    return;
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
      name: 'Дешевый товар',
      categoryId: createdCategories[2].id,
      price: 990,
    }),
    buildProduct({
      name: 'RTX 4090',
      categoryId: createdCategories[3].id,
      price: 199990,
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

  const existingNames = await db.select({ name: products.name }).from(products);
  const existingNamesSet = new Set(existingNames.map((p) => p.name));

  const newProducts = productsToInsert.filter(
    (p) => !existingNamesSet.has(p.name),
  );

  if (newProducts.length > 0) {
    await db.insert(products).values(newProducts);
  }

  console.log(
    `✅ Seed completed: ${createdCategories.length} categories, ${newProducts.length} new products.`,
  );
};
