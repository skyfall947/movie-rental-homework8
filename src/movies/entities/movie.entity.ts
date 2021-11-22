import { Customer } from 'src/customers/entities/customer.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  movieId: number;
  @Column({ unique: true })
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
  @Column({ default: 0 })
  stock: number;

  @ManyToMany(() => Customer)
  @JoinTable()
  renters: Customer[];

  @ManyToMany(() => Customer)
  @JoinTable()
  buyers: Customer[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
