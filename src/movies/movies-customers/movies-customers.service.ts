import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from '../../customers/customers.service';
import { Movie } from '../entities/movie.entity';

@Injectable()
export class MoviesCustomersService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly customersService: CustomersService,
  ) {}
  async rentMovie(movieId: number, customerId: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne(movieId, {
      relations: ['renters'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    if (!movie.availability) {
      throw new UnprocessableEntityException(
        'This movie is not available to rent',
      );
    }
    const rentedBy = movie.renters.find(
      (renter) => renter.customerId === customerId,
    );
    if (rentedBy) {
      throw new UnprocessableEntityException(
        'The customer logged in cant rent the same movie',
      );
    }
    const customer = await this.customersService.findOnePrivate(customerId);
    movie.renters = [customer, ...movie.renters];
    movie.stock = movie.stock - 1;
    movie.availability = movie.stock > 0 ? true : false;
    await this.movieRepository.save(movie);
    movie.renters = [];
    return movie;
  }

  async getMoviesRented(customerId: number): Promise<Movie[]> {
    return this.movieRepository
      .createQueryBuilder('movie')
      .innerJoinAndSelect(
        'movie_renters_customer',
        'rented',
        'movie.movieId = rented.movieMovieId',
      )
      .where('rented.customerCustomerId = :customerId', { customerId })
      .execute();
  }

  async returnMovie(movieId: number, customerId: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne(movieId, {
      relations: ['renters'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    const actualRenters = movie.renters.filter(
      (renter) => renter.customerId !== customerId,
    );
    if (movie.renters.length === actualRenters.length) {
      throw new UnprocessableEntityException(
        'The customer logged in has not rented this movie',
      );
    }
    movie.stock = movie.stock + 1;
    movie.availability = true;
    movie.renters = actualRenters;
    await this.movieRepository.save(movie);
    movie.renters = [];
    return movie;
  }

  async buyMovie(movieId: number, customerId: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne(movieId, {
      relations: ['buyers'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    if (!movie.availability) {
      throw new UnprocessableEntityException(
        'This movie is not available to rent',
      );
    }
    const customer = await this.customersService.findOnePrivate(customerId);
    movie.buyers = [...movie.buyers, customer];
    movie.stock = movie.stock - 1 <= 0 ? 0 : movie.stock - 1;
    if (movie.stock === 0) movie.availability = false;
    await this.movieRepository.save(movie);
    movie.buyers = [];
    return movie;
  }
}
