import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateResult } from 'typeorm';
import {
  customerToCreate,
  customerToPatch,
  customerToUpdate,
} from '../../test/mocks/customers-mock';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { PutCustomerDto } from './dto/put-customer.dto';
import { Customer } from './entities/customer.entity';

describe('CustomersController', () => {
  let customersController: CustomersController;
  let customersService: CustomersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            insertOne: jest.fn().mockResolvedValue(new CustomerDto()),
            findOne: jest.fn().mockResolvedValue(new Customer()),
            findAll: jest.fn().mockResolvedValue([new Customer()]),
            updateOne: jest.fn().mockResolvedValue(new CustomerDto()),
            removeOne: jest.fn().mockResolvedValue(new UpdateResult()),
          },
        },
      ],
    }).compile();

    customersController = module.get<CustomersController>(CustomersController);
    customersService = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(customersController).toBeDefined();
  });

  describe('getCustomers()', () => {
    it('should return an array of customers', () => {
      expect(customersController.getCustomers()).resolves.toHaveLength(1);
      expect(customersService.findAll).toBeCalled();
    });
  });

  describe('getCustomerById()', () => {
    it('should return a customer', () => {
      const customerId = 1;
      expect(
        customersController.getCustomerById(customerId),
      ).resolves.toBeInstanceOf(Customer);
      expect(customersService.findOne).toBeCalledWith<number[]>(customerId);
    });
  });

  describe('createCustomer()', () => {
    it('should return a new customer', () => {
      expect(
        customersController.createCustomer(customerToCreate),
      ).resolves.toBeInstanceOf(CustomerDto);
      expect(customersService.insertOne).toBeCalledWith<CreateCustomerDto[]>(
        customerToCreate,
      );
    });
  });

  describe('updateCustomer()', () => {
    it('should return a customer patched', () => {
      const customerId = 1;
      expect(
        customersController.updateCustomer(customerId, customerToPatch, {
          user: { id: customerId },
        }),
      ).resolves.toBeInstanceOf(CustomerDto);
      expect(customersService.updateOne).toBeCalledWith(
        customerId,
        expect.objectContaining<PatchCustomerDto>(customerToPatch),
      );
    });

    it('should throw a ForbiddenException', () => {
      const customerId = 1;
      expect(
        customersController.updateCustomer(customerId, customerToPatch, {
          user: { id: customerId + 1 },
        }),
      ).rejects.toThrow(
        new ForbiddenException(
          'The customer data can only be managed by the customer it self',
        ),
      );
      expect(customersService.updateOne).not.toBeCalled();
    });
  });

  describe('updateAllCustomer()', () => {
    it('should return a customer updated', () => {
      const customerId = 1;
      expect(
        customersController.updateAllCustomer(customerId, customerToUpdate, {
          user: { id: customerId },
        }),
      ).resolves.toBeInstanceOf(CustomerDto);
      expect(customersService.updateOne).toBeCalledWith(
        customerId,
        expect.objectContaining<PutCustomerDto>(customerToUpdate),
      );
    });

    it('should throw a ForbiddenException', () => {
      const customerId = 1;
      expect(
        customersController.updateAllCustomer(customerId, customerToUpdate, {
          user: { id: customerId + 1 },
        }),
      ).rejects.toThrow(
        new ForbiddenException(
          'The customer data can only be managed by the customer it self',
        ),
      );
      expect(customersService.updateOne).not.toBeCalled();
    });
  });

  describe('deleteCustomer()', () => {
    it('should remove a customer of visible customers', () => {
      const customerId = 1;
      expect(
        customersController.deleteCustomer(customerId, {
          user: { id: customerId },
        }),
      ).resolves.toBeInstanceOf(UpdateResult);
      expect(customersService.removeOne).toBeCalledWith<number[]>(customerId);
    });

    it('should throw a ForbiddenException', () => {
      const customerId = 1;
      expect(
        customersController.deleteCustomer(customerId, {
          user: { id: customerId + 1 },
        }),
      ).rejects.toThrow(
        new ForbiddenException(
          'The customer data can only be managed by the customer it self',
        ),
      );
      expect(customersService.removeOne).not.toBeCalled();
    });
  });
});
