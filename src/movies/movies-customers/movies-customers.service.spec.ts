import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from '../../customers/customers.service';
import { Customer } from '../../customers/entities/customer.entity';
import { Movie } from '../entities/movie.entity';
import { MoviesCustomersService } from './movies-customers.service';

describe('MoviesService', () => {
  let moviesCustomersService: MoviesCustomersService;
  let moviesRepository: Repository<Movie>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesCustomersService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: CustomersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(new Customer()),
          },
        },
      ],
    }).compile();

    moviesCustomersService = moduleRef.get<MoviesCustomersService>(
      MoviesCustomersService,
    );
    moviesRepository = moduleRef.get<Repository<Movie>>(
      getRepositoryToken(Movie),
    );
  });

  it('the service should be defined', () => {
    expect(moviesCustomersService).toBeDefined();
  });

  describe('getRentedMovies()', () => {
    const customerId = 1;
    const movie = new Movie();
    const movie2 = new Movie();
    const customer = new Customer();
    const customer2 = new Customer();
    customer.customerId = customerId;
    customer2.customerId = customerId + 1;
    movie.renters = [customer, customer2];
    movie2.renters = [customer];
    const moviesRentedByUser = [movie, movie2];
    it('should return movies rented by the customerId', async () => {
      const createQueryBuilder: any = {
        innerJoinAndSelect: () => createQueryBuilder,
        where: () => createQueryBuilder,
        execute: () => moviesRentedByUser,
      };
      const repoSpy = jest
        .spyOn(moviesRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      const result = await moviesCustomersService.getMoviesRented(customerId);
      expect(result).toHaveLength(2);
      expect(repoSpy).toHaveBeenCalledWith('movie');
    });
  });
});
