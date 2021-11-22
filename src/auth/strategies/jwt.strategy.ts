import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy as PassportJwtStrategy } from 'passport-jwt';
import { JwtUserDto } from '../dto/auth.dto';
import { Role } from '../role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    roles: Role[];
  }): Promise<JwtUserDto> {
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
