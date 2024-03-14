import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum USER_ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TECH_ROLE = 'TECH_ROLE',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  created_on: Date;

  @Column()
  updated_on: Date;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  mobile: string;

  @Column()
  password: string;

  @Column({ type: 'varchar' })
  role: USER_ROLE;

  @Column({ default: false })
  is_active: boolean;
}
