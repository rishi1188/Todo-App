/**
 * tasks/dto/query-tasks.dto.ts
 *
 * Query params accepted by GET /tasks, e.g.:
 *   GET /tasks?completed=false&priority=high&tag=work&sortBy=smart
 */

import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Priority } from '../enums/priority.enum';

export enum SortMode {
  SMART = 'smart', // mixed time + deadline + priority score (default)
  DEADLINE = 'deadline', // soonest deadline first
  PRIORITY = 'priority', // highest priority first
  CREATED = 'created', // newest first
}

export class QueryTasksDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsEnum(SortMode)
  sortBy?: SortMode;
}
