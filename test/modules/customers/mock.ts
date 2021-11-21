import { CreateCustomerDto } from 'src/customers/dto/create-customer.dto';
import { CustomerDto } from 'src/customers/dto/customer.dto';
import { PatchCustomerDto } from 'src/customers/dto/patch-customer.dto';
import { PutCustomerDto } from 'src/customers/dto/put-customer.dto';

export const mockCustomers: CustomerDto[] = [
  {
    custormerId: 1,
    fullName: 'Customer 1',
    email: 'customer1@gmail.com',
    password: '$2b$10$FrJQHyQ96V3CRRespfrtRe6pE8I.65CJOyMnMqz1IPqA8rUZpJwua',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
  },
  {
    custormerId: 2,
    fullName: 'Customer 2',
    email: 'customer2@gmail.com',
    password: '$2b$10$FrJQHyQ96V3CRRespfrtRe6pE8I.65CJOyMnMqz1IPqA8rUZpJwua',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
  },
  {
    custormerId: 3,
    fullName: 'Customer 3',
    email: 'customer3@gmail.com',
    password: '$2b$10$FrJQHyQ96V3CRRespfrtRe6pE8I.65CJOyMnMqz1IPqA8rUZpJwua',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
  },
  {
    custormerId: 4,
    fullName: 'Customer 4',
    email: 'customer4@gmail.com',
    password: '$2b$10$FrJQHyQ96V3CRRespfrtRe6pE8I.65CJOyMnMqz1IPqA8rUZpJwua',
    createdAt: new Date('2021-11-20 18:51:09.48526'),
    updatedAt: new Date('2021-11-20 18:51:09.48526'),
  },
];

export const mockCustomer: CustomerDto = {
  custormerId: 0,
  fullName: 'Customer',
  email: 'customer@gmail.com',
  password: '$2b$10$FrJQHyQ96V3CRRespfrtRe6pE8I.65CJOyMnMqz1IPqA8rUZpJwua',
  createdAt: new Date('2021-11-20 18:51:09.48526'),
  updatedAt: new Date('2021-11-20 18:51:09.48526'),
};

export const mockCustomerCreate: CreateCustomerDto = {
  fullName: 'Miguel',
  email: 'miguel@gmail.com',
  password: 'Aa1####',
};

export const mockCustomerUpdate: PutCustomerDto = {
  fullName: 'Benjamin',
  email: 'benjamin@gmail.com',
  password: 'Aa1####',
};

export const mockCustomerPatch: PatchCustomerDto = {
  email: 'miguelbenjamin@gmail.com',
};
