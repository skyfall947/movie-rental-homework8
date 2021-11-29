import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  moviesToSortByTitle,
  movieToCreate,
  sortedMoviesLikesAsc,
  sortedMoviesTitleAsc,
  unsortedMoviesLikes,
  unsortedMoviesTitle,
} from '../../test/mocks/movies-mock';
import { MovieDto } from './dto/movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let moviesRepository: Repository<Movie>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            save: jest.fn().mockResolvedValue(new MovieDto()),
            findOneOrFail: jest.fn().mockImplementation(async (conditions) => {
              if (conditions.movieId === -1) throw new NotFoundException();
              return new Movie();
            }),
            find: jest.fn().mockResolvedValue([new MovieDto()]),
            // updateOne: jest.fn(),
            // removeOne: jest.fn(),
          },
        },
      ],
    }).compile();

    moviesService = moduleRef.get<MoviesService>(MoviesService);
    moviesRepository = moduleRef.get<Repository<Movie>>(
      getRepositoryToken(Movie),
    );
  });

  it('the service should be defined', () => {
    expect(moviesService).toBeDefined();
  });

  describe('insertOne()', () => {
    it('should create a new movie', () => {
      expect(moviesService.insertOne(movieToCreate)).resolves.toBeInstanceOf(
        MovieDto,
      );
      expect(moviesRepository.save).toBeCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a movie', () => {
      const customerId = 1;
      expect(moviesService.findOne(customerId)).resolves.toBeInstanceOf(Movie);
      expect(moviesRepository.findOneOrFail).toBeCalledWith(
        {
          movieId: customerId,
          availability: true,
        },
        { relations: ['tags'] },
      );
    });

    it('should throw a Not Found exception', () => {
      const customerId = -1;
      expect(moviesService.findOne(customerId)).rejects.toThrow(
        new NotFoundException(),
      );
      expect(moviesRepository.findOneOrFail).toBeCalledWith(
        {
          movieId: customerId,
          availability: true,
        },
        { relations: ['tags'] },
      );
    });
  });

  describe('findAll()', () => {
    it('should return movies filtered by title and availability', () => {
      expect(moviesService.findAll(true, 'avengers')).resolves.toHaveLength(1);
      expect(moviesRepository.find).toBeCalled();
    });
  });

  describe('sortByTitle()', () => {
    it('should sort a list of movies by title', () => {
      expect(
        moviesService.sortByTitle(unsortedMoviesTitle as Movie[], false),
      ).toEqual(sortedMoviesTitleAsc);
    });
  });

  describe('sortByLikes()', () => {
    it('should sort a list of movies by likes', () => {
      expect(
        moviesService.sortByLikes(unsortedMoviesLikes as Movie[], false),
      ).toEqual(sortedMoviesLikesAsc);
    });
  });

  describe('filterByTags()', () => {
    const tags = ['comedy', 'action'];
    it('should filter movies of a given list of tags', () => {
      expect(
        moviesService.filterByTags(moviesToSortByTitle as any[], tags),
      ).toEqual([moviesToSortByTitle[0]]);
    });
    it('should return all movies if an empty list of tags is given', () => {
      expect(
        moviesService.filterByTags(moviesToSortByTitle as any[], []),
      ).toEqual(moviesToSortByTitle);
    });
  });
});
