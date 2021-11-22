import * as bcrypt from 'bcrypt';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  customerId: number;

  @Column()
  fullName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static findByEmail(email: string) {
    return Customer.createQueryBuilder()
      .select(['Customer.email', 'Customer.customerId'])
      .addSelect('Customer.password')
      .where('Customer.email = :email', { email })
      .getOne();
  }

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }

  @BeforeUpdate()
  async setPasswordUpdated(password: string) {
    if (!this.password) return;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
