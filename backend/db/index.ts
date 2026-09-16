import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schemas from './schema/index.js';

const { Pool } = pg;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema: schemas });
