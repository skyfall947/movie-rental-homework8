import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
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
}
