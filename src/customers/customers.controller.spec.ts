import { Test, TestingModule } from '@nestjs/testing';
import {
  mockCustomer,
  mockCustomerCreate,
  mockCustomers,
} from '../../test/mocks/customers-mock';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { PutCustomerDto } from './dto/put-customer.dto';

describe('CustomersController', () => {
  let controller: CustomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            insertOne: jest
              .fn()
              .mockImplementation((customer: CreateCustomerDto) =>
                Promise.resolve({
                  customerId: 1,
                  ...customer,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }),
              ),
            findOne: jest
              .fn()
              .mockImplementation((id: number) =>
                Promise.resolve({ customerId: id, ...mockCustomer }),
              ),
            getAll: jest.fn().mockResolvedValue(mockCustomers),
            updateOne: jest
              .fn()
              .mockImplementation(
                (id: number, customer: PutCustomerDto | PatchCustomerDto) =>
                  Promise.resolve({ id, ...customer, updatedAt: new Date() }),
              ),
            deleteOne: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCustomers', () => {
    it('should get an array of customers', async () => {
      await expect(controller.getCustomers()).resolves.toEqual(mockCustomers);
    });
  });

  describe('getCustomerById', () => {
    it('should get a customer given an id', async () => {
      const id = 1;
      await expect(controller.getCustomerById(id)).resolves.toEqual({
        customerId: id,
        ...mockCustomer,
      });
    });

    describe('createCustomer', () => {
      it('should create a new customer and return the created one', async () => {
        await expect(
          controller.createCustomer(mockCustomerCreate),
        ).resolves.toMatchObject({
          customerId: 1,
          ...mockCustomerCreate,
        });
      });
    });
  });
});
