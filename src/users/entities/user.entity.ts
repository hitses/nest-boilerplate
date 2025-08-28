import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum AuthProvider {
  GOOGLE = 'google',
}

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ lowercase: true, trim: true })
  firstName?: string;

  @Prop({ lowercase: true, trim: true })
  lastName?: string;

  @Prop({ enum: AuthProvider, required: true })
  authProvider: AuthProvider;

  @Prop({ required: true })
  providerId: string;

  @Prop()
  profilePicture?: string;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: 0 })
  sessionVersion: number;

  @Prop({ type: Map, of: String })
  metadata?: Map<string, string>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ authProvider: 1, providerId: 1 }, { unique: true });
UserSchema.index({ role: 1 });
