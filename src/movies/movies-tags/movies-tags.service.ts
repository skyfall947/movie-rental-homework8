import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsService } from '../../tags/tags.service';
import { Movie } from '../entities/movie.entity';
import { MoviesService } from '../movies.service';

@Injectable()
export class MoviesTagsService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly tagsService: TagsService,
    private readonly moviesService: MoviesService,
  ) {}
  async tagMovie(movieId: number, tagId: number) {
    try {
      const movie = await this.movieRepository.findOneOrFail(movieId, {
        relations: ['tags'],
      });
      const tag = await this.tagsService.findOne(tagId);
      movie.tags = [...movie.tags, tag];
      await movie.save();
      return this.moviesService.findOne(movieId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async untangleMovie(movieId: number, tagId: number) {
    try {
      const movie = await this.moviesService.findOne(movieId);
      const actualTags = movie.tags.filter((tag) => tag.tagId !== tagId);
      movie.tags = actualTags;
      await this.movieRepository.save(movie);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
