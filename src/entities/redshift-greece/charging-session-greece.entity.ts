import { Entity } from 'typeorm';
import { ChargingSession } from '../redshift/charging-session.entity';

@Entity()
export class ChargingSessionGreece extends ChargingSession {}
