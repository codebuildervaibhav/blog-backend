import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID')!,
      clientSecret: configService.get('GITHUB_CLIENT_SECRET')!,
      callbackURL: configService.get('GITHUB_CALLBACK_URL')!,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const { displayName, emails, photos, username } = profile;
    const user = {
      email: emails[0].value,
      displayName: displayName,
      picture: photos[0].value,
      username: username,
      accessToken,
    };
    done(null, user);
  }
}
