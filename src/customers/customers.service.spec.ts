import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import {
  customerToCreate,
  customerToUpdate,
} from '../../test/mocks/customers-mock';
import { Role } from '../auth/role.enum';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { Customer } from './entities/customer.entity';

describe('CustomersService', () => {
  let customersService: CustomersService;
  let customerRepository: Repository<Customer>;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            save: jest.fn().mockResolvedValue(new Customer()),
            findOneOrFail: jest.fn().mockImplementation(async (id: number) => {
              if (id === -1) throw new NotFoundException();
              return new Customer();
            }),
            find: jest.fn().mockResolvedValue([new Customer()]),
            preload: jest.fn().mockResolvedValue(new Customer()),
            softDelete: jest.fn().mockReturnValue(new UpdateResult()),
          },
        },
      ],
    }).compile();
    customersService = moduleRef.get<CustomersService>(CustomersService);
    customerRepository = moduleRef.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
  });

  it('the service should be defined', () => {
    expect(customersService).toBeDefined();
  });

  describe('insertOne()', () => {
    it('should create a customer', () => {
      const repoSpy = jest.spyOn(customerRepository, 'save');
      expect(
        customersService.insertOne(customerToCreate),
      ).resolves.toBeInstanceOf(CustomerDto);
      expect(repoSpy).toBeCalledWith<CreateCustomerDto[]>(
        expect.objectContaining<CreateCustomerDto>(customerToCreate),
      );
    });
  });

  describe('findOne()', () => {
    it('should return a customer', () => {
      const customerId = 1;
      const repoSpy = jest.spyOn(customerRepository, 'findOneOrFail');
      expect(customersService.findOne(customerId)).resolves.toBeInstanceOf(
        CustomerDto,
      );
      expect(repoSpy).toBeCalledWith(customerId, {
        where: { isAdmin: false },
      });
    });

    it('should return a Not Found exception if the id not exists on DB', () => {
      const customerId = -1;
      const repoSpy = jest.spyOn(customerRepository, 'findOneOrFail');
      expect(customersService.findOne(customerId)).rejects.toThrow(
        new NotFoundException(),
      );
      expect(repoSpy).toBeCalledWith(customerId, {
        where: { isAdmin: false },
      });
    });
  });

  describe('getAll()', () => {
    it('should get all customers', () => {
      const repoSpy = jest.spyOn(customerRepository, 'find');
      expect(customersService.findAll()).resolves.toHaveLength(1);
      expect(repoSpy).toBeCalledWith({
        select: ['customerId', 'fullName', 'email'],
        where: { isAdmin: false },
      });
    });
  });

  describe('updateOne()', () => {
    it('should updated a customer', () => {
      const customerId = 1;
      const repoSpy = jest.spyOn(customerRepository, 'preload');
      expect(
        customersService.updateOne(customerId, customerToUpdate, [Role.User]),
      ).resolves.toBeDefined();
      expect(repoSpy).toBeCalledWith({
        customerId,
        ...customerToUpdate,
      });
    });
  });

  describe('removeOne()', () => {
    it('should remove a customer', () => {
      const customerId = 1;
      const repoSpy = jest.spyOn(customerRepository, 'softDelete');
      expect(customersService.removeOne(customerId)).resolves.toBeInstanceOf(
        UpdateResult,
      );
      expect(repoSpy).toBeCalledWith<number[]>(customerId);
    });
  });

  describe('getOneByEmail()', () => {
    it('should return a customer with password', () => {
      const customerEmail = 'customer@gmail.com';
      const spyCustomer = jest
        .spyOn(Customer, 'findByEmail')
        .mockImplementation(async () => {
          const customer = new Customer();
          customer.password = '123';
          return customer;
        });
      expect(
        customersService.getOneByEmail(customerEmail),
      ).resolves.toHaveProperty('password');
      expect(spyCustomer).toBeCalledWith<string[]>(customerEmail);
    });

    it('should throw a Not Found exception', () => {
      const customerEmail = 'invalidEmail';
      const spyCustomer = jest
        .spyOn(Customer, 'findByEmail')
        .mockImplementation(async (email: string) => {
          throw new NotFoundException(`User with ${email} not found`);
        });
      expect(customersService.getOneByEmail(customerEmail)).rejects.toThrow(
        new NotFoundException(`User with ${customerEmail} not found`),
      );
      expect(spyCustomer).toBeCalledWith<string[]>(customerEmail);
    });
  });
});
