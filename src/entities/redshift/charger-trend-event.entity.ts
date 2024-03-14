import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class ChargerTrendEvent extends BaseEntity {
  @Column({ nullable: true })
  charger_id: string;

  @Column({ nullable: true })
  mapped_status: string;

  @Column({ nullable: true })
  from_timestamp: Date;

  @Column({ nullable: true })
  to_timestamp: Date;

  @Column({ nullable: true, type: 'bigint' })
  duration_in_sec: number;
}
