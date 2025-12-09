import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { uuidv7 } from 'uuidv7';

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  image_url?: string;
  tags: string[];
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class PostsRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async create(
    postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Post> {
    const [post] = await this.knex('posts')
      .insert({
        id: uuidv7(),
        ...postData,
      })
      .returning('*');
    return post;
  }

  async findBySlug(slug: string): Promise<Post | undefined> {
    return this.knex('posts').where({ slug }).first();
  }

  async findById(id: string): Promise<Post | undefined> {
    return this.knex('posts').where({ id }).first();
  }

  async update(id: string, updates: Partial<Post>): Promise<Post> {
    const [post] = await this.knex('posts')
      .where({ id })
      .update(updates)
      .returning('*');
    return post;
  }

  async delete(id: string): Promise<void> {
    await this.knex('posts').where({ id }).del();
  }
}
