import { Tables } from 'src/glolbal-interfaces/redshift-cubes';
import { TriggerType } from 'src/glolbal-interfaces/trigger-types';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Metadata {
  @PrimaryColumn('text')
  table_name: Tables;

  @Column({ nullable: true })
  created_on: Date;

  @Column({ nullable: true })
  updated_on: Date;

  @Column({ nullable: true })
  last_triggered_on: Date;

  @Column('text')
  last_triggered_type: TriggerType;

  @Column({ nullable: true })
  fething_criteria: string;

  @Column({ nullable: true })
  is_being_updated: boolean;
}
