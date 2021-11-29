import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/role.enum';
import { Roles } from '../../auth/roles.decorator';
import { Movie } from '../entities/movie.entity';
import { MoviesCustomersService } from './movies-customers.service';

@Controller('movies')
export class MoviesCustomersController {
  constructor(private readonly moviesCustomerService: MoviesCustomersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('customers/:id/rented')
  async getMoviesRented(
    @Param('id', ParseIntPipe) customerId: number,
    @Req() { user },
  ): Promise<Movie[]> {
    if (user.id !== customerId) {
      throw new ForbiddenException(
        'Customer logged in cant retrive the list of rented movies',
      );
    }
    return this.moviesCustomerService.getMoviesRented(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('customers/:id/purchased')
  async getMoviesPurchased(
    @Param('id', ParseIntPipe) customerId: number,
    @Req() { user },
  ): Promise<Movie[]> {
    if (user.id !== customerId) {
      throw new ForbiddenException(
        'Customer logged in cant retrive the list of purchased movies',
      );
    }
    return this.moviesCustomerService.getMoviesPurchased(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':id/buy')
  async saleMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Req() { user },
  ): Promise<Movie> {
    return await this.moviesCustomerService.buyMovie(movieId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':id?/rent')
  async rentMovie(
    @Req() { user },
    @Body() { moviesId },
    @Param('id') movieId?: number,
  ): Promise<Movie | Movie[]> {
    if (movieId && !moviesId) {
      return this.moviesCustomerService.rentMovie(movieId, user.id);
    }
    if (!movieId && moviesId?.length > 0) {
      console.log('🚀 | MoviesCustomersController | moviesId', moviesId);
      const moviesToResolve = moviesId.map((movieId: number) =>
        this.moviesCustomerService.rentMovie(movieId, user.id),
      );
      return Promise.all(moviesToResolve);
    }
    throw new BadRequestException(
      'Param /:movieId or an array of ids of movies required to buy',
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':id/return')
  async unRentMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Req() { user },
  ): Promise<Movie> {
    return this.moviesCustomerService.returnMovie(movieId, user.id);
  }
}
