import { Column, Entity } from 'typeorm';
import { ChargerUptimeSummary } from './charger-uptime-summary.entity';

@Entity()
export class ChargerUptimeSummaryNavi extends ChargerUptimeSummary {
  @Column({ nullable: true })
  port_id: string;

  @Column({ nullable: true })
  port_number: string;

  @Column({ nullable: true })
  unique_port_id: string;
}
