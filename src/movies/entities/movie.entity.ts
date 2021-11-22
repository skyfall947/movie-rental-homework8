import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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
  posterUrl: string;
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
}
