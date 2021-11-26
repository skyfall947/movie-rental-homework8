import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { movieToCreate } from '../../test/mocks/movies-mock';
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
            save: jest.fn().mockResolvedValue(new Movie()),
            findOneOrFail: jest.fn().mockImplementation(async (conditions) => {
              if (conditions.movieId == -1) throw new NotFoundException();
              return new Movie();
            }),
            find: jest.fn().mockResolvedValue([new Movie()]),
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
        Movie,
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

  describe('getAll()', () => {
    it('should return all movies available', () => {
      expect(moviesService.getAll()).resolves.toHaveLength(1);
      // expect()
    });
  });
});
