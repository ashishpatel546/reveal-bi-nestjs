import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// export class RequestedFields {
//   @IsString()
//   @IsNotEmpty()
//   fieldName: string;

//   @IsArray()
//   values: string[];
// }

export class Filter {
  @IsString()
  @IsNotEmpty()
  fieldName: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  values: string[];
}

export class GraphDistinctValueRequestDto {
  @IsNotEmpty()
  @IsString()
  table_name: string;

  //   @IsArray()
  //   @ValidateNested({ each: true })
  //   @Type(() => RequestedFields)
  @IsArray()
  @IsString({ each: true })
  requestedFields: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Filter)
  filters: Filter[];
}
