// src/auth/auth.repository.ts
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class AuthRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async createAuth(userId: string, passwordHash: string) {
    await this.knex('local_auth').insert({
      user_id: userId,
      password_hash: passwordHash,
    });
  }

  async findPasswordHash(userId: string): Promise<string | null> {
    const record = await this.knex('local_auth')
      .where({ user_id: userId })
      .select('password_hash')
      .first();
    return record ? record.password_hash : null;
  }

  async findSocialAuth(userId: string, provider: 'google' | 'github') {
    return this.knex('social_auth')
      .where({ user_id: userId, provider })
      .first();
  }
}
