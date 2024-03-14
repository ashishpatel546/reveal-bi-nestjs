import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class ChargerTrend extends BaseEntity {
  @Column({ nullable: true })
  charger_id: string;

  @Column({ nullable: true })
  charger_status: string;

  @Column('simple-json', { nullable: true })
  port_status: string[];

  @Column({ nullable: true })
  mapped_status: string;

  @Column({ nullable: true })
  provisioning_status: string;
}
