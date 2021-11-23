import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesCustomersController } from './movies-customers/movies-cutomers.controller';
import { CustomersModule } from '../customers/customers.module';
import { TagsModule } from '../tags/tags.module';
import { MoviesCustomersService } from './movies-customers/movies-customers.service';
import { MoviesTagsService } from './movies-tags/movies-tags.service';
import { MoviesTagsController } from './movies-tags/movies-tags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), CustomersModule, TagsModule],
  controllers: [
    MoviesController,
    MoviesCustomersController,
    MoviesTagsController,
  ],
  providers: [MoviesService, MoviesCustomersService, MoviesTagsService],
})
export class MoviesModule {}
