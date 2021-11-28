import {
  Controller,
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
  @Post(':id/buy')
  async saleMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Req() { user },
  ): Promise<Movie> {
    return await this.moviesCustomerService.buyMovie(movieId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':id/rent')
  async rentMovie(@Param('id', ParseIntPipe) movieId: number, @Req() { user }) {
    return await this.moviesCustomerService.rentMovie(movieId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':id/return')
  async unRentMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Req() { user },
  ) {
    return this.moviesCustomerService.returnMovie(movieId, user.id);
  }
}
