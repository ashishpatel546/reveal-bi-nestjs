import { ChargingSession } from 'src/entities/redshift/charging-session.entity';

export interface ChargingSessionDataResponse {
  total_records: number;
  page_number: number;
  current_page_size: number;
  records: ChargingSession[];
}
