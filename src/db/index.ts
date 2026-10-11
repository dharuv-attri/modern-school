import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const isSocket = process.env.SQL_HOST && process.env.SQL_HOST.startsWith('/');
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST || process.env.PGHOST || 'localhost',
      port: isSocket ? undefined : (process.env.SQL_PORT ? Number(process.env.SQL_PORT) : 5432),
      user: process.env.SQL_USER || process.env.PGUSER || 'postgres',
      password: process.env.SQL_PASSWORD || process.env.PGPASSWORD || 'postgres',
      database: process.env.SQL_DB_NAME || process.env.PGDATABASE || 'cloud_sql_development_database',
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });
