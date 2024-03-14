import { PrimaryColumn, Column } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  updated_on: Date;
}
