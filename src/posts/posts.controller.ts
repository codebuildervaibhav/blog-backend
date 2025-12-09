import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostModel } from './posts.repository';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Request() req,
    @Body()
    postData: Omit<PostModel, 'id' | 'created_at' | 'updated_at' | 'author_id'>,
  ) {
    const newPostData = {
      ...postData,
      author_id: req.user.userId,
    };
    return this.postsService.create(newPostData);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updates: Partial<Omit<PostModel, 'id' | 'author_id'>>,
  ) {
    return this.postsService.update(id, updates);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}
