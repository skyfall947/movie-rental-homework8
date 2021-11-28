import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PatchMovieDto {
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  title?: string;
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  description?: string;
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  price?: number;
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  trailerUrl?: string;
  @Expose()
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  stock?: number;
  @Expose()
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  likes?: number;
}
