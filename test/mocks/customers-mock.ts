import { CreateCustomerDto } from '../../src/customers/dto/create-customer.dto';
import { CustomerDto } from '../../src/customers/dto/customer.dto';
import { PatchCustomerDto } from '../../src/customers/dto/patch-customer.dto';
import { PutCustomerDto } from '../../src/customers/dto/put-customer.dto';

// ====== Mock to create on DB ======
export const customerToCreate: CreateCustomerDto = {
  fullName: 'Customer 1',
  email: 'customer1@gmail.com',
  password: 'Aa1####',
};

// ====== Mocks to simulate DB ======
export const customerDb: CustomerDto = {
  customerId: 1,
  fullName: 'Customer 1',
  email: 'customer1@gmail.com',
  createdAt: new Date('2021-11-20 18:51:09.48526'),
  updatedAt: new Date('2021-11-20 18:51:09.48526'),
  isAdmin: false,
};

// ====== Mock to update on DB ======
export const customerToUpdate: PutCustomerDto = {
  fullName: 'CUSTOMER 1',
  email: 'CUSTOMER@gmail.com',
  password: 'Aa1####456',
};

export const customerUpdateDb: CustomerDto = {
  customerId: 1,
  fullName: 'CUSTOMER 1',
  email: 'CUSTOMER@gmail.com',
  createdAt: new Date('2021-11-20 18:51:09.48526'),
  updatedAt: new Date('2021-11-20 18:51:09.48527'),
  isAdmin: false,
};

export const customersDb: CustomerDto[] = [
  {
    customerId: 1,
    fullName: 'Customer 1',
    email: 'customer1@gmail.com',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
    isAdmin: false,
  },
  {
    customerId: 2,
    fullName: 'Customer 2',
    email: 'customer2@gmail.com',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
    isAdmin: false,
  },
  {
    customerId: 3,
    fullName: 'Customer 3',
    email: 'customer3@gmail.com',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
    isAdmin: false,
  },
  {
    customerId: 4,
    fullName: 'Customer 4',
    email: 'customer4@gmail.com',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
    isAdmin: false,
  },
];

export const mockAdminLogin = {
  email: 'admin@gmail.com',
  password: 'Aa1####',
};

export const mockCustomerCreate2: CreateCustomerDto = {
  fullName: 'Customer 2',
  email: 'customer2@gmail.com',
  password: 'Aa1####',
};

export const mockCustomerPatch: PatchCustomerDto = {
  email: 'customerCustomer@gmail.com',
};
