import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CustomerDto {
  @IsNumber()
  customerId: number;
  @IsString()
  fullName: string;
  @IsEmail()
  email: string;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
  @IsBoolean()
  isAdmin: boolean;
  @Exclude()
  @IsOptional()
  password?: string;
}
