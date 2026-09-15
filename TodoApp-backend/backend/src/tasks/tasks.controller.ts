/**
 * tasks/tasks.controller.ts
 *
 * REST endpoints for task CRUD. Every route is protected by
 * FirebaseAuthGuard, and every service call is scoped to the calling
 * user via @CurrentUser() — no endpoint accepts a userId from the
 * client.
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

@Controller('tasks')
@UseGuards(FirebaseAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@CurrentUser() user: { uid: string }, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.uid, dto);
  }

  @Get()
  findAll(@CurrentUser() user: { uid: string }, @Query() query: QueryTasksDto) {
    return this.tasksService.findAll(user.uid, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: { uid: string }, @Param('id') id: string) {
    return this.tasksService.findOne(user.uid, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { uid: string },
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.uid, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { uid: string }, @Param('id') id: string) {
    return this.tasksService.remove(user.uid, id);
  }
}
