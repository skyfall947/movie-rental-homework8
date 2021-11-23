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
  @Post('sale/:id')
  async saleMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Req() { user },
  ): Promise<Movie> {
    return await this.moviesCustomerService.saleMovie(movieId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('rent/:id')
  async rentMovie(@Param('id', ParseIntPipe) movieId: number, @Req() { user }) {
    return await this.moviesCustomerService.rentMovie(movieId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('unrent/:id')
  async unRentMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Req() { user },
  ) {
    return this.moviesCustomerService.unRentMovie(movieId, user.id);
  }
}
