import { Column, Entity } from 'typeorm';
import { ChargerUptime } from './charger-uptime.entity';

@Entity()
export class ChargerUptimeNavi extends ChargerUptime {
  @Column({ nullable: true })
  port_id: string;

  @Column({ nullable: true })
  port_number: string;

  @Column({ nullable: true })
  unique_port_id: string;
}
