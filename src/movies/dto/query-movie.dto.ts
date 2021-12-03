import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export enum SortQuery {
  TitleASC = 'title',
  TitleDESC = '-title',
  LikesASC = 'likes',
  LikesDESC = '-likes',
  Void = '',
}

export class MovieQueries {
  @IsOptional()
  @IsString()
  @IsIn(['title', '-title', 'likes', '-likes', ''])
  sort = '';
  @IsString()
  @IsOptional()
  title = '';
  @IsBoolean()
  @IsOptional()
  @Transform((available) => available.value === 'true')
  available = true;
  @IsString()
  @IsOptional()
  tags = '';
}
