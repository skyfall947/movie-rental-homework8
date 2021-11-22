import { Movie } from 'src/movies/entities/movie.entity';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  tagId: number;

  @Column({ unique: true })
  title: string;
}
