import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {Filter} from './filter.dto'

// DTO for the filters object
// export class Filters {
//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   host_name: string[];

//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   location_name: string[];

//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   serial_number: string[];

//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   asset_id: string[];

//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   country_name: string[];

//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   state: string[];
// }
export class ChargingSessionRequestDto {
  @IsNotEmpty()
  filters: Filter[];

  @IsOptional()
  //   @ValidateNested({ each: true })
  //   @Type(() => RequestedFields)
  requestedFields?: string[];

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  from: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  to: Date;

  @IsNumber()
  @IsNotEmpty()
  page_size: number;

  @IsNumber()
  @IsNotEmpty()
  page_number: number;
}
