import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class State {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  state_code: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country_id: string;

  @Column({ nullable: true })
  country_name: string;

  @Column({ nullable: true })
  country_code: string;

  @Column({ nullable: true })
  currency_name: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  symbol: string;

  @Column({ nullable: true })
  dialing_code: string;

  @Column({ nullable: true })
  support_email: string;

  @Column({ nullable: true })
  support_number: string;
}
