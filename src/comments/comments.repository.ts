import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { uuidv7 } from 'uuidv7';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class CommentsRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async create(
    commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Comment> {
    const [comment] = await this.knex('comments')
      .insert({
        id: uuidv7(),
        ...commentData,
      })
      .returning('*');
    return comment;
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    return this.knex('comments')
      .where({ post_id: postId })
      .orderBy('created_at', 'asc');
  }

  async findById(id: string): Promise<Comment | undefined> {
    return this.knex('comments').where({ id }).first();
  }

  async update(id: string, content: string): Promise<Comment> {
    const [comment] = await this.knex('comments')
      .where({ id })
      .update({ content })
      .returning('*');
    return comment;
  }

  async delete(id: string): Promise<void> {
    await this.knex('comments').where({ id }).del();
  }
}
