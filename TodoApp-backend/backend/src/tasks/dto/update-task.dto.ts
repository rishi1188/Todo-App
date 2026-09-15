/**
 * tasks/dto/update-task.dto.ts
 *
 * PATCH /tasks/:id body. Extending CreateTaskDto with PartialType would
 * need @nestjs/mapped-types; written out explicitly here so every field
 * is clearly optional at a glance.
 */

import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Priority } from '../enums/priority.enum';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dateTime?: string;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
