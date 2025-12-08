import { Injectable, ConflictException } from '@nestjs/common';
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepo: LikesRepository) {}

  async likePost(userId: string, postId: string): Promise<void> {
    const hasLiked = await this.likesRepo.hasLiked(userId, postId);
    if (hasLiked) {
      throw new ConflictException('Post already liked');
    }
    await this.likesRepo.likePost(userId, postId);
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    const hasLiked = await this.likesRepo.hasLiked(userId, postId);
    if (!hasLiked) {
      throw new ConflictException('Post not liked');
    }
    await this.likesRepo.unlikePost(userId, postId);
  }
}
