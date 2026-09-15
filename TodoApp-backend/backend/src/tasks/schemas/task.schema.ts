/**
 * tasks/schemas/task.schema.ts
 *
 * Mongoose schema/document for a task. `userId` stores the Firebase
 * uid of the owner (set from the verified token, never from client
 * input) so every query can be scoped with `{ userId }`.
 *
 * The toJSON transform converts MongoDB's `_id` into a plain `id`
 * string field (and strips `_id`/`__v`) before the document is ever
 * sent as an API response — this Mongoose version no longer includes
 * the `id` virtual in JSON output by default, but the mobile app's
 * Task type expects `id`, so this keeps the API contract consistent.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Priority } from '../enums/priority.enum';

@Schema({
  timestamps: { createdAt: true, updatedAt: true },
  toJSON: {
    transform: (_doc, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '', trim: true })
  description: string;

  @Prop({ required: true })
  dateTime: Date;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ type: String, enum: Priority, default: Priority.MEDIUM })
  priority: Priority;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  completed: boolean;

  @Prop({ required: true, index: true })
  userId: string;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);