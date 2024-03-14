import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class DeployedCharger {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  updated_on: Date;

  @Column({ nullable: true })
  charger_id: string;

  @Column({ nullable: true })
  charger_created_on: Date;

  @Column({ nullable: true })
  serial_number: string;

  @Column({ nullable: true })
  deploy_date: Date;

  @Column({ nullable: true })
  provisioning_status: string;

  @Column({ nullable: true })
  is_public: boolean;

  @Column({ nullable: true })
  location_id: string;

  @Column({ nullable: true })
  location_name: string;

  @Column({ nullable: true })
  host_id: string;

  @Column({ nullable: true })
  host_name: string;

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
  postal_code: string;

  @Column({ nullable: true })
  time_zone: string;

  @Column({ nullable: true })
  model_id: string;

  @Column({ nullable: true })
  model_name: string;

  @Column({ nullable: true })
  charger_source: string;

  @Column({ nullable: true })
  protocol_version: string;

  @Column({ nullable: true })
  protocol: string;

  @Column({ nullable: true })
  unit_no: string;

  @Column({ nullable: true })
  is_auto_update_enabled: boolean;

  @Column({ nullable: true })
  is_waitlist_enabled: boolean;

  @Column({ nullable: true }) current_firmware_version: string;
  ip_address: string;

  @Column({ nullable: true })
  meid: string;

  @Column({ nullable: true })
  guid: string;

  @Column({ nullable: true })
  published_firmware_version: string;

  @Column({ nullable: true })
  connector_id: string;

  @Column({ nullable: true })
  port_level_id: string;

  @Column({ nullable: true })
  charger_type: string;

  @Column({ nullable: true })
  connector_name: string;

  @Column({ nullable: true })
  asset_id: string;
}
