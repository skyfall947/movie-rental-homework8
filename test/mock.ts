import { CreateCustomerDto } from 'src/customers/dto/create-customer.dto';
import { CustomerDto } from 'src/customers/dto/customer.dto';
import { PatchCustomerDto } from 'src/customers/dto/patch-customer.dto';
import { PutCustomerDto } from 'src/customers/dto/put-customer.dto';

// ====== Mocks to simulate DB ======
export const mockCustomers: CustomerDto[] = [
  {
    custormerId: 1,
    fullName: 'Customer 1',
    email: 'customer1@gmail.com',
    password: '$2b$10$FrJQHyQ96V3CRRespfrtRe6pE8I.65CJOyMnMqz1IPqA8rUZpJwua',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
    isAdmin: false,
  },
  {
    custormerId: 2,
    fullName: 'Customer 2',
    email: 'customer2@gmail.com',
    password: '$2b$10$FrJQHyQ96V3CRRespfrtRe6pE8I.65CJOyMnMqz1IPqA8rUZpJwua',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
    isAdmin: false,
  },
  {
    custormerId: 3,
    fullName: 'Customer 3',
    email: 'customer3@gmail.com',
    password: '$2b$10$FrJQHyQ96V3CRRespfrtRe6pE8I.65CJOyMnMqz1IPqA8rUZpJwua',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
    isAdmin: false,
  },
  {
    custormerId: 4,
    fullName: 'Customer 4',
    email: 'customer4@gmail.com',
    password: '$2b$10$FrJQHyQ96V3CRRespfrtRe6pE8I.65CJOyMnMqz1IPqA8rUZpJwua',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
    isAdmin: false,
  },
];

export const mockCustomer: CustomerDto = {
  custormerId: 5,
  fullName: 'Customer',
  email: 'customer5@gmail.com',
  password: '$2b$10$FrJQHyQ96V3CRRespfrtRe6pE8I.65CJOyMnMqz1IPqA8rUZpJwua',
  createdAt: new Date('2021-11-20 18:51:09.48526'),
  updatedAt: new Date('2021-11-20 18:51:09.48526'),
  isAdmin: false,
};

export const mockAdmin = {
  customerId: 0,
  fullName: 'Admin',
  email: 'admin@gmail.com',
  password: '$2b$10$FrJQHyQ96V3CRRespfrtRe6pE8I.65CJOyMnMqz1IPqA8rUZpJwua',
  createdAt: new Date('2021-11-20 18:51:09.48526'),
  updatedAt: new Date('2021-11-20 18:51:09.48526'),
  isAdmin: true,
};

// ====== Mock to create on DB ======
export const mockCustomerCreate: CreateCustomerDto = {
  fullName: 'Jhon Doe',
  email: 'doe@gmail.com',
  password: 'Aa1####',
};
export const mockCustomersCreate: CreateCustomerDto[] = [
  {
    fullName: 'Customer 1',
    email: 'customer1@gmail.com',
    password: 'Aa1####',
  },
  {
    fullName: 'Customer 2',
    email: 'customer2@gmail.com',
    password: 'Aa1####',
  },
  {
    fullName: 'Customer 3',
    email: 'customer3@gmail.com',
    password: 'Aa1####',
  },
  {
    fullName: 'Customer 4',
    email: 'customer4@gmail.com',
    password: 'Aa1####',
  },
];
// ====== Mock to update on DB ======
export const mockCustomerPut: PutCustomerDto = {
  fullName: 'Benjamin',
  email: 'benjamin@gmail.com',
  password: 'Aa1####456',
};

export const mockCustomerPatch: PatchCustomerDto = {
  email: 'miguelbenjamin@gmail.com',
};
