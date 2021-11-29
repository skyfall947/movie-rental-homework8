import { Test, TestingModule } from '@nestjs/testing';
import { MovieDto } from './dto/movie.dto';
import { MovieQueries } from './dto/query-movie.dto';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([new MovieDto()]),
            sortByTitle: jest.fn().mockResolvedValue([new MovieDto()]),
            sortByLikes: jest.fn().mockResolvedValue([new MovieDto()]),
            filterByTags: jest.fn().mockResolvedValue([new MovieDto()]),
          },
        },
      ],
    }).compile();

    moviesController = moduleRef.get<MoviesController>(MoviesController);
    moviesService = moduleRef.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(moviesController).toBeDefined();
  });

  describe('findAll()', () => {
    it('should retrieve a list of movies', () => {
      const queries: MovieQueries = {
        sort: 'title,likes',
        title: 'avengers',
        available: true,
        tags: 'comedy,action',
      };
      expect(moviesController.findAll(queries)).resolves.toHaveLength(1);
      expect(moviesService.findAll).toBeCalledWith(
        queries.available,
        queries.title,
      );
    });
  });
});
