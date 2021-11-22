import {
  Controller,
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
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesCustomersController {
  constructor(private readonly moviesService: MoviesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('sale/:id')
  async saleMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Req() { user },
  ): Promise<Movie> {
    return await this.moviesService.saleMovie(movieId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('rent/:id')
  async rentMovie(@Param('id', ParseIntPipe) movieId: number, @Req() { user }) {
    return await this.moviesService.rentMovie(movieId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('unrent/:id')
  async unRentMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Req() { user },
  ) {
    return this.moviesService.unRentMovie(movieId, user.id);
  }
}
