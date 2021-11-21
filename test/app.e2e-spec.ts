import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { mockCustomerCreate } from './modules/customers/mock';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../src/customers/entities/customer.entity';
import { CustomersModule } from '../src/customers/customers.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('CustomersModule', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).delete('/customers');
    });

    it('/customers (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .send(mockCustomerCreate)
        .expect(HttpStatus.CREATED);
      const newCustomer = response.body;
      expect(newCustomer).toMatchObject(mockCustomerCreate);
    });
  });
});
