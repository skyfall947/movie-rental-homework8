import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            insertOne: jest.fn(),
            findOne: jest.fn(),
            getAll: jest.fn(),
            updateOne: jest.fn(),
            removeOne: jest.fn(),
            removeAll: jest.fn(),
            rentMovie: jest.fn(),
            unRentMovie: jest.fn(),
            saleMovie: jest.fn(),
            tagMovie: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
