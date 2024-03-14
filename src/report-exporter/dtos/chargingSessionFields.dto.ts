import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsString({ each: true }) // Validate that each item in the array is a string
  serial_number: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Validate that each item in the array is a string
  asset_id: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Validate that each item in the array is a string
  country_code: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Validate that each item in the array is a string
  currency: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Validate that each item in the array is a string
  source: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Validate that each item in the array is a string
  user_membership_plan: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  country_name: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  state: string[];
}

export class ChargingSessionFieldsDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  from: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  to: Date;

  @IsOptional()
  @IsNotEmpty({ each: true })
  emailList: string[];

  @IsOptional()
  requestedFields: string[];

  @IsNotEmpty()
  filters: Filters;
}
