import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { PatchValidationPipe } from './customers.pipe';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { PutCustomerDto } from './dto/put-customer.dto';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async getCustomers(): Promise<Customer[]> {
    return this.customersService.getAll();
  }

  @Get(':id')
  async getCustomerById(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCustomer(@Body() customer: CreateCustomerDto) {
    return this.customersService.insertOne(customer);
  }

  @Patch(':id')
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body(new PatchValidationPipe()) customer: PatchCustomerDto,
  ): Promise<Customer> {
    return this.customersService.updateOne(id, customer);
  }

  @Put(':id')
  async updateAllCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() customer: PutCustomerDto,
  ) {
    return this.customersService.updateOne(id, customer);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.removeOne(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleleteAllCustomers() {
    return this.customersService.removeAll();
  }
}
