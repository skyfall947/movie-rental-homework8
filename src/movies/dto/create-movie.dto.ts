import { IsBoolean, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description?: string;

  @IsNotEmpty()
  @IsUrl()
  trailerUrl: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  availability: boolean;
}
