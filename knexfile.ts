// knexfile.ts
import 'dotenv/config'; // Loads .env file
import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  // 1. We change 'development' to use PostgreSQL instead of SQLite
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      // This pulls the password from your .env file
      password: process.env.DB_PASSWORD,
      database: 'my_blogs_db',
    },
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts', // Important for NestJS/TypeScript
    },
    seeds: {
      directory: './src/database/seeds',
      extension: 'ts',
    },
  },

  // 2. You can keep staging/prod as placeholders or configure them later
  // staging: {
  //   client: 'pg',
  //   connection: {
  //     database: 'my_db_staging',
  //     user: 'username',
  //     password: 'password',
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations',
  //   },
  // },

  // production: {
  //   client: 'pg',
  //   connection: {
  //     database: 'my_db_prod',
  //     user: 'username',
  //     password: 'password',
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations',
  //   },
  // },
};

export default config;
