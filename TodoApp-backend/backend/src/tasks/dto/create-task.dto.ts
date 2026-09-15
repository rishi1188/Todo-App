/**
 * tasks/dto/create-task.dto.ts
 *
 * Validates the request body for POST /tasks. `userId` is intentionally
 * absent here — it's set server-side from the verified Firebase token,
 * never trusted from client input (otherwise a user could create tasks
 * under someone else's uid).
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Priority } from '../enums/priority.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  dateTime: string;

  @IsDateString()
  deadline: string;

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
