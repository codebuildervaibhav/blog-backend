import { Provider } from '@nestjs/common';
import knex, { Knex } from 'knex';
import knexfile from '../../knexfile';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

export const databaseProvider: Provider = {
  provide: KNEX_CONNECTION,
  useFactory: (): Knex => {
    const environment = process.env.NODE_ENV || 'development';
    const config = knexfile[environment];
    return knex(config);
  },
};
