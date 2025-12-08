import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { uuidv7 } from 'uuidv7';

// Define the shape of a User for TypeScript
export interface User {
  id: string;
  email: string;
  display_name: string;
  role: 'admin' | 'user';
}

@Injectable()
export class UserRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async create(
    email: string,
    displayName: string,
    role: 'admin' | 'user' = 'user',
  ) {
    const [user] = await this.knex('users')
      .insert({
        id: uuidv7(), // App-generated UUID v7
        email,
        display_name: displayName,
        role,
      })
      .returning('*'); // Return the created user
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.knex('users').where({ email }).first();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.knex('users').where({ id }).first();
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<(User & { password_hash: string }) | undefined> {
    return this.knex('users')
      .select('users.*', 'local_auth.password_hash')
      .leftJoin('local_auth', 'users.id', 'local_auth.user_id')
      .where({ email })
      .first();
  }
}
