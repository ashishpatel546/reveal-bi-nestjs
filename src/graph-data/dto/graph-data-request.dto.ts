import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Reports } from '../enum/report-enum';
import { FetchingCriteria } from '../enum/fetching-criteria-enums';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Filter } from './filter.dto';

export class QuarterWise {
  @IsNotEmpty()
  @IsBoolean()
  isQaurterWise: boolean;

  @IsNotEmpty()
  @IsNumber()
  year: number;
}

export class MonthWise {
  @IsNotEmpty()
  @IsBoolean()
  isMonthWise: boolean;

  @IsNotEmpty()
  @IsNumber()
  year: number;
}

export class YearWise {
  @IsBoolean()
  isYearWise: boolean;

  @IsNotEmpty()
  @IsNumber()
  from_year: number;

  @IsNotEmpty()
  @IsNumber()
  to_year: number;

}

export class Daywise {
  @IsNotEmpty()
  @IsBoolean()
  isDayWise: boolean;

  @ApiProperty({ name: 'from', description: 'Put the date in YYYY-MM-DD' })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  from: Date;

  @ApiProperty({ name: 'to', description: 'Put the date in YYYY-MM-DD' })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  to: Date;
}

export class GraphDataRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(Reports)
  report_name: Reports;

  @IsOptional()
  @IsString()
  @IsEnum(FetchingCriteria)
  fetching_crieteria: FetchingCriteria;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Filter)
  filters: Filter[];

  @ApiProperty({
    name: 'year_wise',
    description: 'Put the values if fetching criteria seleted year_wise',
  })
  @IsOptional()
  year_wise: YearWise;

  @ApiProperty({
    name: 'quarter_wise',
    description: 'Put the values if fetching criteria seleted quarter_wise',
  })
  @IsOptional()
  quarter_wise: QuarterWise;

  @ApiProperty({
    name: 'day_wise',
    description: 'Put the values if fetching criteria seleted date_wise',
  })
  @IsOptional()
  day_wise: Daywise;

  @ApiProperty({
    name: 'month_wise',
    description: 'Put the values if fetching criteria seleted month_wise',
  })
  @IsOptional()
  month_wise: MonthWise;
}
