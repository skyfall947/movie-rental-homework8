import { IsInt, IsNotEmpty } from 'class-validator';
import { Role } from '../role.enum';

export class JwtUserDto {
  @IsInt()
  id: number;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  roles: Role[];
}

export const LoginUserDto = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
};
