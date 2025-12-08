import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  async create(email: string, displayName: string) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }
    return this.userRepo.create(email, displayName);
  }

  async findOne(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }
}
