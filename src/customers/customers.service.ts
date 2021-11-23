import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { CRUD } from '../common/interfaces/crud.interface';

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
      return this.findOne(customerSaved.customerId);
    } catch (error) {
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async findOne(id: number) {
    return await this.customerRepository.findOneOrFail(id);
  }

  async getAll(): Promise<Customer[]> {
    return await this.customerRepository.find({
      where: { isAdmin: false },
    });
  }

  async updateOne(
    id: number,
    updateCustomerDto: UpdateCustomerDto | PatchCustomerDto,
  ): Promise<Customer> {
    try {
      const customer = await this.customerRepository.preload({
        customerId: id,
        ...updateCustomerDto,
        isAdmin: false,
      });
      await customer.save();
      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(
        error.detail || 'A customer with the id provided not exist',
      );
    }
  }

  async removeOne(id: number): Promise<void> {
    try {
      const customer = await this.customerRepository.findOneOrFail(id);
      await this.customerRepository.remove(customer);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOneByEmail(email: string): Promise<Customer> {
    const customer = await Customer.findByEmail(email);
    if (!customer) throw new NotFoundException(`User with ${email} not found`);
    return customer;
  }
}
