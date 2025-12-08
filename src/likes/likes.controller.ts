import {
  Controller,
  Post,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts/:postId/like')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  likePost(@Param('postId') postId: string, @Request() req) {
    return this.likesService.likePost(req.user.userId, postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  unlikePost(@Param('postId') postId: string, @Request() req) {
    return this.likesService.unlikePost(req.user.userId, postId);
  }
}
