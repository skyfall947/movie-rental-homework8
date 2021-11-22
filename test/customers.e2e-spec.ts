import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  mockCustomerCreate,
  mockCustomerPatch,
  mockCustomerPut,
  mockCustomersCreate,
} from './mock';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../src/customers/entities/customer.entity';
import { CustomersModule } from '../src/customers/customers.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let customerId;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CustomersModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'atencio',
          password: 'atencio123',
          database: 'movies_test',
          entities: [Customer],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await request(app.getHttpServer()).delete('/customers');
  });

  afterAll(async () => {
    // create dumb data on movies_test
    await Promise.all(
      mockCustomersCreate.map((customer) => {
        return request(app.getHttpServer()).post(`/customers`).send(customer);
      }),
    );
    await app.close();
  });

  describe('CustomersModule', () => {
    it('/customers (POST) CREATED', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .send(mockCustomerCreate)
        .expect(HttpStatus.CREATED);
      const newCustomer = response.body;
      expect(newCustomer.email).toBe(mockCustomerCreate.email);
      customerId = newCustomer.customerId;
    });

    it('/customers (POST) BAD REQUEST duplicated email', async () => {
      await request(app.getHttpServer())
        .post('/customers')
        .send(mockCustomerCreate)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('/customers (POST) CREATED', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .send(mockCustomersCreate[0])
        .expect(HttpStatus.CREATED);
      const newCustomer = response.body;
      expect(newCustomer.email).toBe(mockCustomersCreate[0].email);
    });

    it('/customers (GET) OK 2 customers on DB', async () => {
      const response = await request(app.getHttpServer())
        .get('/customers')
        .expect(HttpStatus.OK);
      expect(response.body).toHaveLength(2);
    });
  });

  it('/customers (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/customers/${customerId}`)
      .send(mockCustomerPut)
      .expect(HttpStatus.OK);
    const updatedCustomer = response.body;
    expect(updatedCustomer.email).toBe(mockCustomerPut.email);
    expect(updatedCustomer.fullName).toBe(mockCustomerPut.fullName);
  });

  it('/customers (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/customers/${customerId}`)
      .send(mockCustomerPatch)
      .expect(HttpStatus.OK);
    const updatedCustomer = response.body;
    expect(updatedCustomer.email).toBe(mockCustomerPatch.email);
  });

  it('/customers (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/customers/${customerId}`)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('/customers (GET) OK 1 customers on DB', async () => {
    const response = await request(app.getHttpServer())
      .get('/customers')
      .expect(HttpStatus.OK);
    expect(response.body).toHaveLength(1);
  });
});

//it('', async()=> {})
