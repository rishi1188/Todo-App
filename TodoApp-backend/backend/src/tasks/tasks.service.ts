/**
 * tasks/tasks.service.ts
 *
 * All database access for tasks lives here. Every method takes the
 * calling user's uid explicitly and includes it in the Mongo query/
 * update filter, so there's no path by which one user can read or
 * modify another user's tasks even if they guess a valid task id.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto, SortMode } from './dto/query-tasks.dto';
import { sortTasksSmart } from './utils/sort-tasks.util';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(userId: string, dto: CreateTaskDto): Promise<TaskDocument> {
    const task = new this.taskModel({ ...dto, userId });
    return task.save();
  }

  async findAll(userId: string, query: QueryTasksDto): Promise<TaskDocument[]> {
    const filter: Record<string, unknown> = { userId };
    if (query.completed !== undefined) filter.completed = query.completed;
    if (query.priority) filter.priority = query.priority;
    if (query.tag) filter.tags = query.tag;

    const tasks = await this.taskModel.find(filter).exec();

    switch (query.sortBy) {
      case SortMode.DEADLINE:
        return tasks.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
      case SortMode.PRIORITY: {
        const order = { high: 0, medium: 1, low: 2 };
        return tasks.sort((a, b) => order[a.priority] - order[b.priority]);
      }
      case SortMode.CREATED:
        return tasks.sort(
          (a, b) => (b as any).createdAt.getTime() - (a as any).createdAt.getTime(),
        );
      case SortMode.SMART:
      default:
        return sortTasksSmart(tasks);
    }
  }

  async findOne(userId: string, id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    if (!task) throw new NotFoundException('Task not found.');
    return task;
  }

  async update(userId: string, id: string, dto: UpdateTaskDto): Promise<TaskDocument> {
    const task = await this.taskModel
      .findOneAndUpdate({ _id: id, userId }, dto, { new: true })
      .exec();
    if (!task) throw new NotFoundException('Task not found.');
    return task;
  }

  async remove(userId: string, id: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Task not found.');
  }
}
