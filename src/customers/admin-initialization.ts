import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    private readonly configService: ConfigService,
  ) {}
  async onModuleInit() {
    console.log(`The module has been initialized.`);
    const admins = await this.customersRepository.find({ isAdmin: true });
    if (admins.length > 0) {
      console.log('There is at least an admin created');
      return;
    }
    const admin = new Customer();
    admin.fullName = this.configService.get<string>('SUPER_ADMIN_NAME');
    admin.email = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    admin.password = this.configService.get<string>('SUPER_ADMIN_PASSWORD');
    admin.isAdmin = true;
    this.customersRepository.save(admin);
    console.log('Default admin created, change password as soon as possible');
  }
}
