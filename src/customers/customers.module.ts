import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { AdminService } from './admin-initialization';

@Module({
  controllers: [CustomersController],
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [AdminService, CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
