import { Injectable } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtUserDto } from './dto/auth.dto';
import { Role } from './role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateSubject(email: string, password: string): Promise<JwtUserDto> {
    const subject = await this.customersService.getOneByEmail(email);
    if (!subject) return null;
    const isMatch = await bcrypt.compare(password, subject.password);
    if (!isMatch) return null;

    return {
      id: subject.customerId,
      email: subject.email,
      roles: [subject.isAdmin ? Role.Admin : Role.User],
    };
  }

  login(user: JwtUserDto) {
    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        roles: user.roles,
      }),
    };
  }
}
