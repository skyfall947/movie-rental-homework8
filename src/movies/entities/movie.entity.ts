import { Customer } from 'src/customers/entities/customer.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  movieId: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ default: 'NO_DEFINED' })
  poster: string;
  @Column()
  trailerUrl: string;
  @Column()
  price: number;
  @Column({ default: 0 })
  likes: number;
  @Column()
  availability: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer: Customer;
}
