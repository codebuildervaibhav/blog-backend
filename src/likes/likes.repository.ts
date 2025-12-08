import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class LikesRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async likePost(userId: string, postId: string): Promise<void> {
    await this.knex.transaction(async (trx) => {
      await trx('post_likes').insert({ user_id: userId, post_id: postId });
      await trx('posts').where({ id: postId }).increment('likes_count', 1);
    });
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    await this.knex.transaction(async (trx) => {
      await trx('post_likes').where({ user_id: userId, post_id: postId }).del();
      await trx('posts').where({ id: postId }).decrement('likes_count', 1);
    });
  }

  async hasLiked(userId: string, postId: string): Promise<boolean> {
    const like = await this.knex('post_likes')
      .where({ user_id: userId, post_id: postId })
      .first();
    return !!like;
  }
}
