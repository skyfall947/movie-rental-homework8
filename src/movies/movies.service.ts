import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PatchMovieDto } from './dto/patch-movie.dto';
import { Movie } from './entities/movie.entity';
import { CRUD } from '../common/interfaces/crud.interface';
import { MovieDto } from './dto/movie.dto';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class MoviesService implements CRUD {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}
  async insertOne(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      const movie = new Movie();
      movie.title = createMovieDto.title;
      movie.description = createMovieDto.description;
      movie.trailerUrl = createMovieDto.trailerUrl;
      movie.stock = createMovieDto.stock;
      movie.likes = createMovieDto.likes;
      movie.price = createMovieDto.price;
      movie.availability = createMovieDto.stock <= 0 ? false : true;
      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async findOne(id: number): Promise<Movie> {
    try {
      return await this.movieRepository.findOneOrFail(
        {
          movieId: id,
          availability: true,
        },
        { relations: ['tags'] },
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(sorted = false, perPage = 10, page = 1): Promise<Movie[]> {
    const skip = perPage * page - perPage;
    return await this.movieRepository.find({
      select: ['movieId', 'title', 'price', 'likes'],
      order: { title: sorted ? 'ASC' : 'DESC' },
      take: perPage,
      skip,
    });
  }

  async findAll(isAvailable: boolean, title: string): Promise<MovieDto[]> {
    return this.movieRepository.find({
      select: ['movieId', 'title', 'price', 'likes', 'availability'],
      where: {
        availability: isAvailable,
        title,
      },
      relations: ['tags'],
    });
  }

  sortByTitle(movies: MovieDto[], isDesc: boolean) {
    return movies.sort((movieA: Movie, movieB: Movie) => {
      if (movieA.title > movieB.title) return isDesc ? -1 : 1;
      if (movieA.title < movieB.title) return isDesc ? 1 : -1;
      return 0;
    });
  }

  sortByLikes(movies: MovieDto[], isDesc: boolean) {
    return movies.sort((movieA, movieB) => {
      if (movieA.likes > movieB.likes) return isDesc ? -1 : 1;
      if (movieA.likes < movieB.likes) return isDesc ? 1 : -1;
      return 0;
    });
  }

  filterByTags(movies: MovieDto[], tags: any[]): MovieDto[] {
    if (tags.length === 0) return movies;
    return movies.filter((movie) => {
      const movieTags = movie.tags.map((obj: Tag) => obj.title);
      return tags.every((tag: string) => movieTags.includes(tag));
    });
  }

  async updateOne(id: number, updateMovieDto: PatchMovieDto): Promise<Movie> {
    try {
      const movie = await this.movieRepository.preload({
        movieId: id,
        ...updateMovieDto,
        availability: updateMovieDto.stock <= 0 ? false : true,
      });
      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new BadRequestException(
        error.detail || 'A movie with the id provided do not exist',
      );
    }
  }

  async removeOne(id: number): Promise<void> {
    try {
      const movie = await this.movieRepository.findOneOrFail(id, {
        relations: ['renters'],
      });
      if (movie.renters.length !== 0)
        throw new Error('This movie is rented, cant delete it');
      await this.movieRepository.remove(movie);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
