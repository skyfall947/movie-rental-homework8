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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { editFileName, imageFileFilter } from '../common/utils/image-utils';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieDto } from './dto/movie.dto';
import { PatchMovieDto } from './dto/patch-movie.dto';
import { MovieQueries, SortQuery } from './dto/query-movie.dto';
import { uploadPosterDto } from './dto/upload-poster.dto';
import { Movie } from './entities/movie.entity';
import { PatchValidationPipe } from './movies.pipe';
import { MoviesService } from './movies.service';

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiCreatedResponse({ description: 'Movie created successfully' })
  @ApiForbiddenResponse({ description: 'Token authorization required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.insertOne(createMovieDto);
  }

  @ApiQuery({ enumName: 'sort', enum: SortQuery, required: false })
  @ApiQuery({
    name: 'title',
    description: 'Movie title to be searched',
    required: false,
  })
  @ApiQuery({
    name: 'available',
    description: 'state of the movie',
    required: false,
  })
  @ApiQuery({
    name: 'tags',
    description: 'Array of tags to be filtered',
    required: false,
  })
  @ApiOkResponse({ description: 'Movies retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Token authorization required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
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

  @ApiOkResponse({ description: 'Movie retrieved successfully' })
  @ApiForbiddenResponse({ description: 'Token authorization required' })
  @ApiBadRequestResponse({ description: 'Id provided not exist' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return this.moviesService.findOne(id);
  }

  @ApiOkResponse({ description: 'Movie updated successfully' })
  @ApiForbiddenResponse({ description: 'Token authorization required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new PatchValidationPipe()) patchMovieDto: PatchMovieDto,
  ): Promise<Movie> {
    return this.moviesService.updateOne(id, patchMovieDto);
  }

  @ApiNoContentResponse({ description: 'Movie deleted successfully' })
  @ApiBadRequestResponse({
    description:
      'Id provided not found to be deleted or the movie has been rented',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.moviesService.removeOne(id);
  }

  @ApiTags('Movies - Poster')
  @ApiOkResponse({ description: 'Poster attached to the movie correctly' })
  @ApiNotFoundResponse({ description: 'Not found movie' })
  @ApiForbiddenResponse({ description: 'Token authorization required' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: uploadPosterDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id/poster')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './posters',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadPoster(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) movieId: number,
  ): Promise<Movie> {
    return this.moviesService.updateOne(movieId, {
      posterUrl: file.filename,
    });
  }

  @ApiTags('Movies - Poster')
  @ApiOkResponse({ description: 'Poster movie retrieved successfully' })
  @ApiBadRequestResponse({ description: 'Invalid id provided for a movie' })
  @ApiForbiddenResponse({ description: 'Token authorization required' })
  @Get(':id/poster')
  async getPoster(@Param('id', ParseIntPipe) movieId: number, @Res() res) {
    const movie = await this.moviesService.findOne(movieId);
    if (movie.posterUrl === 'NO_DEFINED')
      throw new NotFoundException('This movie doesnt have a poster');
    return res.sendFile(movie.posterUrl, { root: './posters' });
  }
}
