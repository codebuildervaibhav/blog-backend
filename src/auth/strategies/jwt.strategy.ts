import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY_HERE', // In production, use process.env.JWT_SECRET
    });
  }

  async validate(payload: any) {
    // This object is what you get in req.user in your controllers
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
