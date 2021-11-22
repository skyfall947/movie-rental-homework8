import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUD } from 'src/common/interfaces/crud.interface';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PatchMovieDto } from './dto/patch-movie.dto';
import { Customer } from 'src/customers/entities/customer.entity';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService implements CRUD {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}
  async insertOne(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      const movie = this.movieRepository.create(createMovieDto);
      return await movie.save();
    } catch (error) {
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async findOne(id: number): Promise<Movie> {
    return await this.movieRepository.findOne({
      movieId: id,
      availability: true,
    });
  }

  async getAll(sorted = false, perPage = 10, page = 1): Promise<Movie[]> {
    const skip = perPage * page - perPage;
    return await this.movieRepository.find({
      where: { availability: true },
      order: { title: sorted ? 'ASC' : 'DESC' },
      take: perPage,
      skip,
    });
  }
  async updateOne(id: number, updateMovieDto: PatchMovieDto): Promise<Movie> {
    try {
      const movie = await this.movieRepository.preload({
        movieId: id,
        ...updateMovieDto,
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
      const movie = await this.movieRepository.findOneOrFail(id);
      await this.movieRepository.remove(movie);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeAll(): Promise<void> {
    return await this.movieRepository.clear();
  }

  async disableMovieAndAddCustomer(
    id: number,
    customer: Customer,
  ): Promise<Movie> {
    try {
      const movie = await this.movieRepository.findOneOrFail(id);
      if (movie.availability == false)
        throw new Error('This movie is not available');
      movie.availability = false;
      movie.customer = customer;
      return await movie.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async enableMovieAndRemoveCustomer(movieId: number, customerId: number) {
    try {
      const movie = await this.movieRepository.findOneOrFail(
        { movieId },
        { relations: ['customer'] },
      );
      if (!movie.customer) throw new Error('This movie is not rented');
      if (movie.customer.customerId !== customerId)
        throw Error('The actual customer not rented this movie');
      movie.availability = true;
      movie.customer = null;
      await movie.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
