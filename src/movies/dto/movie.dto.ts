import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Tag } from '../../tags/entities/tag.entity';

export class MovieDto {
  @IsNotEmpty()
  movieId: number;
  @IsNotEmpty()
  title: string;
  description?: string;
  @IsUrl()
  trailerUrl?: string;
  @IsNumber()
  price?: number;
  @IsNotEmpty()
  @IsNumber()
  stock: number;
  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  availability?: boolean;
  @IsNumber()
  likes?: number;
  @IsArray()
  tags?: Tag[];
}
