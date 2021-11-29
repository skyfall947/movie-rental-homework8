import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  fullName: string;
  @IsEmail()
  @ApiProperty()
  email: string;
  @ApiProperty({
    description:
      'Should have: a number, an upper case char, a lower case char, a special char and and have a length between 4 and 20',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
