import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RfidRequest {
  @PrimaryColumn()
  rfid_request_id: string;

  @Column({ nullable: true })
  number_of_cards: number;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  request_created_on: Date;

  @Column({ nullable: true })
  updated_on: Date;

  @Column({ nullable: true })
  user_id: string;

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
  country_code: string;

  @Column({ nullable: true })
  mobile_number: string;

  @Column({ nullable: true })
  user_name: string;

  @Column({ nullable: true })
  email: string;
}
