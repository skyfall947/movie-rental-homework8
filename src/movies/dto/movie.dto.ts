import { IsArray, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';
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
  @IsNumber()
  likes?: number;
  @IsArray()
  tags?: Tag[];
}
