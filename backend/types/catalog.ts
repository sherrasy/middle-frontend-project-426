import { Static } from '@sinclair/typebox';
import { components } from './api-schema.js';

export const { CatalogQuery, ProductList, Category } = components.schemas;

export type CatalogQueryType = Static<typeof CatalogQuery>;
export type ProductListType = Static<typeof ProductList>;
export type CategoryType = Static<typeof Category>;
