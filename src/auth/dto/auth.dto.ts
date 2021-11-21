import { IsInt, IsNotEmpty } from 'class-validator';

export class JwtUserDto {
  @IsInt()
  id: number;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  isAdmin: boolean;
}

export const LoginUserDto = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
};
