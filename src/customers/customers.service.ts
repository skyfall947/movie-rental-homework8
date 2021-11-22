import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from './entities/customer.entity';
import { CRUD } from 'src/common/interfaces/crud.interface';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';

@Injectable()
export class CustomersService implements CRUD {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async insertOne(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = this.customerRepository.create({
        ...createCustomerDto,
        isAdmin: false,
      });
      await customer.save();
      return this.findOne(customer.customerId);
    } catch (error) {
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async findOne(id: number) {
    return await this.customerRepository.findOne(id);
  }

  async getAll(_sorted: boolean, perPage = 10, page = 1): Promise<any> {
    const skip = perPage * page - perPage;
    return await this.customerRepository.find({
      take: perPage,
      skip,
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

  async removeAll(): Promise<void> {
    return await this.customerRepository.clear();
  }

  async getOneByEmail(email: string): Promise<Customer> {
    const customer = await Customer.findByEmail(email);
    if (!customer) throw new NotFoundException(`User with ${email} not found`);
    return customer;
  }
}
