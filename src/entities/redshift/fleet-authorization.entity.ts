import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FleetAuthorization {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  auth_date: Date;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  updated_on: Date;

  @Column({ nullable: true })
  vehicle_name: string;

  @Column({ nullable: true })
  vehicle_make: string;

  @Column({ nullable: true })
  vehicle_model: string;

  @Column({ nullable: true })
  vehicle_vin: string;

  @Column({ nullable: true })
  station_name: string;

  @Column({ nullable: true })
  serial_number: string;

  @Column({ nullable: true })
  card_number: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  location_name: string;

  @Column({ nullable: true })
  charger_id: string;

  @Column({ nullable: true })
  asset_id: string;

  @Column({ nullable: true })
  location_id: string;

  @Column({ nullable: true })
  address_id: string;

  @Column({ nullable: true })
  address_line1: string;

  @Column({ nullable: true })
  address_line2: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country_code: string;

  @Column({ nullable: true })
  country_name: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  host_name: string;

  @Column({ nullable: true })
  host_id: string;

  @Column({ nullable: true })
  fleet_group_name: string;

  @Column({ nullable: true })
  fleet_group_id: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  transaction_id: string;
}
