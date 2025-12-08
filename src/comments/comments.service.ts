import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository, Comment } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepo: CommentsRepository) {}

  async create(
    commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Comment> {
    return this.commentsRepo.create(commentData);
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    return this.commentsRepo.findByPostId(postId);
  }

  async update(id: string, content: string): Promise<Comment> {
    return this.commentsRepo.update(id, content);
  }

  async delete(id: string): Promise<void> {
    await this.commentsRepo.delete(id);
  }
}
