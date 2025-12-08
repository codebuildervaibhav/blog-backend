import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(
      body.email,
      body.password,
      body.displayName,
    );
  }

  // The LocalAuthGuard automatically runs your LocalStrategy
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // Example of a protected route
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req, @Res() res) {
    return this.handleOAuthRedirect(req, res, 'google');
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Request() req) {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(@Request() req, @Res() res) {
    return this.handleOAuthRedirect(req, res, 'github');
  }

  private async handleOAuthRedirect(
    @Request() req,
    @Res() res,
    provider: 'google' | 'github',
  ) {
    const user = await this.authService.validateOAuthUser(req.user, provider);
    const { access_token } = await this.authService.login(user);

    const redirectUrl = `${this.configService.get('FRONTEND_URL')}/login/success?token=${access_token}`;
    res.redirect(redirectUrl);
  }
}
