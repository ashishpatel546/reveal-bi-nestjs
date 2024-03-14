import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class BillingReconciliation {
  @PrimaryColumn()
  billing_transaction_id: string;

  @Column({ nullable: true })
  order_id: string;

  @Column({ nullable: true })
  transaction_date: Date;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  updated_on: Date;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  transaction_type: string;

  @Column({ nullable: true, type: 'float8' })
  amount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  gateway_id: string;

  //   @Column({ nullable: true, type: 'varchar', length: 65535 })
  //   gateway_reference_id: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  address_line1: string;

  @Column({ nullable: true })
  address_line2: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  country_name: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  mobile_number: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  payment_method_id: string;
  @Column({ nullable: true })
  success: boolean;

  @Column({ nullable: true })
  account_last_four_digit: string;

  @Column({ nullable: true })
  auth_billing_transaction_id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  exp_month: string;

  @Column({ nullable: true })
  exp_year: string;

  //   @Column({ nullable: true, type: 'varchar', length: 65535 })
  //   gateway_payment_method_id: string;

  @Column({ nullable: true })
  payment_gateway_id: string;

  @Column({ nullable: true })
  payment_type_id: string;

  @Column({ nullable: true })
  payment_type_name: string;
}
