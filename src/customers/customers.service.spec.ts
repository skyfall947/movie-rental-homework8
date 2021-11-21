import { createMock } from '@golevelup/nestjs-testing';
import { DeepMocked } from '@golevelup/nestjs-testing/lib/mocks';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';

describe('CustomersService', () => {
  let service: CustomersService;
  let mockRepository: DeepMocked<Repository<Customer>>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: createMock<Repository<Customer>>(),
        },
      ],
    }).compile();
    service = module.get<CustomersService>(CustomersService);
    mockRepository = module.get(getRepositoryToken(Customer));
  });

  it('the service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have the repo mocked', () => {
    expect(typeof mockRepository.find).toBe('function');
  });
});
