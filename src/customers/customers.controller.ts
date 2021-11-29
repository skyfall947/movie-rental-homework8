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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { PatchValidationPipe } from './customers.pipe';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { PutCustomerDto } from './dto/put-customer.dto';
import { Customer } from './entities/customer.entity';

@ApiTags('Customer')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOkResponse({ description: 'Customers retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth should be provied' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Get()
  async getCustomers(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @ApiOkResponse({ description: 'Customer retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth should be provied' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOkResponse({ description: 'Customer retrieved successfully' })
  @Get(':id')
  getCustomerById(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @ApiCreatedResponse({ description: 'Customer created successfully' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCustomer(@Body() customer: CreateCustomerDto) {
    return this.customersService.insertOne(customer);
  }

  @ApiOkResponse({ description: 'Customer updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth should be provied' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Patch(':id')
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body(new PatchValidationPipe()) customer: PatchCustomerDto,
    @Req() req,
  ): Promise<CustomerDto> {
    if (req.user.id !== id && !req.user.roles?.includes(Role.Admin)) {
      throw new ForbiddenException(
        'The customer data can only be managed by the customer it self',
      );
    }
    return this.customersService.updateOne(id, customer, req.user.roles);
  }

  @ApiOkResponse({ description: 'Customer updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth should be provied' })
  @ApiBadRequestResponse({ description: 'All properties are required' })
  @ApiForbiddenResponse({
    description: 'Customer data can only be managed by the owner customer',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateAllCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() customer: PutCustomerDto,
    @Req() req,
  ): Promise<CustomerDto> {
    if (req.user.id !== id) {
      throw new ForbiddenException(
        'The customer data can only be managed by the customer it self',
      );
    }
    return this.customersService.updateOne(id, customer);
  }

  @ApiNoContentResponse({ description: 'Customer removed successfully' })
  @ApiNotFoundResponse({ description: 'Id provided not found' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth should be provied' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Delete(':id')
  async deleteCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<UpdateResult> {
    if (req.user.id !== id) {
      throw new ForbiddenException(
        'The customer data can only be managed by the customer it self',
      );
    }
    return this.customersService.removeOne(id);
  }
}
