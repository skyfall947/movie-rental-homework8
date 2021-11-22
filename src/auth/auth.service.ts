import { Injectable } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtUserDto } from './dto/auth.dto';

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
      isAdmin: subject.isAdmin,
    };
  }

  login(user: JwtUserDto) {
    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        isAdmin: user.isAdmin,
      }),
    };
  }
}
