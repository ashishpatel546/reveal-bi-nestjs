import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Location extends BaseEntity {
  @Column({ nullable: true })
  location_id: string;

  @Column({ nullable: true })
  location_created_on: Date;

  @Column({ nullable: true })
  location_updated_on: Date;

  @Column({ nullable: true, type: 'bool' })
  is_public: boolean;

  @Column({ nullable: true })
  location_name: string;

  @Column({ nullable: true })
  location_status: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, type: 'bool' })
  is_active: boolean;

  @Column({ nullable: true })
  location_crm_id: string;

  @Column({ nullable: true, type: 'float8' })
  guest_pricing: number;

  @Column({ nullable: true, type: 'float8' })
  member_pricing: number;

  @Column({ nullable: true, type: 'bool' })
  is_flexible_pricing_plan: boolean;

  @Column({ nullable: true, type: 'bool' })
  is_network_load_management: boolean;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true, type: 'bool' })
  is_wait_list_enabled: boolean;

  @Column({ nullable: true })
  host_id: string;

  @Column({ nullable: true })
  host_name: string;

  @Column({ nullable: true })
  host_crm_id: string;

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
}
