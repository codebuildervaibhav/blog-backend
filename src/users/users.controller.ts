import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users (Internal use or admin creation for now)
  @Post()
  create(@Body() body: { email: string; displayName: string }) {
    return this.usersService.create(body.email, body.displayName);
  }

  // GET /users/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}