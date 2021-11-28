import { Injectable, BadRequestException } from '@nestjs/common';
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
  async rentMovie(movieId: number, customerId: number) {
    try {
      const movie = await this.movieRepository.findOneOrFail(movieId, {
        relations: ['renters'],
      });
      if (!movie.availability) {
        return {
          message: 'This movie is not available to rent',
        };
      }
      const rentedBy = movie.renters.find(
        (renter) => renter.customerId === customerId,
      );
      if (rentedBy) {
        throw new Error('The customer logged in cant rent the same movie');
      }
      const customer = await this.customersService.findOne(customerId);
      movie.renters = [customer, ...movie.renters];
      movie.stock = movie.stock - 1;
      movie.availability = movie.stock > 0 ? true : false;
      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async returnMovie(movieId: number, customerId: number) {
    try {
      const movie = await this.movieRepository.findOneOrFail(movieId, {
        relations: ['renters'],
      });
      const actualRenters = movie.renters.filter(
        (renter) => renter.customerId !== customerId,
      );
      if (movie.renters.length === actualRenters.length) {
        throw new Error('The customer logged in not rented this movie');
      }
      movie.stock = movie.stock + 1;
      movie.availability = true;
      movie.renters = actualRenters;
      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async buyMovie(movieId: number, customerId: number) {
    try {
      const movie = await this.movieRepository.findOneOrFail(movieId, {
        relations: ['buyers'],
      });
      if (!movie.availability)
        throw new Error('This movie is not available to sale');
      const customer = await this.customersService.findOne(customerId);
      movie.buyers = [...movie.buyers, customer];
      movie.stock = movie.stock - 1 <= 0 ? 0 : movie.stock - 1;
      if (movie.stock === 0) movie.availability = false;
      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
