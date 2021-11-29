import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/role.enum';
import { Roles } from '../../auth/roles.decorator';
import { Movie } from '../entities/movie.entity';
import { MoviesCustomersService } from './movies-customers.service';

@ApiTags('Movies: Rent - Buy')
@ApiBearerAuth()
@Controller('movies')
export class MoviesCustomersController {
  constructor(private readonly moviesCustomerService: MoviesCustomersService) {}

  @ApiOkResponse({ description: 'Movies rented provied successfully' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth should be provided' })
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

  @ApiOkResponse({ description: 'Movies purchased provied successfully' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth should be provided' })
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

  @ApiOkResponse({ description: 'Movie purchased successfully' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth should be provided' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':id?/buy')
  async saleMovie(
    @Req() { user },
    @Body() { moviesListId },
    @Param('id') movieId?: number,
  ): Promise<Movie | Movie[]> {
    if (movieId && !moviesListId) {
      return await this.moviesCustomerService.buyMovie(movieId, user.id);
    }
    if (!movieId && moviesListId?.length > 0) {
      const moviesToResolve = moviesListId.map((movieId: number) =>
        this.moviesCustomerService.buyMovie(movieId, user.id),
      );
      return Promise.all(moviesToResolve);
    }
    throw new BadRequestException(
      'Param /:movieId or an array of ids of movies required to buy',
    );
  }

  @ApiOkResponse({ description: 'Movie rented successfully' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth should be provided' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnprocessableEntityResponse({
    description: 'Rent movie operation cannot be done',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':id?/rent')
  async rentMovie(
    @Req() { user },
    @Body() { moviesListId },
    @Param('id') movieId?: number,
  ): Promise<Movie | Movie[]> {
    if (movieId && !moviesListId) {
      return this.moviesCustomerService.rentMovie(movieId, user.id);
    }
    if (!movieId && moviesListId?.length > 0) {
      const moviesToResolve = moviesListId.map((movieId: number) =>
        this.moviesCustomerService.rentMovie(movieId, user.id),
      );
      return Promise.all(moviesToResolve);
    }
    throw new BadRequestException(
      'Param /:movieId or an array of ids of movies required to rent',
    );
  }

  @ApiOkResponse({ description: 'Movie returned successfully' })
  @ApiUnauthorizedResponse({
    description: 'Jwt auth should be provided',
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnprocessableEntityResponse({
    description: 'Return movie operation cannot be done',
  })
  @HttpCode(HttpStatus.OK)
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
