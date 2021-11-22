import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PatchMovieDto } from './dto/patch-movie.dto';
import { Movie } from './entities/movie.entity';
import { PatchValidationPipe } from './movies.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.insertOne(createMovieDto);
  }

  @Get()
  findAll(@Query('sorted', ParseBoolPipe) sorted: boolean): Promise<Movie[]> {
    return this.moviesService.getAll(sorted);
  }

  //TODO: get only available
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return this.moviesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new PatchValidationPipe()) patchMovieDto: PatchMovieDto,
  ): Promise<Movie> {
    return this.moviesService.updateOne(id, patchMovieDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.moviesService.removeOne(id);
  }

  @Delete()
  async removeAll(): Promise<void> {
    return await this.moviesService.removeAll();
  }
}
