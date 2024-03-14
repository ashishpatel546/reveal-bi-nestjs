import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ChargerUtilization {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true, type: 'date' })
  status_date: Date;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  modified_on: Date;

  @Column({ nullable: true })
  db_entry_date: Date;

  @Column({ nullable: true })
  port_id: string;

  @Column({ nullable: true })
  charger_id: string;

  @Column({ nullable: true })
  install_date: Date;

  @Column({ nullable: true })
  model_name: string;

  @Column({ nullable: true })
  serial_number: string;

  @Column({ nullable: true })
  port_name: string;

  @Column({ nullable: true })
  port_number: string;

  @Column({ nullable: true })
  evse_type: string;

  @Column({ nullable: true })
  connector_type: string;

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
  state: string;

  @Column({ nullable: true })
  country_code: string;

  @Column({ nullable: true })
  country_name: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  from_timestamp: Date;

  @Column({ nullable: true })
  to_timestamp: Date;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true, type: 'bigint' })
  duration_in_sec: number;

  @Column({ nullable: true })
  current_firmware_version: string;

  @Column({ nullable: true })
  last_known_date_time: Date;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  meid: string;

  @Column({ nullable: true })
  provisioning_status: string;

  @Column({ nullable: true })
  published_firmware_version: string;

  @Column({ nullable: true })
  guid: string;

  @Column({ nullable: true })
  unit_no: string;

  @Column({ nullable: true })
  protocol: string;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  charger_status: string;

  @Column({ nullable: true })
  mobile_signal_strength: string;

  @Column({ nullable: true })
  ICCID: string;

  @Column({ nullable: true })
  IMSI: string;

  @Column({ nullable: true })
  IMEI: string;

  @Column({ nullable: true })
  active_device: string;

  @Column({ nullable: true })
  active_ip: string;

  @Column({ nullable: true })
  active_netmask: string;

  @Column({ nullable: true })
  gateway_serial_number: string;

  @Column({ nullable: true })
  connectivity: string;

  @Column({ nullable: true })
  asset_id: string;
}
