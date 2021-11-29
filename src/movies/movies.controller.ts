import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  NotFoundException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { editFileName, imageFileFilter } from '../common/utils/image-utils';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieDto } from './dto/movie.dto';
import { PatchMovieDto } from './dto/patch-movie.dto';
import { MovieQueries } from './dto/query-movie.dto';
import { Movie } from './entities/movie.entity';
import { PatchValidationPipe } from './movies.pipe';
import { MoviesService } from './movies.service';

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
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() queries: MovieQueries): Promise<MovieDto[]> {
    let movies = await this.moviesService.findAll(
      queries.available,
      queries.title,
    );
    movies = this.moviesService.filterByTags(
      movies,
      queries.tags ? queries.tags.split(',') : [],
    );
    enum SORT {
      TitleASC = queries.sort.search(/^title/) >= 0 ? 1 : 0,
      TitleDESC = queries.sort.search(/^-title/) >= 0 ? 1 : 0,
      LikesASC = queries.sort.search(/^likes/) >= 0 ? 1 : 0,
      LikesDESC = queries.sort.search(/^-likes/) >= 0 ? 1 : 0,
    }
    if (SORT.TitleASC || SORT.TitleDESC) {
      movies = this.moviesService.sortByTitle(
        movies,
        SORT.TitleASC >> SORT.TitleDESC === 0,
      );
    }
    if (SORT.LikesASC || SORT.LikesDESC) {
      movies = this.moviesService.sortByLikes(
        movies,
        SORT.LikesASC >> SORT.LikesDESC === 0,
      );
    }
    return movies;
  }

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

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.moviesService.removeOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('poster/:id')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './posters',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadPoster(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) movieId: number,
  ) {
    return await this.moviesService.updateOne(movieId, {
      posterUrl: file.filename,
    } as PatchMovieDto);
  }

  @Get('poster/:id')
  async getPoster(@Param('id', ParseIntPipe) movieId: number, @Res() res) {
    const movie = await this.moviesService.findOne(movieId);
    if (movie.posterUrl === 'NO_DEFINED')
      throw new NotFoundException('This movie doesnt have a poster');
    return res.sendFile(movie.posterUrl, { root: './posters' });
  }
}
