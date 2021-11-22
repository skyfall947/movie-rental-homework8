import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { CustomersService } from 'src/customers/customers.service';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesCustomersController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly customersService: CustomersService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('sale/:id')
  async saleMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Req() { user },
  ): Promise<Movie> {
    const customer = await this.customersService.findOne(user.id);
    return this.moviesService.disableMovieAndAddCustomer(movieId, customer);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('rent/:id')
  async rentMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Req() { user },
  ): Promise<Movie> {
    const customer = await this.customersService.findOne(user.id);
    return this.moviesService.disableMovieAndAddCustomer(movieId, customer);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('unrent/:id')
  async unRentMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Req() { user },
  ) {
    return this.moviesService.enableMovieAndRemoveCustomer(movieId, user.id);
  }
}
