import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PatchValidationPipe } from './customers.pipe';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body(new PatchValidationPipe()) customer: PatchCustomerDto,
    @Req() req,
  ): Promise<CustomerDto> {
    if (req.user.id != id) {
      throw new ForbiddenException(
        'The customer data can only be managed by the customer it self',
      );
    }
    return this.customersService.updateOne(id, customer);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateAllCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() customer: PutCustomerDto,
    @Req() req,
  ): Promise<CustomerDto> {
    if (req.user.id != id) {
      throw new ForbiddenException(
        'The customer data can only be managed by the customer it self',
      );
    }
    return this.customersService.updateOne(id, customer);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<UpdateResult> {
    if (req.user.id != id) {
      throw new ForbiddenException(
        'The customer data can only be managed by the customer it self',
      );
    }
    return this.customersService.removeOne(id);
  }
}
