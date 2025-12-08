import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { uuidv7 } from 'uuidv7';
import { AuthRepository } from './auth.repository';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // To check/create the public profile
    private authRepo: AuthRepository, // To save the password
    private jwtService: JwtService,
    @Inject('KNEX_CONNECTION') private readonly knex: Knex, // For Transactions
  ) {}

  // 1. REGISTER (Atomic Transaction)
  async register(email: string, password: string, displayName: string) {
    // Start a transaction so if password fails, user isn't created
    return this.knex.transaction(async (trx) => {
      // A. Create User (using trx to ensure it's part of transaction)
      // Note: We need to modify UsersService slightly to accept 'trx' or use repo directly here.
      // For simplicity, we'll insert directly via raw knex here to show the flow:

      const userId = uuidv7();
      await trx('users').insert({
        id: userId,
        email,
        display_name: displayName,
        role: 'user',
      });

      // B. Hash Password
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);

      // C. Save Password
      await trx('local_auth').insert({
        user_id: userId,
        password_hash: hash,
      });

      return { id: userId, email };
    });
  }

  // 2. VALIDATE USER (Used by LocalStrategy)
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email); // Add this method to UsersService if missing
    if (user) {
      const storedHash = await this.authRepo.findPasswordHash(user.id);
      if (storedHash && (await bcrypt.compare(pass, storedHash))) {
        // Password Match! Return user without password
        return { id: user.id, email: user.email, role: user.role };
      }
    }
    return null;
  }

  // 3. LOGIN (Generate Token)
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 4. VALIDATE OAUTH USER
  async validateOAuthUser(profile: any, provider: 'google' | 'github') {
    const { email, displayName, photos } = profile;

    // Check if a user with this email already exists
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // If not, create a new user and social auth record in a transaction
      user = await this.knex.transaction(async (trx) => {
        const userId = uuidv7();

        // Create the user
        await trx('users').insert({
          id: userId,
          email,
          display_name: displayName,
          avatar_url: photos[0].value,
        });

        // Create the social auth record
        await trx('social_auth').insert({
          id: uuidv7(),
          user_id: userId,
          provider,
          provider_account_id: profile.id,
        });

        // Return the newly created user from the transaction
        return trx('users').where({ id: userId }).first();
      });
    } else {
      // If user exists, check if they have a social auth record for this provider
      const socialAuth = await this.authRepo.findSocialAuth(user.id, provider);
      if (!socialAuth) {
        // If not, create one
        await this.knex('social_auth').insert({
          id: uuidv7(),
          user_id: user.id,
          provider,
          provider_account_id: profile.id,
        });
      }
    }

    return user;
  }
}
