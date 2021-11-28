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
  @Exclude()
  createdAt: Date;
  @Exclude()
  @IsDate()
  updatedAt: Date;
  @Exclude()
  @IsBoolean()
  isAdmin: boolean;
  @Exclude()
  @IsOptional()
  password?: string;
  @Exclude()
  @IsOptional()
  deletedDate?: Date;
}
