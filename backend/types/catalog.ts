import { Static } from '@sinclair/typebox';
import { components } from './api-schema.js';

export const { CatalogQuery, ProductList, Category, Product } =
  components.schemas;

export type CatalogQueryT = Static<typeof CatalogQuery>;
export type ProductListT = Static<typeof ProductList>;
export type CategoryT = Static<typeof Category>;
export type ProductT = Static<typeof Product>;
