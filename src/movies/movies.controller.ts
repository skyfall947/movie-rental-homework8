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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { editFileName, imageFileFilter } from '../common/utils/image-utils';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PatchMovieDto } from './dto/patch-movie.dto';
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
  findAll(@Query('sorted') sorted: boolean): Promise<Movie[]> {
    return this.moviesService.getAll(sorted);
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
