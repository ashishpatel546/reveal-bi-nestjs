import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ChargerUsage {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  modified_on: Date;

  @Column({ nullable: true, type: 'date' })
  interval_date: Date;

  @Column({ nullable: true })
  host_id: string;

  @Column({ nullable: true })
  host_name: string;

  @Column({ nullable: true })
  location_name: string;

  @Column({ nullable: true })
  no_of_sessions: number;

  @Column({ nullable: true })
  from_hour: string;

  @Column({ nullable: true })
  to_hour: string;

  @Column({ nullable: true, type: 'float8' })
  energy_consumed_kWh: number;

  @Column({ nullable: true })
  location_id: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  time_zone: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  address_id: string;

  @Column({ nullable: true })
  address_line1: string;

  @Column({ nullable: true })
  address_line2: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country_code: string;

  @Column({ nullable: true })
  country_name: string;

  @Column({ nullable: true })
  state_name: string;

  @Column({ nullable: true })
  source: string;
}
