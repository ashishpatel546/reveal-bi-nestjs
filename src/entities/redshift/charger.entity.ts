import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Charger {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  updated_on: Date;

  @Column({ nullable: true })
  charger_id: string;

  @Column({ nullable: true })
  is_active: boolean;

  @Column({ nullable: true })
  charger_created_on: Date;

  @Column({ nullable: true })
  charger_updated_on: Date;

  @Column({ nullable: true })
  serial_number: string;

  @Column({ nullable: true })
  deploy_date: Date;

  @Column({ nullable: true })
  provisioning_status: string;

  @Column({ nullable: true })
  is_public: boolean;

  @Column({ nullable: true })
  current_firmware_version: string;

  @Column({ nullable: true })
  last_known_date_time: Date;

  @Column({ nullable: true })
  meid: string;

  @Column({ nullable: true })
  charger_name: string;

  @Column({ nullable: true })
  charger_status: string;

  @Column({ nullable: true })
  mapped_status: string;

  @Column({ nullable: true })
  model_id: string;

  @Column({ nullable: true })
  model_name: string;

  @Column({ nullable: true })
  guid: string;

  @Column({ nullable: true })
  protocol_version: string;

  @Column({ nullable: true })
  unit_no: string;

  @Column({ nullable: true })
  wss_status: string;

  @Column({ nullable: true })
  wss_status_time: Date;

  @Column({ nullable: true })
  charger_source: string;

  @Column({ nullable: true })
  port_status: string;

  @Column({ nullable: true })
  status_code: string;

  @Column({ nullable: true })
  port_id: string;

  @Column({ nullable: true })
  port_name: string;

  @Column({ nullable: true, type: 'int4' })
  port_number: number;

  @Column({ nullable: true })
  location_id: string;

  @Column({ nullable: true })
  location_name: string;

  @Column({ nullable: true })
  host_id: string;

  @Column({ nullable: true })
  host_name: string;

  @Column({ nullable: true })
  evse_type: string;

  @Column({ nullable: true })
  port_level_id: string;

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
  time_zone: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  asset_id: string;
}
