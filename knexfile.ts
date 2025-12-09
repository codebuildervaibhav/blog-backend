// knexfile.ts
import 'dotenv/config'; // Loads .env file
import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/database/seeds',
      extension: 'ts',
    },
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Necessary for Heroku/Fly.io/etc.
    },
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default config;
