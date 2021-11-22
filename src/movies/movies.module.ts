import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesCustomersController } from './movies-cutomers.controller';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), CustomersModule],
  controllers: [MoviesController, MoviesCustomersController],
  providers: [MoviesService],
})
export class MoviesModule {}
