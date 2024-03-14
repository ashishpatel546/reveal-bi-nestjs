import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class User_Statement {
  @Column({ nullable: true })
  user_id: string;

  @PrimaryColumn({ unique: true })
  statement_id: string;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ nullable: true })
  transaction_type: string;

  @Column({ nullable: true })
  transaction_date: Date;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  updated_on: Date;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  charging_session_id: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  payment_transaction_id: string;

  @Column({ nullable: true })
  payment_status: string;

  @Column({ nullable: true })
  payment_gateway: string;

  @Column({ nullable: true })
  error_message: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 'max',
  })
  error_message_details: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  blink_code: string;

  @Column({ nullable: true })
  membership_type: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  user_email: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  dialing_code: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  address_line1: string;

  @Column({ nullable: true })
  address_line2: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  time_zone: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country_code: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  refund_initiated_by_id: string;

  @Column({ nullable: true })
  refund_initiated_by_email: string;

  @Column({ nullable: true })
  refund_initiated_by_name: string;
}
