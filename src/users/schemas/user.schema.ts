import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ default: 'common' })
  type: 'admin' | 'common';
}

export const UserSchema = SchemaFactory.createForClass(User);
