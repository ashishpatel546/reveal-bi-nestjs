import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ChargingSessionDetails {
  @PrimaryColumn({ unique: true })
  interval_id: string;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  updated_on: Date;

  @Column({ nullable: true })
  serial_number: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  charging_station_id: string;

  @Column({ nullable: true })
  host_id: string;

  @Column({ nullable: true })
  session_id: string;

  @Column({ nullable: true })
  session_connect_time: Date;

  @Column({ nullable: true })
  session_disconnect_time: Date;

  @Column({ nullable: true })
  session_duration: string;

  @Column({ type: 'float8', nullable: true })
  session_avg_power: number;

  @Column({ type: 'float8', nullable: true })
  session_energy: number;

  @Column({ type: 'float8', nullable: true })
  session_fee: number;

  @Column({ nullable: true })
  interval_start_time: Date;

  @Column({ nullable: true })
  interval_end_time: Date;

  @Column({ type: 'float8', nullable: true })
  interval_energy: number;

  @Column({ nullable: true })
  interval_duration: string;

  @Column({ type: 'float8', nullable: true })
  interval_max_power: number;

  @Column({ type: 'float8', nullable: true })
  interval_avg_power: number;

  @Column({ nullable: true })
  interval_created_on: Date;

  @Column({ nullable: true })
  interval_updated_on: Date;

  @Column({ type: 'float8', nullable: true })
  interval_current: number;

  @Column({ type: 'float8', nullable: true })
  interval_temperature: number;

  @Column({ type: 'float8', nullable: true })
  interval_voltage: number;

  @Column({ type: 'float8', nullable: true })
  interval_meter_energy: number;

  @Column({ nullable: true })
  evse_model_number: string;

  @Column({ nullable: true })
  port_id: string;

  @Column({ nullable: true })
  port_name: string;

  @Column({ nullable: true })
  port_number: number;

  @Column({ nullable: true })
  host_name: string;

  @Column({ nullable: true })
  location_name: string;

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
  session_energy_duration: string;

  @Column({ nullable: true })
  user_type: string;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  charger_source: string;

  @Column({ nullable: true })
  charger_name: string;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ type: 'float8', nullable: true })
  power_throttled_value: number;

  @Column({ type: 'float8', nullable: true })
  port_max_power: number;

  @Column({ nullable: true })
  rfid_serial_number: string;

  @Column({ nullable: true })
  rfid_code: string;

  @Column({ nullable: true })
  group_name: string;

  @Column({ nullable: true })
  vin: string;

  @Column({ nullable: true })
  vehicle_id: string;

  @Column({ nullable: true })
  vehicle_name: string;

  @Column({ nullable: true })
  auth_type: string;

  @Column({ nullable: true })
  load_enabled: number;

  @Column({ nullable: true })
  asset_id: string;
}
