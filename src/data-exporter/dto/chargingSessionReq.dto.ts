import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// DTO for the filters object
export class Filters {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  host_name: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  location_name: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serial_number: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  asset_id: string[];
}

// DTO for the requested fields object
// export class RequestedFields {
//   @IsOptional()
//   @IsDate()
//   post_date?: string;

//   @IsOptional()
//   @IsString()
//   host_name?: string;

//   @IsOptional()
//   @IsString()
//   serial_number?: string;

//   @IsOptional()
//   @IsString()
//   location_name?: string;

//   @IsOptional()
//   @IsString()
//   asset_id?: string;

//   @IsOptional()
//   @IsString()
//   total_fee?: string;

//   // Add more fields as needed
// }

// Main DTO combining both filters and requested fields
export class ChargingSessionRequestDto {
  @IsNotEmpty()
  filters: Filters;

  @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => RequestedFields)
  requestedFields?: string[];

  @IsNotEmpty()
  @IsString()
  from: Date;

  @IsNotEmpty()
  @IsString()
  to: Date;

  
  @IsNumber()
  @IsNotEmpty()
  page_size: number;

  @IsNumber()
  @IsNotEmpty()
  page_number: number;
}
