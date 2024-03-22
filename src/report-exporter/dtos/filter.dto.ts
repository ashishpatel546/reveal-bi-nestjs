import { IsString, IsNotEmpty, IsOptional, IsArray } from "class-validator";

export class Filter {
    @IsString()
    @IsNotEmpty()
    fieldName: string;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    values: string[];
  }