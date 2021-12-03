import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { CRUD } from '../common/interfaces/crud.interface';
import { plainToClass } from 'class-transformer';
import { CustomerDto } from './dto/customer.dto';
import { Role } from '../auth/role.enum';
import { PutCustomerDto } from './dto/put-customer.dto';

@Injectable()
export class CustomersService implements CRUD {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async insertOne(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = new Customer();
      customer.isAdmin = false;
      customer.fullName = createCustomerDto.fullName;
      customer.email = createCustomerDto.email;
      customer.password = createCustomerDto.password;
      const customerSaved = await this.customerRepository.save(customer);
      return plainToClass(CustomerDto, customerSaved);
    } catch (error) {
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async findOne(id: number) {
    try {
      const customer = await this.customerRepository.findOneOrFail(id, {
        where: { isAdmin: false },
      });
      return plainToClass(CustomerDto, customer);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findOnePrivate(id: number) {
    try {
      return await this.customerRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findAll(): Promise<Customer[]> {
    const customers = await this.customerRepository.find({
      select: ['customerId', 'fullName', 'email'],
      where: { isAdmin: false },
    });
    return customers;
  }

  async updateOne(
    id: number,
    updateCustomerDto: PatchCustomerDto | PutCustomerDto,
    roles?: Role[],
  ): Promise<CustomerDto> {
    try {
      if (!roles?.includes(Role.Admin)) {
        updateCustomerDto.isAdmin = false;
      }
      const customerUpdated = await this.customerRepository.preload({
        customerId: id,
        ...updateCustomerDto,
      });
      const customerSaved = await this.customerRepository.save(customerUpdated);
      return plainToClass(CustomerDto, customerSaved);
    } catch (error) {
      throw new BadRequestException(
        error.detail || 'A customer with the id provided not exist',
      );
    }
  }

  async removeOne(id: number): Promise<UpdateResult> {
    return this.customerRepository.softDelete(id);
  }

  async getOneByEmail(email: string): Promise<Customer> {
    const customer = await Customer.findByEmail(email);
    if (!customer) throw new NotFoundException(`User with ${email} not found`);
    return customer;
  }
}
