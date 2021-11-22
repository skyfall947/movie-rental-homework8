import { hashSync } from 'bcrypt';
import {
  BaseEntity,
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

  @Column({
    transformer: {
      to(password: string): string {
        return hashSync(password, 10);
      },
      from(hash: string): string {
        return hash;
      },
    },
  })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
