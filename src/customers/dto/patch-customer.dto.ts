import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PatchCustomerDto {
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  fullName?: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password?: string;
}
