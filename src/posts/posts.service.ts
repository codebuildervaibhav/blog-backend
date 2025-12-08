import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository, Post } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepo: PostsRepository) {}

  async create(
    postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Post> {
    return this.postsRepo.create(postData);
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepo.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: string, updates: Partial<Post>): Promise<Post> {
    return this.postsRepo.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    await this.postsRepo.delete(id);
  }
}
