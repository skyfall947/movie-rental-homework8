import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PatchCustomerDto {
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  fullName?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty({
    required: false,
    description:
      'Should have: a number, an upper case char, a lower case char, a special char and and have a length between 4 and 20',
  })
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password?: string;

  @ApiProperty({
    required: false,
    description: 'This property can only be changed by an admin',
  })
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isAdmin?: boolean;
}
