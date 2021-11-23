import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PatchMovieDto } from './dto/patch-movie.dto';
import { Movie } from './entities/movie.entity';
import { CRUD } from '../common/interfaces/crud.interface';

@Injectable()
export class MoviesService implements CRUD {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}
  async insertOne(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      const movie = this.movieRepository.create({
        ...createMovieDto,
        availability: createMovieDto.stock <= 0 ? false : true,
      });
      return await movie.save();
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
      where: { availability: true },
      select: ['movieId', 'title', 'price', 'likes'],
      order: { title: sorted ? 'ASC' : 'DESC' },
      take: perPage,
      skip,
    });
  }

  async updateOne(id: number, updateMovieDto: PatchMovieDto): Promise<Movie> {
    try {
      if (updateMovieDto.stock) {
        updateMovieDto.stock =
          updateMovieDto.stock <= 0 ? 0 : updateMovieDto.stock;
      }
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
      if (movie.renters.length != 0)
        throw new Error('This movie is rented, cant delete it');
      await this.movieRepository.remove(movie);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
