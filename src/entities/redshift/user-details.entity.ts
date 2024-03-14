import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class UserDetails {
  @Column({ unique: true })
  id: string;

  @PrimaryColumn({ unique: true })
  user_id: string;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  user_created_on: Date;

  @Column({ nullable: true })
  user_modified_on: Date;

  @Column({ nullable: true })
  updated_on: Date;

  @Column({ nullable: true })
  fax: string;

  @Column({ nullable: true })
  last_login_time: Date;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  notification_enabled: string;

  @Column({ nullable: true })
  photo_reference: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  crm_id: string;

  @Column({ nullable: true })
  dialing_code: string;

  @Column({ nullable: true })
  language_code: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  host_id: string;

  @Column({ nullable: true })
  is_email_verified: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  birth_date: Date;

  @Column({ nullable: true })
  mobile_temp: string;

  @Column({ nullable: true })
  is_power_bi_financial_allowed: boolean;

  @Column({ nullable: true })
  membership_status: string;

  @Column({ nullable: true })
  membership_type: string;

  @Column({ nullable: true })
  user_currency: string;

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
  is_guest: boolean;
}
