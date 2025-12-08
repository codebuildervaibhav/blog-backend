import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment as CommentModel } from './comments.repository';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Param('postId') postId: string,
    @Body('content') content: string,
    @Body('parentId') parentId: string | undefined,
    @Request() req,
  ) {
    const commentData: Omit<CommentModel, 'id' | 'created_at' | 'updated_at'> =
      {
        post_id: postId,
        user_id: req.user.userId,
        content,
        parent_id: parentId,
      };
    return this.commentsService.create(commentData);
  }

  @Get()
  findByPostId(@Param('postId') postId: string) {
    return this.commentsService.findByPostId(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body('content') content: string) {
    return this.commentsService.update(id, content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }
}
