import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  tagId: number;

  @Column({ unique: true })
  title: string;
}
