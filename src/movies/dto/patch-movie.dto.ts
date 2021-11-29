import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PatchMovieDto {
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  title?: string;
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  description?: string;
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  price?: number;
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  trailerUrl?: string;
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  stock?: number;
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  likes?: number;
  posterUrl?: string;
}
