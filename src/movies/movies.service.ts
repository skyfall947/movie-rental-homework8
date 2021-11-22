import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUD } from 'src/common/interfaces/crud.interface';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PatchMovieDto } from './dto/patch-movie.dto';
import { Movie } from './entities/movie.entity';
import { CustomersService } from 'src/customers/customers.service';
import { TagsService } from 'src/tags/tags.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Injectable()
export class MoviesService implements CRUD {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly customerService: CustomersService,
    private readonly tagsService: TagsService,
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
    return await this.movieRepository.findOne(
      {
        movieId: id,
        availability: true,
      },
      { relations: ['tags'] },
    );
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
    const movies = await this.getAll(false);
    await this.movieRepository.remove(movies);
  }

  async rentMovie(movieId: number, customerId: number) {
    try {
      const movie = await this.movieRepository.findOneOrFail(movieId, {
        relations: ['renters'],
      });
      if (!movie.availability) throw new Error('No movies available to rent');
      const rentedBy = movie.renters.find(
        (renter) => renter.customerId == customerId,
      );
      if (rentedBy) {
        throw new Error('The customer logged in cant rent the same movie');
      }
      const customer = await this.customerService.findOne(customerId);
      movie.renters = [customer, ...movie.renters];
      movie.stock = movie.stock - 1 <= 0 ? 0 : movie.stock - 1;
      if (movie.stock == 0) movie.availability = false;
      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async unRentMovie(movieId: number, customerId: number) {
    try {
      const movie = await this.movieRepository.findOneOrFail(movieId, {
        relations: ['renters'],
      });
      const actualRenters = movie.renters.filter(
        (renter) => renter.customerId != customerId,
      );
      if (movie.renters.length == actualRenters.length) {
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

  async saleMovie(movieId: number, customerId: number) {
    try {
      const movie = await this.movieRepository.findOneOrFail(movieId, {
        relations: ['buyers'],
      });
      if (!movie.availability)
        throw new Error('This movie is not available to sale');
      const customer = await this.customerService.findOne(customerId);
      movie.buyers = [...movie.buyers, customer];
      movie.stock = movie.stock - 1 <= 0 ? 0 : movie.stock - 1;
      if (movie.stock == 0) movie.availability = false;
      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async tagMovie(movieId: number, tagId: number) {
    try {
      const movie = await this.movieRepository.findOneOrFail(movieId, {
        relations: ['tags'],
      });
      const tag = await this.tagsService.findOne(tagId);
      movie.tags = [...movie.tags, tag];
      await movie.save();
      return this.findOne(movieId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
