import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { customerToCreate, mockCustomerCreate2 } from './mocks/customers-mock';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../src/customers/entities/customer.entity';
import { CustomersModule } from '../src/customers/customers.module';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

describe('CustomersModule', () => {
  let app: INestApplication;
  let customer;
  let customerToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CustomersModule,
        AuthModule,
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
  });

  afterAll(async () => await app.close());

  describe('/customers', () => {
    it('should create a new customer', async () => {
      customer = (
        await request(app.getHttpServer())
          .post('/customers')
          .send(customerToCreate)
          .expect(HttpStatus.CREATED)
      ).body;
      expect(customer.email).toBe(customerToCreate.email);
    });

    it('should not create a duplicated customer', async () => {
      await request(app.getHttpServer())
        .post('/customers')
        .send(customerToCreate)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should create another customer', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .send(mockCustomerCreate2)
        .expect(HttpStatus.CREATED);
      const newCustomer = response.body;
      expect(newCustomer.email).toBe(mockCustomerCreate2.email);
    });

    it('should get all customers', async () => {
      const response = await request(app.getHttpServer())
        .get('/customers')
        .expect(HttpStatus.OK);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('/auth/login', () => {
    it('should login a customer', async () => {
      customerToken = (
        await request(app.getHttpServer())
          .post('/auth/login')
          .send(customerToCreate)
          .expect(HttpStatus.OK)
      ).body;
      console.log('🚀 | it | customerToken', customerToken);
    });
  });

  // describe('/customers with Bearer', () => {
  //   it('should update all the customer', async () => {
  //     console.log('🚀 | it | customer', customer);
  //     console.log('🚀 | it | token', customerToken);
  //     const response = await request(app.getHttpServer())
  //       .put(`/customers/${customer.customerId}`)
  //       .set('Authorization', `Bearer ${customerToken}`)
  //       .send(customerToUpdate)
  //       .expect(HttpStatus.OK);
  //     const updatedCustomer = response.body;
  //     expect(updatedCustomer.email).toBe(customerToUpdate.email);
  //     expect(updatedCustomer.fullName).toBe(customerToUpdate.fullName);
  //   });
  // it('should update only the email', async () => {
  //   const originalCustomer = (
  //     await request(app.getHttpServer())
  //       .get(`/customers/${customer.customerId}`)
  //       .expect(HttpStatus.OK)
  //   ).body;
  //   const updatedCustomer = (
  //     await request(app.getHttpServer())
  //       .patch(`/customers/${customer.customerId}`)
  //       .send(mockCustomerPatch)
  //       .expect(HttpStatus.OK)
  //   ).body;
  //   expect(updatedCustomer.email).toBe(mockCustomerPatch.email);
  //   expect(originalCustomer.fullName).toBe(updatedCustomer.fullName);
  // });
  // it('should delete a customer', async () => {
  //   await request(app.getHttpServer())
  //     .delete(`/customers/${customer.customerId}`)
  //     .expect(HttpStatus.NO_CONTENT);
  // });
  // it('/customers (GET) OK 1 customers on DB', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get('/customers')
  //     .expect(HttpStatus.OK);
  //   expect(response.body).toHaveLength(1);
  // });
  // });
});
