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
  UseInterceptors,
  UploadedFile,
  Res,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/common/utils/image-utils';

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

  @Post(':id/upload-poster')
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
    console.log(file);
    return await this.moviesService.updateOne(movieId, {
      posterUrl: file.filename,
    });
  }

  @Get('poster/:img')
  async getPoster(@Param('img') img: string, @Res() res) {
    return res.sendFile(img, { root: './posters' });
  }

  @Delete()
  async removeAll(): Promise<void> {
    return await this.moviesService.removeAll();
  }
}
