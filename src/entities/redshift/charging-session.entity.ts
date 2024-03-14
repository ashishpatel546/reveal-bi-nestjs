import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity()
export class ChargingSession {
  @PrimaryColumn({ unique: true })
  session_id: string;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  updated_on: Date;

  @Column({ nullable: true })
  session_created_on: Date;

  @Column({ nullable: true })
  session_updated_on: Date;

  @Column({ nullable: true })
  serial_number: string;

  @Column({ nullable: true })
  charging_station_id: string;

  @Column({ nullable: true })
  evse_model_number: string;

  @Column({ nullable: true })
  charger_name: string;

  @Column({ nullable: true })
  fw_version: string;

  @Column({ nullable: true })
  port_id: string;

  @Column({ nullable: true })
  port_name: string;

  @Column({ nullable: true })
  port_number: number;

  @Column({ nullable: true })
  host_id: string;

  @Column({ nullable: true })
  host_name: string;

  @Column({ nullable: true })
  connection_time: Date;

  @Column({ nullable: true })
  disconnect_time: Date;

  @Column({ nullable: true })
  charge_start: Date;

  @Column({ nullable: true })
  charge_end: Date;

  @Column({ nullable: true })
  post_date: Date;

  @Column({ nullable: true })
  total_time: string;

  @Column({ type: 'float8', nullable: true })
  total_kwh: number;

  @Column({ type: 'float8', nullable: true })
  usage_fee: number;

  @Column({ type: 'float8', nullable: true })
  occupancy_fee: number;

  @Column({ type: 'float8', nullable: true })
  service_fee: number;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ nullable: true })
  transaction_mode: string;

  @Column({ type: 'float8', nullable: true })
  total_fee: number;

  @Column({ type: 'float8', nullable: true })
  calculated_tax: number;

  @Column({ type: 'float8', nullable: true })
  tax_rate: number;

  @Column({ type: 'float8', nullable: true })
  nctc_revenue_lost: number;

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
  energy_duration: string;

  @Column({ type: 'float8', nullable: true })
  average_power: number;

  @Column({ nullable: true })
  billable_energy_duration: string;

  @Column({ nullable: true })
  occupancy_time: string;

  @Column({ nullable: true })
  billable_occupancy_time: string;

  @Column({ nullable: true })
  fee_reason_code: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  user_type: string;

  @Column({ nullable: true })
  evse_type: string;

  @Column({ nullable: true })
  blink_code: string;

  @Column({ nullable: true })
  member_email: string;

  @Column({ nullable: true })
  member_first_name: string;

  @Column({ nullable: true })
  member_last_name: string;

  @Column({ nullable: true })
  user_membership_plan: string;

  @Column({ nullable: true })
  fee_currency: string;

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

  @Column({ type: 'float8', nullable: true })
  dollar_saved: number;

  @Column({ type: 'float8', nullable: true })
  max_power: number;

  @Column({ type: 'float8', nullable: true })
  max_current: number;

  @Column({ type: 'float8', nullable: true })
  max_voltage: number;

  @Column({ type: 'float8', nullable: true })
  cost: number;

  @Column({ type: 'float8', nullable: true })
  co2_offset: number;

  @Column({ type: 'float8', nullable: true })
  gasoline_saved_in_gallons: number;

  @Column({ type: 'float8', nullable: true })
  barrels_saved: number;

  @Column({ nullable: true })
  billing_unit_name: string;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  charger_source: string;

  @Column({ nullable: true, type: 'float8' })
  charging_unit_price: number;

  @Column({ nullable: true, type: 'int4' })
  charging_unit_sec: number;

  @Column({ nullable: true })
  user_transaction_id: string;

  @Column({ nullable: true })
  vehicle_id: string;

  @Column({ nullable: true })
  group_name: string;

  @Column({ nullable: true })
  vehicle_name: string;

  @Column({ nullable: true })
  vin: string;

  @Column({ nullable: true })
  auth_type: string;

  @Column({ nullable: true })
  rfid_id: string;

  @Column({ nullable: true })
  rfid_serial_number: string;

  @Column({ nullable: true })
  rfid_code: string;

  @Column({ nullable: true })
  card_csn: string;

  @Column({ nullable: true })
  auth_status: string;

  @Column({ nullable: true })
  auth_time: Date;

  @Column({ nullable: true })
  vendor_id: string;

  @Column({ nullable: true })
  ocpi_token_type: string;

  @Column({ nullable: true })
  asset_id: string;
}
