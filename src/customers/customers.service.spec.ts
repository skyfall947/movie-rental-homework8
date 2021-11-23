import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  customerDb,
  customersDb,
  customerToCreate,
  customerUpdateDb,
} from '../../test/mocks/customers-mock';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: Repository<Customer>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(customerDb),
            save: jest.fn().mockResolvedValue(customerDb),
            find: jest.fn().mockResolvedValue(customersDb),
            preload: jest.fn().mockResolvedValue(customerUpdateDb),
          },
        },
      ],
    }).compile();
    service = module.get<CustomersService>(CustomersService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('the service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('insertOne()', () => {
    it('should create a customer', () => {
      const repoSpy = jest.spyOn(repository, 'save');
      expect(service.insertOne(customerToCreate)).resolves.toMatchObject(
        customerDb,
      );
      expect(repoSpy).toBeCalledWith(
        expect.objectContaining<CreateCustomerDto>(customerToCreate),
      );
    });
  });

  describe('findOne()', () => {
    it('should return a customer', () => {
      const repoSpy = jest.spyOn(repository, 'findOneOrFail');
      expect(service.findOne(1)).resolves.toEqual(customerDb);
      expect(repoSpy).toBeCalledWith(1);
    });
  });

  describe('getAll()', () => {
    it('should get all customers', () => {
      const repoSpy = jest.spyOn(repository, 'find');
      expect(service.getAll()).resolves.toEqual(customersDb);
      expect(repoSpy).toBeCalledWith({ where: { isAdmin: false } });
    });
  });
});
