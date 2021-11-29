import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  trailerUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  likes: number;
}
